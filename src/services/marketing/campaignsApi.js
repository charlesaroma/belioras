import couponsSeed from "../../data/coupons.json";

import { ApiError, mockApi } from "@/api/mock";
import { getState, setState } from "../store/contentStore";
import { liveItems, removeItem } from "../store/storeCollections";
import { audited } from "../auth/audited";

/**
 * Campaigns: one-off emails to every confirmed subscriber. Draft, then
 * scheduled or sent. Also the welcome email's settings.
 *
 * Nothing is delivered from here. A sent campaign records how many confirmed
 * subscribers it went to at that moment; delivery, opens and clicks come from
 * the email service once the backend connects one. A sent campaign cannot be
 * edited or deleted, because it is the record of what people received.
 */

const items = () => liveItems("campaigns");
const write = (next) => setState("campaigns", (s) => ({ ...s, items: next(s.items) }));
const now = () => new Date().toISOString();
const audience = () => liveItems("subscribers").filter((s) => s.status === "subscribed").length;
const text = (value) => String(value ?? "").trim();

function find(id) {
  const campaign = items().find((c) => c.id === id);
  if (!campaign) throw new ApiError("That campaign no longer exists.", 404);
  if (campaign.status === "sent") {
    throw new ApiError("A sent campaign can't be changed: it is the record of what subscribers received.", 409);
  }
  return campaign;
}

function replace(updated) {
  write((list) => list.map((c) => (c.id === updated.id ? updated : c)));
  return updated;
}

function assertReady(campaign) {
  if (!campaign.heading) throw new ApiError("Add a heading before sending.", 422);
  if (!campaign.body) throw new ApiError("Write the message before sending.", 422);
}

export function getCampaigns() {
  const when = (c) => Date.parse(c.sentAt ?? c.sendAt ?? c.updatedAt);
  return mockApi(() => [...items()].sort((a, b) => when(b) - when(a)));
}

/** How many people a campaign would reach if sent now. */
export function getAudienceSize() {
  return mockApi(() => audience(), 0);
}

function saveCampaign$raw(input = {}) {
  return mockApi(() => {
    const fields = {
      subject: text(input.subject),
      previewText: text(input.previewText),
      heading: text(input.heading),
      body: text(input.body),
      productIds: (input.productIds ?? []).slice(0, 4),
      cta: { label: text(input.cta?.label), url: input.cta?.url || "/shop" },
    };
    if (!fields.subject) throw new ApiError("Add a subject line.", 422);

    if (input.id) return replace({ ...find(input.id), ...fields, updatedAt: now() });

    const created = { id: `cmp_${Date.now().toString(36)}`, ...fields, status: "draft", sendAt: null, sentAt: null, recipients: null, createdAt: now(), updatedAt: now() };
    write((list) => [created, ...list]);
    return created;
  });
}

function scheduleCampaign$raw(id, sendAt) {
  return mockApi(() => {
    const campaign = find(id);
    assertReady(campaign);
    const time = Date.parse(sendAt ?? "");
    if (Number.isNaN(time) || time <= Date.now()) throw new ApiError("Choose a date and time in the future.", 422);
    return replace({ ...campaign, status: "scheduled", sendAt: new Date(time).toISOString(), updatedAt: now() });
  });
}

export function unscheduleCampaign(id) {
  return mockApi(() => replace({ ...find(id), status: "draft", sendAt: null, updatedAt: now() }));
}

function sendCampaign$raw(id) {
  return mockApi(() => {
    const campaign = find(id);
    assertReady(campaign);
    const recipients = audience();
    if (!recipients) throw new ApiError("There are no confirmed subscribers to send to yet.", 422);
    return replace({ ...campaign, status: "sent", sentAt: now(), sendAt: null, recipients, updatedAt: now() });
  });
}

function deleteCampaign$raw(id) {
  return mockApi(() => {
    const campaign = find(id);
    removeItem("campaigns", id);
    return campaign;
  });
}

export function getNewsletterSettings() {
  return mockApi(() => ({ ...getState("newsletter") }), 0);
}

/** The automatic email sent once, when someone confirms their subscription. */
function updateWelcomeEmail$raw(input = {}) {
  return mockApi(() => {
    const welcome = {
      enabled: Boolean(input.enabled),
      couponCode: input.couponCode || null,
      subject: text(input.subject),
      heading: text(input.heading),
      body: text(input.body),
    };
    if (welcome.enabled && (!welcome.subject || !welcome.heading || !welcome.body)) {
      throw new ApiError("Give the welcome email a subject, heading and message, or turn it off.", 422);
    }
    if (welcome.couponCode && !couponsSeed.some((c) => c.code === welcome.couponCode && c.active)) {
      throw new ApiError("That code is not an active coupon.", 422);
    }
    setState("newsletter", (state) => ({ ...state, welcome }));
    return welcome;
  });
}

/* Recorded in the staff activity log. */
export const saveCampaign = audited("newsletter", (_, r) => `Saved campaign “${r.subject ?? "untitled"}”`, saveCampaign$raw);
export const scheduleCampaign = audited("newsletter", ([id]) => `Scheduled campaign ${id}`, scheduleCampaign$raw);
export const sendCampaign = audited("newsletter", (_, r) => `Sent campaign “${r.subject ?? ""}”`, sendCampaign$raw);
export const deleteCampaign = audited("newsletter", ([id]) => `Deleted campaign ${id}`, deleteCampaign$raw);
export const updateWelcomeEmail = audited("newsletter", () => "Updated the welcome email", updateWelcomeEmail$raw);

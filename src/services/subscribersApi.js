import { ApiError, mockApi } from "@/api/mock";
import { getState, setState } from "./contentStore";
import { liveItems, removeItem } from "./storeCollections";

/**
 * The Belioras Letter's audience, with the rules an email service applies.
 *
 * Joining is double opt-in: a sign-up stays `pending` until its confirmation
 * link is followed, and only `subscribed` people are sent campaigns. Each
 * record keeps when, where and to what wording consent was given. The welcome
 * code is sent once per address, on first confirmation, so leaving and joining
 * again does not earn a second one.
 *
 * Unsubscribing never deletes the record: it stays `unsubscribed`, so a later
 * import or sync cannot quietly add the person back. Erasure, for a GDPR
 * request, deletes it entirely.
 *
 * Nothing here sends email. When the backend connects an email service, the
 * confirmation and welcome emails go out on the same transitions made here.
 */

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** A confirmation link opened twice in quick succession still reads as fresh. */
const FRESH_MS = 10 * 60 * 1000;

const items = () => liveItems("subscribers");
const write = (next) => setState("subscribers", (s) => ({ ...s, items: next(s.items) }));
const now = () => new Date().toISOString();

function linkToken() {
  const bytes = new Uint8Array(12);
  crypto.getRandomValues(bytes);
  return [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function address(email) {
  const value = String(email ?? "").trim().toLowerCase();
  if (!EMAIL.test(value)) throw new ApiError("Please enter a valid email address.", 422);
  return value;
}

function patch(id, fields) {
  write((list) => list.map((s) => (s.id === id ? { ...s, ...fields } : s)));
}

/** Starts, or restarts, a sign-up. Ends pending unless the address is already subscribed. */
export function subscribe({ email, name = null, userId = null, source = "footer" } = {}) {
  return mockApi(() => {
    const value = address(email);
    const existing = items().find((s) => s.email === value);
    if (existing?.status === "subscribed") return { status: "subscribed", email: value };

    const fields = {
      status: "pending",
      source,
      consentText: getState("newsletter").consentText,
      consentedAt: now(),
      confirmedAt: null,
      unsubscribedAt: null,
      token: linkToken(),
    };

    if (existing) patch(existing.id, { ...fields, name: existing.name ?? name, userId: existing.userId ?? userId });
    else {
      const record = { id: `sub_${Date.now().toString(36)}`, email: value, name, userId, welcomeCode: null, welcomeSentAt: null, ...fields };
      write((list) => [...list, record]);
    }
    return { status: "pending", email: value, token: fields.token };
  });
}

/** The confirmation link. Subscribes the address and, the first time, issues the welcome code. */
export function confirmSubscription(token) {
  return mockApi(() => {
    const record = items().find((s) => s.token && s.token === token);
    if (!record) throw new ApiError("This link has expired, or a newer one has replaced it.", 404);
    if (record.status === "unsubscribed" || record.status === "bounced") {
      throw new ApiError("This link is no longer active. Sign up again to rejoin the Letter.", 410);
    }

    if (record.status === "subscribed") {
      const fresh = Date.now() - Date.parse(record.confirmedAt ?? 0) < FRESH_MS;
      // A second open of the same link (a mail scanner, or React's dev double run) still shows a code
      // sent at this confirmation, never one from an earlier subscription.
      const sentNow = fresh && record.welcomeSentAt === record.confirmedAt;
      return { email: record.email, welcomeCode: sentNow ? record.welcomeCode : null, already: !fresh };
    }

    // Someone rejoining keeps the code they were first sent, and is not shown it again.
    const { welcome } = getState("newsletter");
    const code = record.welcomeSentAt ? null : welcome?.enabled ? welcome.couponCode : null;
    const at = now();
    patch(record.id, { status: "subscribed", confirmedAt: at, ...(code && { welcomeCode: code, welcomeSentAt: at }) });
    return { email: record.email, welcomeCode: code, already: false };
  });
}

/** The link in every email. */
export function unsubscribe(token) {
  return mockApi(() => {
    const record = items().find((s) => s.token && s.token === token);
    if (!record) throw new ApiError("We could not find that subscription. It may already have been removed.", 404);
    if (record.status !== "unsubscribed") patch(record.id, { status: "unsubscribed", unsubscribedAt: now() });
    return { email: record.email };
  });
}

/** From a signed-in customer's account settings. */
export function unsubscribeByEmail(email) {
  return mockApi(() => {
    const record = items().find((s) => s.email === address(email));
    if (record && record.status !== "unsubscribed") patch(record.id, { status: "unsubscribed", unsubscribedAt: now() });
    return { email: address(email) };
  });
}

/** A customer's own subscription. The token is returned only while pending, for the demo link. */
export function getSubscription(email) {
  return mockApi(() => {
    if (!email) return null;
    const record = items().find((s) => s.email === String(email).trim().toLowerCase());
    if (!record) return null;
    return { status: record.status, confirmedAt: record.confirmedAt, token: record.status === "pending" ? record.token : null };
  }, 0);
}

export function getSubscribers() {
  return mockApi(() => [...items()].sort((a, b) => Date.parse(b.consentedAt) - Date.parse(a.consentedAt)));
}

/** From the dashboard: stops all email to this person straight away. */
export function unsubscribeSubscriber(id) {
  return mockApi(() => {
    const record = items().find((s) => s.id === id);
    if (!record) throw new ApiError("That subscriber no longer exists.", 404);
    patch(id, { status: "unsubscribed", unsubscribedAt: now() });
    return { ...record, status: "unsubscribed" };
  });
}

/** A GDPR erasure: the address and its consent record are deleted entirely. */
export function eraseSubscriber(id) {
  return mockApi(() => {
    const record = items().find((s) => s.id === id);
    if (!record) throw new ApiError("That subscriber no longer exists.", 404);
    removeItem("subscribers", id);
    return record;
  });
}

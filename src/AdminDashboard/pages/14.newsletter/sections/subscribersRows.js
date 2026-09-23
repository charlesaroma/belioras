/* Subscriber List Helpers */
import { downloadCsv, toCsv } from "../../../lib/csv";

const DAY = 24 * 60 * 60 * 1000;

export function subscriberStats(rows) {
  const by = (status) => rows.filter((r) => r.status === status).length;
  const since = Date.now() - 30 * DAY;
  return {
    subscribed: by("subscribed"),
    pending: by("pending"),
    unsubscribed: by("unsubscribed"),
    recent: rows.filter((r) => r.status === "subscribed" && Date.parse(r.confirmedAt ?? "") >= since).length,
  };
}

/** Status tabs, counted over the whole list. */
export function statusTabs(rows) {
  const by = (status) => rows.filter((r) => r.status === status).length;
  return [
    { value: "all", label: "All", count: rows.length },
    { value: "subscribed", label: "Subscribed", count: by("subscribed") },
    { value: "pending", label: "Awaiting confirmation", count: by("pending") },
    { value: "unsubscribed", label: "Unsubscribed", count: by("unsubscribed") },
    { value: "bounced", label: "Bounced", count: by("bounced") },
  ];
}

const CSV_COLUMNS = [
  ["email", "Email"],
  ["name", "Name"],
  ["status", "Status"],
  ["source", "Signed up from"],
  ["consentedAt", "Consent given"],
  ["confirmedAt", "Confirmed"],
];

/** A spreadsheet-safe CSV of the subscribers given (see lib/csv). */
export function subscribersCsv(rows) {
  return toCsv(CSV_COLUMNS, rows);
}

export { downloadCsv };

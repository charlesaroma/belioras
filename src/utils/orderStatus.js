/**
 * One order status vocabulary.
 *
 * Three of them were in play and none agreed:
 *
 *   orders.json          pending · paid · shipped · delivered · cancelled · refunded
 *   account pages        pending · processing · shipped · delivered · cancelled · refunded
 *   Dashboard constants  to-pay · to-ship · shipped · to-review · reviewed + legacy keys
 *
 * `paid` was missing from two of the three, so the paid orders in the fixtures
 * rendered a blank chip on both the account pages and the dashboard. And
 * `refunded` was absent from the tracker's stage map, where the `?? 0` fallback
 * displayed a refunded order as "To pay" — telling a customer who had already
 * been reimbursed that they still owed money.
 *
 * The canonical set is the four client-facing stages agreed in the design
 * review, plus the two outcomes that leave the timeline. Everything else is an
 * alias resolved by normalizeStatus, so fixtures, the dashboard and any future
 * backend can each speak their own dialect and still agree on what to show.
 */

/** The four stages a healthy order passes through, in order. */
export const ORDER_STAGES = [
  { id: "to-pay", label: "To pay", blurb: "Awaiting payment." },
  { id: "to-ship", label: "To ship", blurb: "Paid, being prepared in Lisbon." },
  { id: "shipped", label: "Shipped", blurb: "With the carrier." },
  { id: "to-review", label: "Delivered", blurb: "Arrived. Tell us how it wears." },
];

/**
 * Every status this codebase has ever written, mapped to its canonical form.
 * Keep aliases here rather than special-casing them at call sites.
 */

const ALIASES = {
  "to-pay": "to-pay",
  pending: "to-pay",
  unpaid: "to-pay",

  "to-ship": "to-ship",
  paid: "to-ship",
  processing: "to-ship",

  shipped: "shipped",
  "in-transit": "shipped",

  "to-review": "to-review",
  delivered: "to-review",

  reviewed: "reviewed",
  cancelled: "cancelled",
  canceled: "cancelled",
  refunded: "refunded",
};

/** Labels and chip tones for every canonical status. */
export const ORDER_STATUS = {
  "to-pay": { label: "To pay", tone: "pending" },
  "to-ship": { label: "To ship", tone: "progress" },
  shipped: { label: "Shipped", tone: "progress" },
  "to-review": { label: "Delivered", tone: "positive" },
  reviewed: { label: "Reviewed", tone: "positive" },
  cancelled: { label: "Cancelled", tone: "negative" },
  refunded: { label: "Refunded", tone: "neutral" },
};

/** Resolves any dialect to a canonical status, or null if unrecognised. */
export function normalizeStatus(status) {
  if (!status) return null;
  return ALIASES[String(status).toLowerCase()] ?? null;
}

/**
 * Position on the four-stage timeline, or null for an order that has left it.
 *
 * Returning null rather than 0 for cancelled and refunded is the point: those
 * orders need their own message, not a timeline with the first dot lit.
 */

export function stageOf(status) {

  const canonical = normalizeStatus(status);
  if (!canonical) return null;
  if (canonical === "reviewed") return ORDER_STAGES.length - 1;

  const index = ORDER_STAGES.findIndex((s) => s.id === canonical);
  return index === -1 ? null : index;
}

/** True for an order that ended without being delivered. */
export function isOffTimeline(status) {

  const canonical = normalizeStatus(status);
  return canonical === "cancelled" || canonical === "refunded";
}

/** Label for any status, falling back to the raw key made readable. */
export function statusLabel(status) {

  const canonical = normalizeStatus(status);
  return ORDER_STATUS[canonical]?.label ?? String(status ?? "").replace(/[-_]/g, " ");
}

/**
 * The status an admin can move an order to next.
 *
 * Forward only, because these transitions have real consequences — marking
 * shipped notifies the customer, refunding moves money. Reversing them is a
 * correction, not a normal step, and should not be one click away.
 */

export function nextStatuses(status) {
  switch (normalizeStatus(status)) {
    case "to-pay":
      return ["to-ship", "cancelled"];
    case "to-ship":
      return ["shipped", "cancelled"];
    case "shipped":
      return ["to-review", "refunded"];
    case "to-review":
      return ["refunded"];
    default:
      return [];
  }
}

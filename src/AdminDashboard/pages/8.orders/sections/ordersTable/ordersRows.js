/* Orders List: Row Shaping */
import { normalizeStatus } from "@/utils/orderStatus";

const DAY = 24 * 60 * 60 * 1000;

/** Payment, as the money says: charges and refunds against the order. */
export function paymentOf(order, txns = []) {
  const status = normalizeStatus(order.status);
  const charges = txns.filter((t) => t.orderId === order.id && t.type === "charge" && t.status === "succeeded");
  const paid = charges.reduce((s, t) => s + t.amount, 0);
  const refunded = txns.filter((t) => t.orderId === order.id && t.type === "refund" && t.status === "succeeded").reduce((s, t) => s + t.amount, 0);
  if (status === "to-pay") {
    const last = txns.filter((t) => t.orderId === order.id && t.type === "charge").at(-1);
    return last?.status === "failed" ? "failed" : "pending";
  }
  if (!paid && status === "cancelled") return "not-charged";
  if (refunded > 0 && refunded >= paid - 0.005) return "refunded";
  if (refunded > 0) return "part-refunded";
  if (status === "refunded") return "refunded";
  return "paid";
}

/** Where the parcel is. */
export function fulfilmentOf(order) {
  return {
    "to-pay": "unfulfilled",
    "to-ship": "unfulfilled",
    shipped: "shipped",
    "to-review": "delivered",
    reviewed: "delivered",
    cancelled: "cancelled",
    refunded: "closed",
  }[normalizeStatus(order.status)] ?? "unfulfilled";
}

export const PAYMENT = {
  pending: { label: "Payment pending", tone: "pending" },
  failed: { label: "Payment failed", tone: "negative" },
  paid: { label: "Paid", tone: "positive" },
  "part-refunded": { label: "Part refunded", tone: "progress" },
  refunded: { label: "Refunded", tone: "neutral" },
  "not-charged": { label: "Not charged", tone: null },
};

export const FULFILMENT = {
  unfulfilled: { label: "Unfulfilled", tone: "pending" },
  shipped: { label: "Shipped", tone: "progress" },
  delivered: { label: "Delivered", tone: "positive" },
  cancelled: { label: "Cancelled", tone: "negative" },
  closed: { label: "Closed", tone: "neutral" },
};

export function daysSince(iso, now = Date.now()) {
  return Math.max(0, Math.floor((now - new Date(iso).getTime()) / DAY));
}

/** The one thing to do next on an order, if any. */
export function nextStepOf(row) {
  if (row.status === "to-ship") return "ship";
  if (row.status === "shipped") return "deliver";
  return null;
}

/** Orders as the list shows them: payment, fulfilment, who the customer is, and how long it has waited. */
export function toRows(orders = [], txns = []) {
  const countBy = new Map();
  const who = (o) => o.userId ?? String(o.email ?? "").toLowerCase();
  for (const o of orders) countBy.set(who(o), (countBy.get(who(o)) ?? 0) + 1);

  return orders.map((o) => {
    const status = normalizeStatus(o.status) ?? o.status;
    const orderCount = countBy.get(who(o)) ?? 1;
    const row = {
      ...o,
      status,
      customer: o.name ?? o.email ?? "Guest",
      customerType: o.userId ? "account" : "guest",
      customerNote: orderCount > 1 ? `${orderCount} orders` : o.userId ? "Account" : "Guest checkout",
      itemCount: (o.items ?? []).reduce((n, i) => n + (i.quantity ?? 1), 0),
      payment: paymentOf({ ...o, status }, txns),
      fulfilment: fulfilmentOf({ ...o, status }),
      age: daysSince(o.createdAt),
    };
    return { ...row, next: nextStepOf(row) };
  });
}

export const TABS = [
  ["all", "All", () => true],
  ["to-pay", "Payment pending", (r) => r.status === "to-pay"],
  ["to-ship", "To ship", (r) => r.status === "to-ship"],
  ["shipped", "Shipped", (r) => r.status === "shipped"],
  ["delivered", "Delivered", (r) => r.fulfilment === "delivered"],
  ["closed", "Cancelled & refunded", (r) => r.status === "cancelled" || r.status === "refunded"],
];

export const PERIODS = [
  { value: "all", label: "All time", days: null },
  { value: "30", label: "Last 30 days", days: 30 },
  { value: "180", label: "Last 6 months", days: 180 },
  { value: "year", label: "This year", days: "year" },
];

export function inPeriod(row, period) {
  const p = PERIODS.find((x) => x.value === period);
  if (!p?.days) return true;
  if (p.days === "year") return new Date(row.createdAt).getFullYear() === new Date().getFullYear();
  return row.age <= p.days;
}

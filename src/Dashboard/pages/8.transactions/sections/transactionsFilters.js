/* Transactions Filters And Summary */

export const VIEWS = [
  { value: "all", label: "All" },
  { value: "payments", label: "Payments" },
  { value: "refunds", label: "Refunds" },
  { value: "failed", label: "Failed" },
  { value: "pending", label: "Pending" },
];

export function matchesView(t, view) {
  if (view === "payments") return t.type === "charge" && t.status === "succeeded";
  if (view === "refunds") return t.type === "refund";
  if (view === "failed") return t.status === "failed";
  if (view === "pending") return t.status === "pending";
  return true;
}

export const PROVIDERS = [
  { value: "all", label: "All providers" },
  { value: "stripe", label: "Stripe" },
  { value: "paypal", label: "PayPal" },
];

const DAY = 24 * 60 * 60 * 1000;

export const PERIODS = {
  all: { label: "All time", since: () => null },
  "30d": { label: "Last 30 days", since: () => new Date(Date.now() - 30 * DAY) },
  "90d": { label: "Last 90 days", since: () => new Date(Date.now() - 90 * DAY) },
  year: { label: "This year", since: () => new Date(new Date().getFullYear(), 0, 1) },
};

/**
 * Collected, refunded, fees and net for a set of transactions.
 *
 * Only succeeded rows count as money that moved. Provider fees stay in the
 * total after a refund, because Stripe and PayPal keep the fee on a refunded
 * payment. `currency` is null when the set mixes currencies, since adding
 * euros to pounds would produce a number that means nothing.
 */
export function summarize(transactions) {
  const done = transactions.filter((t) => t.status === "succeeded");
  const charges = done.filter((t) => t.type === "charge");
  const refunds = done.filter((t) => t.type === "refund");
  const sum = (list, key) => round(list.reduce((total, t) => total + (t[key] ?? 0), 0));

  const collected = sum(charges, "amount");
  const refunded = sum(refunds, "amount");
  const fees = sum(charges, "fee");
  const currencies = new Set(transactions.map((t) => t.currency));

  return {
    collected,
    refunded,
    fees,
    net: round(collected - refunded - fees),
    paymentCount: charges.length,
    refundCount: refunds.length,
    failedCount: transactions.filter((t) => t.status === "failed").length,
    currency: currencies.size <= 1 ? ([...currencies][0] ?? "EUR") : null,
  };
}

function round(n) {
  return Math.round(n * 100) / 100;
}

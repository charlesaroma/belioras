import { mockApi } from "@/api/mock";
import { getState } from "./contentStore";

/**
 * Transactions: every movement of money against an order.
 *
 * One order can carry several — a declined card and then a successful payment,
 * or a payment and a later refund — which is why this is its own collection
 * rather than a transactionId field on the order.
 *
 * Read-only on purpose. A refund has to be issued through Stripe or PayPal, so
 * there is no write here until a provider is connected.
 *
 * Nothing in this mock checks the caller. The dashboard hides the page from
 * staff, but the real endpoint must require the `payments` capability on the
 * server, or the hiding is cosmetic.
 */

function transactionItems() {
  return getState("transactions").items;
}

function ordersById() {
  return new Map(getState("orders").items.map((o) => [o.id, o]));
}

export function getTransactions() {
  return mockApi(() => {
    const all = transactionItems();
    const orders = ordersById();
    return all.map((t) => shape(t, all, orders)).sort(newestFirst);
  });
}

export function getTransactionsForOrder(orderId) {
  return mockApi(() => {
    const all = transactionItems();
    const orders = ordersById();
    return all
      .filter((t) => t.orderId === orderId)
      .map((t) => shape(t, all, orders))
      .sort(newestFirst);
  }, 150);
}

// The customer is joined from the order at read time rather than copied onto
// every transaction, and a charge's status reflects the refunds made against it.
function shape(t, all, orders) {
  const order = orders.get(t.orderId);

  const refunded =
    t.type === "charge"
      ? all
          .filter((r) => r.parentId === t.id && r.status === "succeeded")
          .reduce((sum, r) => sum + r.amount, 0)
      : 0;

  const signedAmount = t.type === "refund" ? -t.amount : t.amount;

  return {
    ...t,
    customer: order?.name ?? order?.email ?? "Guest",
    email: order?.email ?? null,
    refunded: round(refunded),
    signedAmount,
    net: t.status === "succeeded" ? round(signedAmount - (t.fee ?? 0)) : 0,
    displayStatus: displayStatus(t, refunded),
  };
}

function displayStatus(t, refunded) {
  if (t.type !== "charge" || t.status !== "succeeded" || refunded <= 0) return t.status;
  return refunded >= t.amount ? "refunded" : "partially-refunded";
}

function newestFirst(a, b) {
  return new Date(b.createdAt) - new Date(a.createdAt);
}

function round(n) {
  return Math.round(n * 100) / 100;
}

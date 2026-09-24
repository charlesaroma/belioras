/* Payments (simulated provider) */
import { getState, setState } from "../store/contentStore";

/**
 * A stand-in for Stripe or PayPal, and the only thing here the backend
 * replaces wholesale.
 *
 * Real flow: checkout asks the server for a payment session; the customer pays
 * on the provider's page; the provider calls the server's webhook; the server
 * records the transaction and confirms the order. The browser never marks
 * anything paid. Here, `charge` and `refund` succeed at once and write the same
 * transaction records the webhook would, so everything downstream — the order,
 * the invoice, Transactions, Reports — behaves as it will for real.
 */
/** True while payments are simulated here. The storefront says so; switch off once a provider is connected. */
export const PAYMENTS_SIMULATED = true;

export const PAYMENT_METHODS = [
  { id: "card", label: "Card", provider: "stripe", detail: "Visa, Mastercard, American Express" },
  { id: "paypal", label: "PayPal", provider: "paypal", detail: "Pay with your PayPal account" },
];

const round = (n) => Math.round(n * 100) / 100;

/** What the provider keeps, roughly, so Transactions shows realistic net figures. */
function feeFor(provider, amount) {
  return provider === "paypal" ? round(amount * 0.0249 + 0.35) : round(amount * 0.015 + 0.25);
}

function nextTxnId() {
  const highest = getState("transactions").items.reduce((max, t) => Math.max(max, Number(String(t.id).replace(/\D/g, "")) || 0), 0);
  return `txn_${String(highest + 1).padStart(4, "0")}`;
}

function record(txn) {
  setState("transactions", (state) => ({ ...state, items: [...state.items, txn] }));
  return txn;
}

/** Takes payment for an order. Returns the charge, as the provider's webhook would report it. */
export function charge(order, methodId = "card") {
  const method = PAYMENT_METHODS.find((m) => m.id === methodId) ?? PAYMENT_METHODS[0];
  return record({
    id: nextTxnId(),
    orderId: order.id,
    provider: method.provider,
    providerRef: `${method.provider === "paypal" ? "PAYID" : "pi"}_sim_${Date.now().toString(36)}`,
    type: "charge",
    status: "succeeded",
    amount: order.total,
    currency: "EUR",
    fee: feeFor(method.provider, order.total),
    method: method.id === "card" ? { type: "card", brand: "visa", last4: "4242" } : { type: "paypal" },
    failureReason: null,
    parentId: null,
    simulated: true,
    createdAt: new Date().toISOString(),
  });
}

/** Money already taken for an order, and already given back. */
export function paymentsFor(orderId) {
  const txns = getState("transactions").items.filter((t) => t.orderId === orderId && t.status === "succeeded");
  const charges = txns.filter((t) => t.type === "charge");
  const charged = round(charges.reduce((s, t) => s + t.amount, 0));
  const refunded = round(txns.filter((t) => t.type === "refund").reduce((s, t) => s + t.amount, 0));
  return { charges, charged, refunded, refundable: round(Math.max(0, charged - refunded)) };
}

/** Gives money back against an order's charge, through the same provider. */
export function refund(orderId, amount, reason) {
  const { charges } = paymentsFor(orderId);
  const parent = charges[charges.length - 1];
  if (!parent) return null;
  return record({
    id: nextTxnId(),
    orderId,
    provider: parent.provider,
    providerRef: `re_sim_${Date.now().toString(36)}`,
    type: "refund",
    status: "succeeded",
    amount: round(amount),
    currency: "EUR",
    fee: 0,
    method: parent.method,
    failureReason: null,
    parentId: parent.id,
    reason,
    simulated: true,
    createdAt: new Date().toISOString(),
  });
}

import { ApiError, mockApi } from "@/api/mock";
import { getState, setState } from "../store/contentStore";
import { normalizeStatus } from "../../utils/orderStatus";
import { assertCouponRedeemable } from "./couponsApi";
import { availabilityProblems, stockChangesForStatus } from "../catalog/inventory/orderStock";
import { applyStockChanges } from "../catalog/inventory/stockLedger";
import { audited } from "../auth/audited";

export { returnableUnits } from "../catalog/inventory/orderStock";
export { getBestSellerProductIds } from "./orderRankings";

/**
 * Orders, read and written through the content store.
 *
 * Previously a module-level `let orders = [...seed]`, so an order placed at
 * checkout or a status changed in the dashboard survived exactly until the
 * next reload. Same reasoning as the catalogue: a getter, not a captured
 * value, because setState replaces the domain object.
 */

function orderItems() {
  return getState("orders").items;
}

function nextOrderNumber(items) {

  const highest = items.reduce((max, o) => {

    const n = Number(String(o.id).replace(/\D/g, "")) || 0;
    return n > max ? n : max;
  }, 1000);
  return highest + 1;
}

export function getOrders(userId) {
  return mockApi(() => {
    // An absent userId must return nothing rather than everything — this is
    // the guard between "signed out" and "here is the whole store's history".
    if (!userId) return [];
    return orderItems()
      .filter((o) => o.userId === userId)
      .map((o) => ({ ...o }));
  });
}

/** Every order, regardless of customer. Used for store-wide aggregates. */
export function getAllOrders() {
  return mockApi(() => orderItems().map((o) => ({ ...o })));
}

/**
 * Fetch one order, with an ownership check.
 *
 * This previously took only an id and applied no check at all, while
 * /order-tracking is public — so anyone could walk ORD-1001, ORD-1002 … and
 * read a stranger's items, totals and delivery address. The reference alone is
 * guessable and is therefore not a credential.
 *
 * `as` is what the caller can prove: `{ userId }` for a signed-in customer,
 * `{ email }` for the public tracker, `{ staff: true }` for the dashboard.
 * The mismatch and the missing-order cases deliberately return the same error,
 * so the response cannot be used to confirm that a reference exists.
 */

export function getOrder(id, as = {}) {
  return mockApi(() => {

    const notFound = new ApiError("No order matches those details.", 404);

    const order = orderItems().find((o) => o.id === id);
    if (!order) throw notFound;

    if (as.staff) return { ...order };
    if (as.userId && order.userId === as.userId) return { ...order };
    if (as.email && order.email?.toLowerCase() === String(as.email).toLowerCase()) {
      return { ...order };
    }

    throw notFound;
  });
}

export function createOrder(payload) {
  return mockApi(() => {

    // Refused rather than oversold: another shopper may have taken the last
    // one since this bag was filled.
    const problems = availabilityProblems(payload.items ?? []);
    if (problems.length) throw new ApiError(problems.join(" "), 409);

    // The last use of a code may have gone since it was applied.
    if (payload.couponCode) {
      assertCouponRedeemable(payload.couponCode, payload.subtotal ?? 0, { userId: payload.userId, email: payload.email });
    }

    const now = new Date().toISOString();

    const items = orderItems();

    const order = {
      id: `ORD-${nextOrderNumber(items)}`,
      userId: payload.userId ?? null,
      email: payload.email ?? null,
      name: payload.name ?? null,
      items: payload.items ?? [],
      subtotal: payload.subtotal ?? 0,
      discount: payload.discount ?? 0,
      shipping: payload.shipping ?? 0,
      tax: payload.tax ?? 0,
      total: payload.total ?? 0,
      couponCode: payload.couponCode ?? null,
      shippingAddress: payload.shippingAddress ?? null,
      status: "to-pay",
      createdAt: now,
      updatedAt: now,
    };

    setState("orders", (state) => ({ ...state, items: [order, ...state.items] }));
    return { ...order };
  }, 400);
}

/** Statuses that mean the order has been paid for. */
const PAID = new Set(["to-ship", "shipped", "to-review", "reviewed", "refunded"]);

/** The next number in this year's sequence: BEL-2026-0012. Never reused, never skipped. */
function nextInvoiceNumber() {
  const prefix = getState("settings").invoice?.prefix || "INV";
  const year = new Date().getFullYear();
  const stem = `${prefix}-${year}-`;
  const highest = orderItems().reduce((max, o) => {
    const n = String(o.invoiceNumber ?? "").startsWith(stem) ? Number(o.invoiceNumber.slice(stem.length)) : 0;
    return Math.max(max, n || 0);
  }, 0);
  return `${stem}${String(highest + 1).padStart(4, "0")}`;
}

/**
 * Everything an invoice prints: the seller from Settings, the buyer, each line
 * with its net price and VAT, and the totals. VAT is included in Belioras's
 * prices, so it is worked out of them, at the rate in Settings. Readable by
 * staff, or by the customer the order belongs to.
 */
export function getInvoice(id, as = {}) {
  return mockApi(async () => {
    const order = await getOrder(id, as);
    if (!order.invoiceNumber) throw new ApiError("This order has no invoice yet: one is issued when payment is confirmed.", 409);
    const settings = getState("settings");
    const rate = settings.tax?.rate ?? 0;
    const net = (gross) => Math.round((gross / (1 + rate)) * 100) / 100;
    const lines = (order.items ?? []).map((i) => {
      const gross = (i.price ?? 0) * (i.quantity ?? 1);
      return { ...i, gross, net: net(gross) };
    });
    if (order.discount) lines.push({ name: `Discount${order.couponCode ? ` (${order.couponCode})` : ""}`, quantity: 1, price: -order.discount, gross: -order.discount, net: -net(order.discount) });
    if (order.shipping) lines.push({ name: "Shipping", quantity: 1, price: order.shipping, gross: order.shipping, net: net(order.shipping) });
    const total = order.total ?? 0;
    return {
      order,
      seller: {
        name: settings.gpsr?.manufacturer ?? "Belioras",
        address: settings.gpsr?.address ?? settings.contact?.boutique ?? "",
        email: settings.contact?.support ?? "",
        vatId: settings.invoice?.vatId ?? "",
        taxNumber: settings.invoice?.taxNumber ?? "",
        note: settings.invoice?.note ?? "",
      },
      rate,
      lines,
      totals: { net: Math.round((total - (order.tax ?? 0)) * 100) / 100, vat: order.tax ?? 0, gross: total },
    };
  }, 0);
}

/**
 * Sends the receipt again. Email is not connected yet, so it is recorded as
 * queued — the backend's mailer picks queued receipts up once it exists.
 */
function sendReceipt$raw(id) {
  return mockApi(() => {
    const order = orderItems().find((o) => o.id === id);
    if (!order) throw new ApiError("Order not found.", 404);
    if (!order.invoiceNumber) throw new ApiError("There is no receipt to send until payment is confirmed.", 409);
    const updated = { ...order, receipts: [...(order.receipts ?? []), { at: new Date().toISOString(), to: order.email, status: "queued" }] };
    setState("orders", (state) => ({ ...state, items: state.items.map((o) => (o.id === id ? updated : o)) }));
    return updated;
  });
}

/**
 * Move an order to a new status. Admin action.
 *
 * Validates against the canonical vocabulary so a typo cannot write a status
 * nothing knows how to render — which is how `paid` ended up showing a blank
 * chip on two different surfaces.
 */

function updateOrderStatus$raw(id, status, { restock = false, by = null, trackingRef, carrier } = {}) {
  return mockApi(() => {

    const canonical = normalizeStatus(status);
    if (!canonical) throw new ApiError(`Unknown order status: ${status}`, 422);

    const order = orderItems().find((o) => o.id === id);
    if (!order) throw new ApiError("Order not found.", 404);

    // Shipping takes the pieces off the shelf; cancelling or refunding a
    // shipped order puts them back when `restock` says they came back.
    const { changes, patch } = stockChangesForStatus(order, canonical, { restock, by });
    applyStockChanges(changes);

    // Payment confirmed: the order gets its invoice number — once, and in
    // sequence, as German invoicing requires — and a receipt to its customer.
    const nowPaid = normalizeStatus(order.status) === "to-pay" && PAID.has(canonical) && !order.invoiceNumber;
    const now = new Date().toISOString();

    const updated = {
      ...order,
      ...patch,
      ...(nowPaid
        ? { invoiceNumber: nextInvoiceNumber(), paidAt: now, receipts: [...(order.receipts ?? []), { at: now, to: order.email, status: "queued", auto: true }] }
        : {}),
      status: canonical,
      updatedAt: new Date().toISOString(),
      ...(trackingRef ? { trackingRef } : {}),
      ...(carrier ? { carrier } : {}),
    };
    setState("orders", (state) => ({
      ...state,
      items: state.items.map((o) => (o.id === id ? updated : o)),
    }));
    return updated;
  });
}

/* Recorded in the staff activity log. */
export const updateOrderStatus = audited("orders", ([id, status]) => `Marked order ${id} ${status}`, updateOrderStatus$raw);
export const sendReceipt = audited("orders", ([id]) => `Resent the receipt for order ${id}`, sendReceipt$raw);

import { ApiError, mockApi } from "@/api/mock";
import { getState, setState } from "../store/contentStore";
import { normalizeStatus } from "../../utils/orderStatus";
import { assertCouponRedeemable } from "./couponsApi";
import { availabilityProblems, stockChangesForStatus } from "../catalog/inventory/orderStock";
import { applyStockChanges } from "../catalog/inventory/stockLedger";

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

/**
 * Move an order to a new status. Admin action.
 *
 * Validates against the canonical vocabulary so a typo cannot write a status
 * nothing knows how to render — which is how `paid` ended up showing a blank
 * chip on two different surfaces.
 */

export function updateOrderStatus(id, status, { restock = false, by = null, trackingRef, carrier } = {}) {
  return mockApi(() => {

    const canonical = normalizeStatus(status);
    if (!canonical) throw new ApiError(`Unknown order status: ${status}`, 422);

    const order = orderItems().find((o) => o.id === id);
    if (!order) throw new ApiError("Order not found.", 404);

    // Shipping takes the pieces off the shelf; cancelling or refunding a
    // shipped order puts them back when `restock` says they came back.
    const { changes, patch } = stockChangesForStatus(order, canonical, { restock, by });
    applyStockChanges(changes);

    const updated = {
      ...order,
      ...patch,
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

import ordersSeed from "../data/orders.json";

import { ApiError, mockApi } from "./apiClient";

let orders = [...ordersSeed];
let nextNumber = Math.max(...ordersSeed.map((o) => Number(o.id.replace("ORD-", "")))) + 1;

export function getOrders(userId) {
  return mockApi(() => orders.filter((o) => o.userId === userId).map((o) => ({ ...o })));
}

/** Every order, regardless of customer. Used for store-wide aggregates. */
export function getAllOrders() {
  return mockApi(() => orders.map((o) => ({ ...o })));
}

/**
 * Product ids ranked by units sold — the client's requirement that Best Sellers
 * "populate automatically based on client order data" rather than a manual flag.
 *
 * Cancelled orders are excluded; a real backend would compute this as a rollup
 * updated on order.paid rather than scanning on read.
 */
export function getBestSellerProductIds({ limit = 12, sinceDays = null } = {}) {
  return mockApi(() => {
    const cutoff = sinceDays ? Date.now() - sinceDays * 86400000 : null;
    const unitsByProduct = new Map();

    for (const order of orders) {
      if (order.status === "cancelled") continue;
      if (cutoff && new Date(order.createdAt).getTime() < cutoff) continue;

      for (const item of order.items ?? []) {
        if (!item.productId) continue;
        unitsByProduct.set(
          item.productId,
          (unitsByProduct.get(item.productId) ?? 0) + (item.quantity ?? 1),
        );
      }
    }

    return [...unitsByProduct.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([productId, units]) => ({ productId, units }));
  }, 0);
}

export function getOrder(id) {
  return mockApi(() => {
    const order = orders.find((o) => o.id === id);
    if (!order) throw new ApiError("Order not found.", 404);
    return { ...order };
  });
}

export function createOrder(payload) {
  return mockApi(() => {
    const now = new Date().toISOString();
    const order = {
      id: `ORD-${nextNumber++}`,
      userId: payload.userId ?? null,
      items: payload.items ?? [],
      subtotal: payload.subtotal ?? 0,
      shipping: payload.shipping ?? 0,
      tax: payload.tax ?? 0,
      total: payload.total ?? 0,
      couponCode: payload.couponCode ?? null,
      status: "pending",
      createdAt: now,
      updatedAt: now,
    };
    orders.unshift(order);
    return { ...order };
  }, 400);
}
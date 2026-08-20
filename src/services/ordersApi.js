import ordersSeed from "../data/orders.json";

import { ApiError, mockApi } from "./apiClient";

let orders = [...ordersSeed];
let nextNumber = Math.max(...ordersSeed.map((o) => Number(o.id.replace("ORD-", "")))) + 1;

export function getOrders(userId) {
  return mockApi(() => orders.filter((o) => o.userId === userId).map((o) => ({ ...o })));
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
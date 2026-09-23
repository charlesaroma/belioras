import { ApiError, mockApi } from "@/api/mock";
import { getState, setState } from "../store/contentStore";

const TYPES = new Set(["percent", "fixed", "free_shipping"]);

function couponItems() {
  return getState("coupons").items;
}

function write(items) {
  setState("coupons", (state) => ({ ...state, items }));
}

function nextId() {
  const n = couponItems().reduce((max, c) => {
    const num = Number(String(c.id).replace(/^c/, ""));
    return Number.isFinite(num) ? Math.max(max, num) : max;
  }, 0);
  return `c${n + 1}`;
}

/** Throws if the payload isn't a coupon a shopper could actually redeem. */
function validate(payload, { ignoreId } = {}) {
  const code = String(payload.code ?? "").trim().toUpperCase();
  if (!code) throw new ApiError("Give the coupon a code.", 422);
  if (
    couponItems().some((c) => c.id !== ignoreId && c.code.toUpperCase() === code)
  ) {
    throw new ApiError(`${code} is already in use.`, 409);
  }

  const type = payload.type;
  if (!TYPES.has(type)) throw new ApiError("Choose what the coupon gives.", 422);

  const value = Number(payload.value ?? 0);
  if (type === "percent" && (!(value > 0) || value > 100)) {
    throw new ApiError("A percentage discount must be between 1 and 100.", 422);
  }
  if (type === "fixed" && !(value > 0)) {
    throw new ApiError("A fixed discount must be a positive amount.", 422);
  }

  return { code, type, value: type === "free_shipping" ? 0 : value };
}

export function getCoupons() {
  return mockApi(() => couponItems().map((c) => ({ ...c })));
}

/** How many orders redeemed each coupon, and how much discount each has given — keyed by code. */
export function couponUsage() {
  return mockApi(() => {
    const counts = {};
    const discount = {};
    for (const order of getState("orders").items) {
      if (!order.couponCode) continue;
      const code = order.couponCode.toUpperCase();
      counts[code] = (counts[code] ?? 0) + 1;
      discount[code] = (discount[code] ?? 0) + (Number(order.discount) || 0);
    }
    return { counts, discount };
  }, 0);
}

export function validateCoupon(code, subtotal = 0) {
  return mockApi(() => {
    const coupon = couponItems().find(
      (c) => c.code.toLowerCase() === String(code ?? "").trim().toLowerCase()
    );
    if (!coupon || !coupon.active) throw new ApiError("This coupon code is not valid.", 404);
    if (coupon.expiresAt && new Date(coupon.expiresAt).getTime() < Date.now()) {
      throw new ApiError("This coupon has expired.", 410);
    }
    if (subtotal < (coupon.minOrderValue ?? 0)) {
      throw new ApiError(`This coupon requires a minimum order of €${coupon.minOrderValue}.`, 400);
    }
    return { ...coupon };
  });
}

export function createCoupon(payload) {
  return mockApi(() => {
    const { code, type, value } = validate(payload);
    const coupon = {
      id: nextId(),
      code,
      type,
      value,
      minOrderValue: Number(payload.minOrderValue ?? 0) || 0,
      maxDiscount: payload.maxDiscount ? Number(payload.maxDiscount) : null,
      expiresAt: payload.expiresAt || null,
      active: payload.active ?? true,
      description: String(payload.description ?? "").trim(),
    };
    write([...couponItems(), coupon]);
    return coupon;
  });
}

export function updateCoupon(id, payload) {
  return mockApi(() => {
    const current = couponItems();
    const existing = current.find((c) => c.id === id);
    if (!existing) throw new ApiError("That coupon no longer exists.", 404);

    const { code, type, value } = validate(payload, { ignoreId: id });
    const updated = {
      ...existing,
      code,
      type,
      value,
      minOrderValue: Number(payload.minOrderValue ?? 0) || 0,
      maxDiscount: payload.maxDiscount ? Number(payload.maxDiscount) : null,
      expiresAt: payload.expiresAt || null,
      active: payload.active ?? existing.active,
      description: String(payload.description ?? "").trim(),
    };
    write(current.map((c) => (c.id === id ? updated : c)));
    return updated;
  });
}

/** An order's couponCode is a historical string, not a live reference — deleting a coupon never touches past orders. */
export function deleteCoupon(id) {
  return mockApi(() => {
    const current = couponItems();
    const coupon = current.find((c) => c.id === id);
    if (!coupon) throw new ApiError("That coupon no longer exists.", 404);
    write(current.filter((c) => c.id !== id));
    return coupon;
  });
}

export function setCouponActive(id, active) {
  return mockApi(() => {
    const current = couponItems();
    const existing = current.find((c) => c.id === id);
    if (!existing) throw new ApiError("That coupon no longer exists.", 404);
    const updated = { ...existing, active };
    write(current.map((c) => (c.id === id ? updated : c)));
    return updated;
  });
}

import couponsSeed from "../data/coupons.json";

import { ApiError, mockApi } from "./apiClient";

export function getCoupons() {
  return mockApi(() => couponsSeed.map((c) => ({ ...c })));
}

export function validateCoupon(code, subtotal = 0) {
  return mockApi(() => {
    const coupon = couponsSeed.find(
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
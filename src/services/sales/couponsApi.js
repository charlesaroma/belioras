import { ApiError, mockApi } from "@/api/mock";
import { getState, setState } from "../store/contentStore";
import { normalizeStatus } from "../../utils/orderStatus";
import { audited } from "../auth/audited";

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

/**
 * An order counts against a coupon's limits unless it was cancelled or
 * refunded, which hands the use back — the same rule for the dashboard's
 * figures and for what checkout allows.
 */
const RELEASED = new Set(["cancelled", "refunded"]);

function redemptions(code) {
  const wanted = String(code ?? "").toUpperCase();
  return getState("orders").items.filter(
    (o) => o.couponCode && o.couponCode.toUpperCase() === wanted && !RELEASED.has(normalizeStatus(o.status)),
  );
}

/** Who placed an order: their account when they had one, else their email. */
function customerKey(order) {
  return order.userId ?? String(order.email ?? "").toLowerCase();
}

function sameCustomer(order, customer) {
  if (customer.userId && order.userId === customer.userId) return true;
  const email = String(customer.email ?? "").trim().toLowerCase();
  return Boolean(email) && String(order.email ?? "").toLowerCase() === email;
}

/**
 * What each code has done, keyed by code, and the totals across all of them:
 * orders that used it, distinct customers, the revenue those orders brought in
 * (their totals, after the discount) and the discount given away.
 */
export function couponStats() {
  return mockApi(() => {
    const byCode = {};
    const allCustomers = new Set();
    const totals = { redemptions: 0, revenue: 0, discount: 0 };

    for (const coupon of couponItems()) {
      const orders = redemptions(coupon.code);
      const customers = new Set(orders.map(customerKey));
      customers.forEach((c) => allCustomers.add(c));
      const revenue = orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
      const discount = orders.reduce((sum, o) => sum + (Number(o.discount) || 0), 0);
      byCode[coupon.code.toUpperCase()] = { orders: orders.length, customers: customers.size, revenue, discount };
      totals.redemptions += orders.length;
      totals.revenue += revenue;
      totals.discount += discount;
    }

    const allRevenue = getState("orders").items
      .filter((o) => !RELEASED.has(normalizeStatus(o.status)))
      .reduce((sum, o) => sum + (Number(o.total) || 0), 0);

    return { byCode, totals: { ...totals, customers: allCustomers.size, allRevenue } };
  }, 0);
}

/** A limit is blank (no limit) or a whole number of at least 1. */
function limit(value, label) {
  if (value === "" || value == null) return null;
  const n = Number(value);
  if (!Number.isInteger(n) || n < 1) throw new ApiError(`${label} must be a whole number, 1 or more — or blank for no limit.`, 422);
  return n;
}

function limitsOf(payload) {
  return {
    maxUses: limit(payload.maxUses, "Total uses"),
    maxUsesPerCustomer: limit(payload.maxUsesPerCustomer, "Uses per customer"),
  };
}

/**
 * Whether a shopper may use this code on this order — the one set of rules for
 * the checkout's "Apply" and for placing the order, which checks again because
 * the last use may have gone in between.
 */
export function assertCouponRedeemable(code, subtotal = 0, customer = null) {
  const coupon = couponItems().find((c) => c.code.toLowerCase() === String(code ?? "").trim().toLowerCase());
  if (!coupon || !coupon.active) throw new ApiError("This coupon code is not valid.", 404);
  if (coupon.expiresAt && new Date(coupon.expiresAt).getTime() < Date.now()) {
    throw new ApiError("This coupon has expired.", 410);
  }
  if (subtotal < (coupon.minOrderValue ?? 0)) {
    throw new ApiError(`This coupon requires a minimum order of €${coupon.minOrderValue}.`, 400);
  }
  const used = redemptions(coupon.code);
  if (coupon.maxUses && used.length >= coupon.maxUses) {
    throw new ApiError("This code has been fully redeemed.", 410);
  }
  if (coupon.maxUsesPerCustomer && customer) {
    const mine = used.filter((o) => sameCustomer(o, customer)).length;
    if (mine >= coupon.maxUsesPerCustomer) {
      throw new ApiError(
        coupon.maxUsesPerCustomer === 1
          ? "You have already used this code."
          : `This code can be used ${coupon.maxUsesPerCustomer} times per customer, and you have used it that often.`,
        409,
      );
    }
  }
  return coupon;
}

export function validateCoupon(code, subtotal = 0, customer = null) {
  return mockApi(() => ({ ...assertCouponRedeemable(code, subtotal, customer) }));
}

function createCoupon$raw(payload) {
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
      ...limitsOf(payload),
    };
    write([...couponItems(), coupon]);
    return coupon;
  });
}

function updateCoupon$raw(id, payload) {
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
      ...limitsOf(payload),
    };
    write(current.map((c) => (c.id === id ? updated : c)));
    return updated;
  });
}

/** An order's couponCode is a historical string, not a live reference — deleting a coupon never touches past orders. */
function deleteCoupon$raw(id) {
  return mockApi(() => {
    const current = couponItems();
    const coupon = current.find((c) => c.id === id);
    if (!coupon) throw new ApiError("That coupon no longer exists.", 404);
    write(current.filter((c) => c.id !== id));
    return coupon;
  });
}

function setCouponActive$raw(id, active) {
  return mockApi(() => {
    const current = couponItems();
    const existing = current.find((c) => c.id === id);
    if (!existing) throw new ApiError("That coupon no longer exists.", 404);
    const updated = { ...existing, active };
    write(current.map((c) => (c.id === id ? updated : c)));
    return updated;
  });
}

/* Recorded in the staff activity log. */
export const createCoupon = audited("discounts", (_, r) => `Created coupon ${r.code}`, createCoupon$raw);
export const updateCoupon = audited("discounts", (_, r) => `Updated coupon ${r.code}`, updateCoupon$raw);
export const deleteCoupon = audited("discounts", (_, r) => `Deleted coupon ${r.code}`, deleteCoupon$raw);
export const setCouponActive = audited("discounts", ([, on], r) => `${r.code} ${on ? "made live" : "paused"}`, setCouponActive$raw);

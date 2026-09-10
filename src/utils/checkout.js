/**
 * Checkout arithmetic.
 *
 * Pure functions, no React, so the numbers can be reasoned about in one place
 * rather than inside a form component.
 *
 * **VAT is inclusive**, which is what EU consumer law requires of a price shown
 * to a shopper and what settings.tax.note already claims: "All prices include
 * 20% VAT." So the tax figure is *extracted* from the subtotal for the receipt,
 * not added on top of it.
 *
 * Worth flagging: the seeded orders in orders.json were built the other way —
 * subtotal + shipping + tax = total, with tax added at 20% of the two. Those
 * fixtures overstate what a customer would actually have paid. New orders are
 * calculated correctly; the old ones are left as they are rather than silently
 * rewriting history that Belioras may have reconciled against.
 */

/** EU member states, for the shipping zone. */
const EU = new Set([
  "austria", "belgium", "bulgaria", "croatia", "cyprus", "czechia", "czech republic",
  "denmark", "estonia", "finland", "france", "germany", "greece", "hungary", "ireland",
  "italy", "latvia", "lithuania", "luxembourg", "malta", "netherlands", "poland",
  "portugal", "romania", "slovakia", "slovenia", "spain", "sweden",
]);

const UK = new Set(["united kingdom", "uk", "great britain", "england", "scotland", "wales", "northern ireland"]);

/** Which shipping zone a delivery country falls into. */
export function zoneIdFor(country) {

  const name = String(country ?? "").trim().toLowerCase();
  if (EU.has(name)) return "eu";
  if (UK.has(name)) return "uk";
  return "world";
}

/**
 * Everything the summary and the order record need.
 *
 * `coupon` is the validated object from couponsApi, or null. Discount applies
 * to the goods only — never to shipping, which is a real cost — and is capped
 * by the coupon's own maxDiscount.
 */

export function computeTotals({ items = [], country, coupon = null, settings }) {

  const zones = settings?.shipping?.zones ?? [];

  const zoneId = zoneIdFor(country);

  const zone = zones.find((z) => z.id === zoneId) ?? zones[0] ?? { flat: 0 };

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  let discount = 0;
  if (coupon) {
    discount = coupon.type === "percent" ? (subtotal * coupon.value) / 100 : coupon.value;
    if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
    discount = Math.min(discount, subtotal);
  }

  const goods = subtotal - discount;

  // The threshold is checked against what the customer actually pays for the
  // goods, so a discount can legitimately drop an order below free shipping.
  const qualifiesFree = zone.freeThreshold != null && goods >= zone.freeThreshold;

  const shipping = qualifiesFree ? 0 : (zone.flat ?? 0);

  const total = goods + shipping;

  // Extracted, not added: the prices already contain it.
  const rate = settings?.tax?.rate ?? 0;

  const tax = rate > 0 ? total - total / (1 + rate) : 0;

  return {
    zone,
    subtotal: round(subtotal),
    discount: round(discount),
    shipping: round(shipping),
    tax: round(tax),
    total: round(total),
    qualifiesFree,
    /** How much more to spend to reach free shipping, or null. */
    freeShippingGap:
      zone.freeThreshold != null && !qualifiesFree ? round(zone.freeThreshold - goods) : null,
  };
}

/** Two decimals, avoiding the usual float drift on repeated addition. */
function round(n) {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

/**
 * Pieces that cannot be returned, for the pre-purchase notice.
 *
 * EU withdrawal rights allow a 14-day change of mind, but hygiene-sealed goods
 * — which is how hair is sold — are a lawful exception. The exception only
 * holds if the customer was told *before* buying, so this belongs on the
 * checkout page rather than only in the returns policy.
 */

export function nonReturnableItems(items = [], catalog = []) {
  return items.filter((i) => catalog.find((p) => p.id === i.id)?.isNonReturnable);
}

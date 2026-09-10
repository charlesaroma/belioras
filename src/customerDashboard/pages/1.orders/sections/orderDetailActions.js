/**
 * Put a past order back in the bag.
 *
 * Resolves each line against the live catalogue rather than trusting the
 * order: a piece may have been withdrawn or sold out since, and saying so is
 * more useful than silently adding four of six things.
 */

export function reorder({ order, catalog, addItem, toast }) {
  if (!catalog) return;

  const missing = [];
  let added = 0;

  for (const item of order.items ?? []) {

    const product = catalog.find((p) => p.id === item.productId);
    if (!product || product.stock <= 0) {
      missing.push(item.name);
      continue;
    }
    if (addItem(product, { size: item.size, color: item.color, quantity: item.quantity })) {
      added += 1;
    } else {
      missing.push(item.name);
    }
  }

  if (added === 0) {
    toast("None of these pieces are available at the moment.", "warning");
    return;
  }

  toast(
    missing.length
      ? `${added} added. Unavailable: ${missing.join(", ")}.`
      : `${added} ${added === 1 ? "piece" : "pieces"} added to your bag.`,
    missing.length ? "warning" : "success",
  );
}

/**
 * What the totals do not otherwise account for.
 *
 * The fixtures record a coupon code but no discount amount, so it is derived.
 */

/* discount On */
export function discountOn(order) {
  if (!order) return 0;
  return Math.max(
    0,
    (order.subtotal ?? 0) + (order.shipping ?? 0) + (order.tax ?? 0) - (order.total ?? 0),
  );
}

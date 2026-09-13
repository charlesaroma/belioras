/* Product Colour Variants */

/**
 * A colourway's photographs, or the product's own when it has none.
 *
 * Keyed by colour name rather than modelled as separate variant products: the
 * dashboard already edits `colors` as a list of names, so one photo set per
 * name is the smallest shape the product form can grow into. A product without
 * `colorImages` behaves exactly as before.
 */
export function imagesForColor(product, color) {
  const own = color ? product?.colorImages?.[color] : null;
  return own?.length ? own : (product?.images ?? []);
}

/** The colour named in the URL if this product offers it, else its first. */
export function colorFromParam(product, param) {
  const colors = product?.colors ?? [];
  const wanted = String(param ?? "").toLowerCase();
  return colors.find((c) => c.toLowerCase() === wanted) ?? colors[0] ?? null;
}

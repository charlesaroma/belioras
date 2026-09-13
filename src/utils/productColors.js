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

/**
 * How many of a piece are left in one colour, and one size when given.
 *
 * Products tracked per colour and size read their own cell. Older products
 * still hold a single number for the whole piece, which stands for every
 * colour and size until someone sets stock per variant in the dashboard.
 */
export function stockFor(product, color, size) {
  const byColor = product?.inventory?.[color];
  if (!byColor) return product?.stock ?? 0;
  if (size) return Number(byColor[size]) || 0;
  return Object.values(byColor).reduce((sum, n) => sum + (Number(n) || 0), 0);
}

/* Mega Menu Layout */
/**
 * How much room a category's menu deserves.
 *
 * Every root used to render the same full-bleed band with a three-column grid,
 * so New Arrivals (2 links) and Dresses (3) got the same acreage as Shop (44)
 * and most of it was empty. The panel now sizes to what it holds.
 */

/** Above this many links, the band is earned. Shop is the only one today. */
const FULL_WIDTH_LINKS = 20;

export function countLinks(category) {
  return (category?.sections ?? []).reduce((n, s) => n + (s.items?.length ?? 0), 0);
}

/** "full" — the edge-to-edge band with imagery. "compact" — a dropdown. */
export function megaMenuLayoutFor(category) {
  return countLinks(category) >= FULL_WIDTH_LINKS ? "full" : "compact";
}

/**
 * Columns for the link grid.
 *
 * A compact panel never exceeds two, however many sections it has: a third
 * column is what stretched Accessories' three short lists across the viewport.
 */

export function megaMenuColumns(category, layout) {

  const sections = category?.sections?.length ?? 1;
  if (layout === "full") return Math.min(sections, 3);
  return Math.min(sections, 2);
}

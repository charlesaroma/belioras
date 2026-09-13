/* Catalogue Sort */

/**
 * Orders a product list by the value in ?sort=.
 *
 * "newest" used to have no branch here and fell through to catalogue order, so
 * the default sort never sorted. Both date orders now read createdAt.
 */
export function sortProducts(products, sort) {
  const list = [...products];
  if (sort === "newest") list.sort(byCreated(-1));
  else if (sort === "oldest") list.sort(byCreated(1));
  else if (sort === "price-low") list.sort((a, b) => a.price - b.price);
  else if (sort === "price-high") list.sort((a, b) => b.price - a.price);
  else if (sort === "rating") list.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
  else if (sort === "sale") list.sort((a, b) => discount(b) - discount(a));
  return list;
}

// A product without a date has no honest place in a date order, so it goes to
// the end in both directions rather than being treated as the oldest.
function byCreated(direction) {
  return (a, b) => {
    const ta = created(a);
    const tb = created(b);
    if (ta === null || tb === null) return ta === tb ? 0 : ta === null ? 1 : -1;
    return direction * (ta - tb);
  };
}

function created(product) {
  const time = Date.parse(product.createdAt ?? "");
  return Number.isNaN(time) ? null : time;
}

function discount(product) {
  if (!product.originalPrice || product.originalPrice <= product.price) return 0;
  return 1 - product.price / product.originalPrice;
}

export function filterProducts(products, filters = {}) {
  const { collectionId, categories, priceRange, colors, sizes, onSale, rating } = filters;
  return products.filter((p) => {
    if (collectionId && p.collectionId !== collectionId) return false;
    if (categories?.length && !categories.every((c) => p.categories?.includes(c))) return false;
    if (priceRange && (p.price < priceRange.min || p.price > priceRange.max)) return false;
    if (colors?.length && !colors.some((c) => p.colors?.includes(c))) return false;
    if (sizes?.length && !sizes.some((s) => p.sizes?.includes(s))) return false;
    if (onSale && !p.originalPrice) return false;
    if (rating && (p.rating ?? 0) < rating) return false;
    return true;
  });
}

export function sortProducts(products, key = "featured") {
  const sorted = [...products];
  switch (key) {
    case "price-asc":
      return sorted.sort((a, b) => a.price - b.price);
    case "price-desc":
      return sorted.sort((a, b) => b.price - a.price);
    case "newest":
      return sorted.sort((a, b) => Number(b.isNew) - Number(a.isNew));
    case "rating":
      return sorted.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    default:
      return sorted.sort((a, b) => Number(b.bestseller) - Number(a.bestseller));
  }
}
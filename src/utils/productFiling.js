/**
 * Where a piece is filed, as words a shopper might type: its category, its
 * type and the Subcategory types it is tagged with ("Hair", "Wigs", "Cocktail
 * Dresses"). Search matches on these as well as the name, so it agrees with
 * the category tree the shop and dashboard use.
 */
export function filedUnderNames(product, categories = []) {
  const category = categories.find((c) => c.id === product.collectionId);
  if (!category) return [];
  const names = [category.name, category.types?.find((t) => t.id === product.type)?.name];
  for (const tag of product.tags ?? []) {
    const [prefix, subId, typeId] = String(tag).split(":");
    if (prefix !== "subcat") continue;
    const sub = category.subcategories?.find((s) => s.id === subId);
    names.push(sub?.types?.find((t) => t.id === typeId)?.name);
  }
  return names.filter(Boolean);
}

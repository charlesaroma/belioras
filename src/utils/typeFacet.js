/**
 * The "type" facet's values.
 *
 * Unlike computeFacets' other dimensions, `type` has no fixed taxonomy entry
 * — a category defines its own types (see categories.json) — so its values
 * are assembled from whatever categories are in play, rather than looked up
 * in the taxonomy. Merges every category's types; ids are already unique
 * across categories, so a plain concat is safe.
 */
export function typeDimension(categories = []) {
  const values = categories.flatMap((c) => (c.types ?? []).map((t) => ({ id: t.id, name: t.name })));
  return { label: "Category", values };
}

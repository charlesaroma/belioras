import { DIMENSION_PREFIX } from "../../../../../utils/faceting";

/**
 * Flattens the navigation tree into one row per menu leaf, with how many
 * pieces that leaf currently returns.
 *
 * A leaf reading 0 is a dead end in the menu, which is the single most useful
 * thing this page can tell an admin.
 */
export function toLeafRows(navigation, products) {
  const rows = [];
  const tagCount = (token) => (products ?? []).filter((p) => (p.tags ?? []).includes(token)).length;

  for (const root of navigation ?? []) {
    for (const section of root.sections ?? []) {
      for (const item of section.items ?? []) {
        const token = item.dimension === "group" ? null : item.slug?.split("/").pop();
        rows.push({
          id: item.id,
          label: item.label,
          root: root.label,
          section: section.title,
          url: item.url,
          products: token
            ? (products ?? []).filter((p) => (p.tags ?? []).some((t) => t.endsWith(`:${token}`)))
                .length
            : tagCount(`cat:${root.id}`),
        });
      }
    }
  }
  return rows;
}

/** Every attribute value in the taxonomy, with its product count. */
export function toAttributeRows(taxonomy, products) {
  const rows = [];
  for (const [dimension, config] of Object.entries(taxonomy ?? {})) {
    const prefix = DIMENSION_PREFIX[dimension] ?? dimension;
    for (const value of config.values ?? []) {
      const token = `${prefix}:${value.id}`;
      rows.push({
        id: token,
        name: value.name,
        dimension,
        token,
        hex: value.hex,
        products: (products ?? []).filter((p) => (p.tags ?? []).includes(token)).length,
      });
    }
  }
  return rows;
}

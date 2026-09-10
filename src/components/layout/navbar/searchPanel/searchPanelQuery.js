/* Facet Derivation */

export const DEFAULT_RESULTS = 6;
const MAX_RESULTS = 12;
const MAX_SUGGESTIONS = 4;

// Facets come from the catalogue actually loaded, not the taxonomy wholesale —
// offering a colour nothing in stock carries is a dead end.
export function stockedColours(catalog, taxonomy, colorMap) {
  const stocked = new Set(
    catalog.flatMap((p) => (p.colors ?? []).map((c) => colorMap[c]).filter(Boolean)),
  );
  return (taxonomy?.color?.values ?? []).filter((v) => stocked.has(v.id));
}

export function stockedSizes(catalog) {
  const stocked = new Set(catalog.flatMap((p) => p.sizes ?? []));
  // "default" is the placeholder carried by one-size pieces, not a size.
  return [...stocked].filter((s) => s && s !== "default");
}

export function searchResults(catalog, trimmed, colours, sizes, colorMap) {
  const base = trimmed
    ? catalog.filter((p) =>
        `${p.name} ${p.description ?? ""}`.toLowerCase().includes(trimmed.toLowerCase()),
      )
    : catalog.slice(0, DEFAULT_RESULTS);

  return base
    .filter((p) =>
      colours.length === 0 ? true : (p.colors ?? []).some((c) => colours.includes(colorMap[c])),
    )
    .filter((p) => (sizes.length === 0 ? true : (p.sizes ?? []).some((s) => sizes.includes(s))))
    .slice(0, MAX_RESULTS);
}

export function nameSuggestions(results, trimmed) {
  if (!trimmed) return [];
  return [...new Set(results.map((p) => p.name))].slice(0, MAX_SUGGESTIONS);
}

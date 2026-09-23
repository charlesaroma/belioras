/* Catalogue Setup Options */

/** Sizes a category can offer, in taxonomy order. "One size" is having none. */
export function sizeOptionsFrom(taxonomy) {
  return (taxonomy?.size?.values ?? [])
    .filter((v) => v.id !== "one-size")
    .map((v) => ({ id: v.id, name: v.name ?? v.id }));
}

export function sizeLabel(taxonomy, id) {
  return (taxonomy?.size?.values ?? []).find((v) => v.id === id)?.name ?? String(id).toUpperCase();
}

/** The shop's colour filters, which every managed colour belongs to one of. */
export function familyOptionsFrom(taxonomy) {
  return (taxonomy?.color?.values ?? []).map((v) => ({ id: v.id, name: v.name, hex: v.hex }));
}


/* Catalogue Setup Options */
import { DIMENSION_ORDER, DIMENSION_PREFIX } from "@/utils/faceting";

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

/** Extra details a category can ask for: occasion, fabric, style, length, hair. */
export function detailOptionsFrom(taxonomy) {
  return DIMENSION_ORDER.filter((d) => d !== "color" && d !== "size" && taxonomy?.[d]).map((d) => ({
    id: d,
    label: labelOf(taxonomy[d], d),
    prefix: DIMENSION_PREFIX[d] ?? d,
  }));
}

function labelOf(definition, id) {
  const label = definition?.label;
  if (typeof label === "string") return label;
  return label?.en ?? id.charAt(0).toUpperCase() + id.slice(1);
}

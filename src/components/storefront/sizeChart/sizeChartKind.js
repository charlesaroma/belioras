/**
 * Which chart a product needs.
 *
 * There is no `footwear` collection in the catalogue — the two shoe SKUs sit
 * under `accessories` — so the size ids are the only reliable signal, which is
 * why this sniffs them rather than reading a category.
 */

/* size Chart Kind For */
export function sizeChartKindFor(product) {

  const sizes = product?.sizes ?? [];
  if (sizes.some((s) => /^eu\d+$/i.test(s))) return "footwear";
  if (product?.collectionId === "hair" || product?.hairType) return "hair";
  if (sizes.some((s) => /^(xs|s|m|l|xl|xxl)$/i.test(s))) return "garment";
  return null;
}

/** The trigger's wording, which should describe what opens. */
export function sizeChartLabelFor(kind) {
  if (kind === "footwear") return "Size guide";
  if (kind === "hair") return "Length & texture guide";
  return "Size guide";
}

/** Tabs per kind, in the order they should read. */
export function sizeChartTabsFor(kind) {
  if (kind === "footwear") {
    return [
      { id: "foot", label: "Foot length" },
      { id: "measure", label: "How to measure" },
    ];
  }
  if (kind === "hair") {
    return [
      { id: "length", label: "Length" },
      { id: "texture", label: "Texture" },
      { id: "measure", label: "How it is measured" },
    ];
  }
  return [
    { id: "body", label: "Body size" },
    { id: "international", label: "International" },
    { id: "measure", label: "How to measure" },
  ];
}

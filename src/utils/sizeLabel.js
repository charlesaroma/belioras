/** What a shopper reads for a size id — "M", or "EU 36 · UK 3 · US 5". */
export function sizeLabel(taxonomy, id) {
  return (taxonomy?.size?.values ?? []).find((v) => v.id === id)?.name ?? String(id).toUpperCase();
}

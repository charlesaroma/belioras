/**
 * Row shaping for the catalogue list.
 *
 * Status is derived rather than stored so it can never disagree with the
 * stock count sitting next to it in the same row.
 */
export function toRows(products) {
  return (products ?? []).map((p) => ({
    ...p,
    status: p.stock === 0 ? "out_of_stock" : (p.status ?? "active"),
    category: p.collectionId ?? "—",
  }));
}

/** Counts for the status tabs, which need the whole set, not the filtered one. */
export function statusTabs(rows) {
  const by = (s) => rows.filter((p) => p.status === s).length;
  return [
    { value: "all", label: "All", count: rows.length },
    { value: "active", label: "Active", count: by("active") },
    { value: "draft", label: "Draft", count: by("draft") },
    { value: "out_of_stock", label: "Sold out", count: by("out_of_stock") },
  ];
}

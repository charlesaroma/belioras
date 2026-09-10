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

/**
 * Empty-state copy.
 *
 * Two different situations wear the same slot: a catalogue with nothing in it
 * yet, and a filter that happens to match nothing. Only the first should offer
 * "Add product" — the second wants the filter cleared, not a new piece.
 */
export function emptyState(filtering) {
  return filtering
    ? {
        title: "Nothing matches",
        description: "Try a different search, or clear the status filter.",
      }
    : {
        title: "No pieces yet",
        description: "Add the first piece and it will appear on the storefront straight away.",
        action: { label: "Add product", to: "/dashboard/products/new" },
      };
}

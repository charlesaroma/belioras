/* Inventory List Helpers */
import { sizeLabel } from "@/AdminDashboard/lib/catalogOptions";

export const ANY = "*";
export const FILTER_KEYS = ["category", "color", "size"];

/** How a variant's colour and size read: "Champagne · M", or "All colours and sizes". */
export function variantLabel(row, taxonomy) {
  if (row.colorId === ANY) return "All colours and sizes";
  const size = row.size === "one-size" ? "One size" : sizeLabel(taxonomy, row.size);
  return `${row.colorName} · ${size}`;
}

export function levelTabs(rows) {
  const by = (level) => rows.filter((r) => r.level === level).length;
  return [
    { value: "all", label: "All", count: rows.length },
    { value: "low", label: "Low stock", count: by("low") },
    { value: "out", label: "Sold out", count: by("out") },
    { value: "in", label: "In stock", count: by("in") },
  ];
}

export function filterGroups(rows, { categories = [], taxonomy }) {
  const count = (test) => rows.filter(test).length;
  const colours = new Map(rows.filter((r) => r.colorId !== ANY).map((r) => [r.colorId, r]));
  const sizes = [...new Set(rows.filter((r) => r.size !== ANY).map((r) => r.size))];
  const withCount = (options, test) =>
    options.map((o) => ({ ...o, count: count((r) => test(r, o.value)) })).filter((o) => o.count > 0);

  return [
    { id: "category", label: "Category", options: withCount(categories.map((c) => ({ value: c.id, label: c.name })), (r, v) => r.collectionId === v) },
    {
      id: "color",
      label: "Colour",
      options: withCount(
        [...colours.values()].sort((a, b) => a.colorName.localeCompare(b.colorName)).map((r) => ({ value: r.colorId, label: r.colorName, swatch: r.hex })),
        (r, v) => r.colorId === v,
      ),
    },
    {
      id: "size",
      label: "Size",
      options: withCount(
        sizes.map((s) => ({ value: s, label: s === "one-size" ? "One size" : sizeLabel(taxonomy, s) })),
        (r, v) => r.size === v,
      ),
    },
  ].filter((g) => g.options.length > 0);
}

export function applyFilters(rows, filters, level) {
  const on = (k) => filters[k]?.length > 0;
  return rows.filter(
    (r) =>
      (level === "all" || r.level === level) &&
      (!on("category") || filters.category.includes(r.collectionId)) &&
      (!on("color") || filters.color.includes(r.colorId)) &&
      (!on("size") || filters.size.includes(r.size)),
  );
}

/** The figures across the top: of every variant, not the filtered view. */
export function inventorySummary(rows) {
  return rows.reduce(
    (s, r) => ({
      onHand: s.onHand + r.onHand,
      reserved: s.reserved + r.reserved,
      value: s.value + r.onHand * r.price,
      low: s.low + (r.level === "low" ? 1 : 0),
      out: s.out + (r.level === "out" ? 1 : 0),
    }),
    { onHand: 0, reserved: 0, value: 0, low: 0, out: 0 },
  );
}

export const csvColumns = (taxonomy) => [
  ["name", "Piece"],
  [(r) => variantLabel(r, taxonomy), "Colour and size"],
  ["onHand", "On hand"],
  ["reserved", "In open orders"],
  ["available", "Available"],
  [(r) => ({ in: "In stock", low: "Low stock", out: "Sold out" })[r.level], "Status"],
  ["price", "Price (EUR)"],
];

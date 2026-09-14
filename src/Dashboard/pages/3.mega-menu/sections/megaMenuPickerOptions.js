/* Mega Menu Picker Options */
import { LABELS, matchesTarget } from "@/utils/menuTargets";

const DIMENSION_KINDS = [
  { id: "occasion", label: "Occasion" },
  { id: "fabric", label: "Fabric" },
  { id: "style", label: "Style" },
  { id: "length", label: "Length" },
  { id: "color", label: "Colour" },
  { id: "hair", label: "Hair texture" },
];

/** Filters can combine several values, such as Party or Evening. */
export const MULTI = new Set(DIMENSION_KINDS.map((k) => k.id));

/** Kinds that can be narrowed to one category. */
export const SCOPED = new Set([...MULTI, "label"]);

/** A top-level item shows something broad; a link can show anything but a single product. */
export function kindsFor(mode) {
  if (mode === "item") {
    return [
      { id: "all", label: "Everything" },
      { id: "category", label: "A category" },
      { id: "label", label: "A label" },
    ];
  }
  return [{ id: "category", label: "Category" }, { id: "type", label: "Type" }, ...DIMENSION_KINDS, { id: "label", label: "Label" }];
}

export function optionsFor(kind, { categories = [], taxonomy = {} }) {
  if (kind === "category") return categories.map((c) => ({ value: c.id, name: c.name }));
  if (kind === "type") {
    return categories.flatMap((c) =>
      (c.types ?? []).map((t) => ({ value: `${c.id}/${t.id}`, name: t.name, group: c.name })),
    );
  }
  if (kind === "label") return Object.entries(LABELS).map(([value, name]) => ({ value, name }));
  return (taxonomy[kind]?.values ?? []).map((v) => ({ value: v.id, name: v.name ?? v.id, hex: v.hex }));
}

/** The picker's state -> a target, or null while nothing is chosen. */
export function targetFrom({ kind, values = [], category, newOnly }) {
  if (kind === "all") return { kind: "all" };
  if (!values.length) return null;

  const onlyNew = newOnly ? { newOnly: true } : {};
  const scope = { ...(category ? { category } : {}), ...onlyNew };

  if (kind === "category") return { kind, id: values[0], ...onlyNew };
  if (kind === "type") {
    const [categoryId, id] = values[0].split("/");
    return { kind, category: categoryId, id, ...onlyNew };
  }
  if (kind === "label") return { kind, id: values[0], ...scope };
  return { kind: "filter", dimension: kind, values, ...scope };
}

/** A stored target -> the picker's state, so editing opens on what is there. */
export function stateFrom(target, defaultCategory = "") {
  if (!target) return { kind: null, values: [], category: defaultCategory, newOnly: false };

  const base = { category: target.category ?? "", newOnly: Boolean(target.newOnly) };
  switch (target.kind) {
    case "all":
      return { ...base, kind: "all", values: ["all"] };
    case "category":
      return { ...base, category: "", kind: "category", values: [target.id] };
    case "type":
      return { ...base, category: "", kind: "type", values: [`${target.category}/${target.id}`] };
    case "label":
      return { ...base, kind: "label", values: [target.id] };
    case "filter":
      return { ...base, kind: target.dimension, values: [...(target.values ?? [])] };
    default:
      return { ...base, kind: null, values: [] };
  }
}

export function countFor(target, products = []) {
  return target ? products.filter((p) => matchesTarget(p, target)).length : 0;
}

export function piecesText(count) {
  if (count === null || count === undefined) return "";
  return count === 0 ? "No pieces yet" : `${count} ${count === 1 ? "piece" : "pieces"}`;
}

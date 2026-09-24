import { ApiError, mockApi } from "@/api/mock";
import { getState, setState } from "../store/contentStore";
import { slugify } from "./products/productSlug";
import { catalogItems } from "./products/productStore";

/**
 * Categories: what a piece is. Each offers a set of sizes, optional types
 * within it (Accessories: Heels, Handbags…), and its own Subcategories —
 * freely-named "Shop by …" groups, each holding its own types.
 *
 * Ids are fixed at creation: a category id is every product's collectionId and
 * a type id is a product's `type`, and both are filter tokens, so renaming
 * changes only the name. A category or type still in use cannot be removed.
 */

function categoryItems() {
  return getState("categories").items;
}

/**
 * The first Mega Menu link (or tile) that shows something a category edit is
 * about to remove. The menu can only be built from what exists, so what
 * exists can't be removed out from under it — same rule as a type still on a
 * product.
 *
 * `gone` describes what is being removed: { category, type?, subcategory?, subcategoryType? }.
 */
function menuUsing(gone) {
  const uses = (t) => {
    if (!t) return false;
    if (t.kind === "category") return t.id === gone.category && !gone.type && !gone.subcategory;
    if (t.kind === "type") return t.category === gone.category && t.id === gone.type;
    if (t.kind === "filter" && String(t.dimension).startsWith("subcat:") && t.category === gone.category) {
      if (t.dimension !== `subcat:${gone.subcategory}`) return false;
      return !gone.subcategoryType || (t.values ?? []).includes(gone.subcategoryType);
    }
    return false;
  };
  for (const root of getState("navigation").items) {
    if (uses(root.target)) return root.label;
    for (const section of root.sections ?? []) {
      for (const leaf of section.items ?? []) if (uses(leaf.target)) return `${root.label} › ${leaf.label}`;
    }
    for (const tile of root.tiles ?? []) if (uses(tile.target)) return `${root.label} › ${tile.title}`;
  }
  return null;
}

function inMenuError(name, where) {
  return new ApiError(`${name} is used by the menu (${where}). Remove or change that link in Mega Menu first.`, 409);
}

export function getCategories() {
  return mockApi(() => [...categoryItems()], 0);
}

/** How many products sit in each category, keyed by category id. */
export function categoryUsage() {
  return mockApi(() => {
    const counts = {};
    for (const product of catalogItems()) {
      counts[product.collectionId] = (counts[product.collectionId] ?? 0) + 1;
    }
    return counts;
  }, 0);
}

/** How many products sit in each type, keyed by `<categoryId>:<typeId>`. */
export function typeUsage() {
  return mockApi(() => {
    const counts = {};
    for (const p of catalogItems()) {
      if (p.type) counts[`${p.collectionId}:${p.type}`] = (counts[`${p.collectionId}:${p.type}`] ?? 0) + 1;
    }
    return counts;
  }, 0);
}

export function createCategory(input) {
  return mockApi(() => {
    const fields = clean(input);
    const category = { id: uniqueId(slugify(fields.name)), ...fields };
    setState("categories", (state) => ({ ...state, items: [...state.items, category] }));
    return category;
  });
}

export function updateCategory(id, input) {
  return mockApi(() => {
    const existing = categoryItems().find((c) => c.id === id);
    if (!existing) throw new ApiError("That category no longer exists.", 404);

    const fields = clean(input, existing);
    const kept = new Set(fields.types.map((t) => t.id));
    for (const type of existing.types ?? []) {
      if (kept.has(type.id)) continue;
      const count = catalogItems().filter((p) => p.collectionId === id && p.type === type.id).length;
      if (count) {
        throw new ApiError(
          `${type.name} is on ${count} ${count === 1 ? "product" : "products"}. Give ${count === 1 ? "it" : "them"} another type before removing it.`,
          409,
        );
      }
    }

    for (const type of existing.types ?? []) {
      if (kept.has(type.id)) continue;
      const where = menuUsing({ category: id, type: type.id });
      if (where) throw inMenuError(type.name, where);
    }
    const nextSubs = new Map(fields.subcategories.map((s) => [s.id, s]));
    for (const sub of existing.subcategories ?? []) {
      const next = nextSubs.get(sub.id);
      if (!next) {
        const where = menuUsing({ category: id, subcategory: sub.id });
        if (where) throw inMenuError(sub.name, where);
        continue;
      }
      const stay = new Set(next.types.map((t) => t.id));
      for (const type of sub.types ?? []) {
        if (stay.has(type.id)) continue;
        const where = menuUsing({ category: id, subcategory: sub.id, subcategoryType: type.id });
        if (where) throw inMenuError(type.name, where);
      }
    }

    const updated = { ...existing, ...fields };
    setState("categories", (state) => ({
      ...state,
      items: state.items.map((c) => (c.id === id ? updated : c)),
    }));
    return updated;
  });
}

export function deleteCategory(id) {
  return mockApi(() => {
    const category = categoryItems().find((c) => c.id === id);
    if (!category) throw new ApiError("That category no longer exists.", 404);

    const count = catalogItems().filter((p) => p.collectionId === id).length;
    if (count) {
      throw new ApiError(
        `${category.name} still holds ${count} ${count === 1 ? "product" : "products"}. Move them to another category first.`,
        409,
      );
    }

    const where = menuUsing({ category: id });
    if (where) throw inMenuError(category.name, where);

    setState("categories", (state) => ({
      ...state,
      items: state.items.filter((c) => c.id !== id),
    }));
    return category;
  });
}

function clean({ name, sizes, types, subcategories } = {}, existing = null) {
  const trimmed = String(name ?? "").trim();
  if (!trimmed) throw new ApiError("Give the category a name.", 422);

  const clash = categoryItems().find(
    (c) => c.id !== existing?.id && c.name.toLowerCase() === trimmed.toLowerCase(),
  );
  if (clash) throw new ApiError(`There is already a category called ${clash.name}.`, 409);

  return {
    name: trimmed,
    sizes: Array.isArray(sizes) ? sizes : [],
    types: cleanTypes(types, existing?.types ?? []),
    subcategories: cleanSubcategories(subcategories, existing?.subcategories ?? []),
  };
}

/** A flat named list — a category's own types, or one subcategory's types.
    Ids keep stable across a rename by matching the previous list; a name
    repeated within the same list is rejected. */
function cleanNamedList(list, previous, noun = "type") {
  const known = new Set(previous.map((t) => t.id));
  const names = new Set();
  const ids = new Set();

  return (Array.isArray(list) ? list : []).flatMap((item) => {
    const itemName = String(item?.name ?? "").trim();
    if (!itemName) return [];
    if (names.has(itemName.toLowerCase())) {
      throw new ApiError(`${itemName} is listed twice. Each ${noun} needs its own name.`, 409);
    }
    names.add(itemName.toLowerCase());

    let id = known.has(item.id) ? item.id : slugify(itemName) || noun;
    for (let n = 2; ids.has(id) || (!known.has(item.id) && known.has(id)); n += 1) {
      id = `${slugify(itemName) || noun}-${n}`;
    }
    ids.add(id);
    return [{ id, name: itemName }];
  });
}

/** Types keep their id when renamed; new ones get an id from their name. */
function cleanTypes(types, previous) {
  return cleanNamedList(types, previous, "type");
}

/** A category's own "Shop by …" groups, each holding its own freely-named
    types. Independent of the shared taxonomy and of Mega Menu — purely this
    category's own breakdown of itself. */
function cleanSubcategories(subcategories, previous) {
  const previousById = new Map(previous.map((s) => [s.id, s]));
  const shells = cleanNamedList(subcategories, previous, "subcategory");
  const raw = Array.isArray(subcategories) ? subcategories.filter((s) => String(s?.name ?? "").trim()) : [];

  return shells.map((shell, i) => {
    const previousTypes = previousById.get(shell.id)?.types ?? [];
    return { ...shell, types: cleanNamedList(raw[i]?.types, previousTypes, "type") };
  });
}

function uniqueId(base) {
  const root = base || "category";
  const taken = new Set(categoryItems().map((c) => c.id));
  let id = root;
  for (let n = 2; taken.has(id); n += 1) id = `${root}-${n}`;
  return id;
}

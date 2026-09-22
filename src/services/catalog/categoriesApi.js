import { ApiError, mockApi } from "@/api/mock";
import { getState, setState } from "../store/contentStore";
import { slugify } from "./products/productSlug";
import { catalogItems } from "./products/productStore";

/**
 * Categories: what a piece is. Each offers a set of sizes, a set of extra
 * details (occasion, fabric…) the product form asks for, and optional types
 * within it (Accessories: Heels, Handbags…).
 *
 * Ids are fixed at creation: a category id is every product's collectionId and
 * a type id is a product's `type`, and both are filter tokens, so renaming
 * changes only the name. A category or type still in use cannot be removed.
 */

function categoryItems() {
  return getState("categories").items;
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

    setState("categories", (state) => ({
      ...state,
      items: state.items.filter((c) => c.id !== id),
    }));
    return category;
  });
}

function clean({ name, sizes, details, types } = {}, existing = null) {
  const trimmed = String(name ?? "").trim();
  if (!trimmed) throw new ApiError("Give the category a name.", 422);

  const clash = categoryItems().find(
    (c) => c.id !== existing?.id && c.name.toLowerCase() === trimmed.toLowerCase(),
  );
  if (clash) throw new ApiError(`There is already a category called ${clash.name}.`, 409);

  return {
    name: trimmed,
    sizes: Array.isArray(sizes) ? sizes : [],
    details: Array.isArray(details) ? details : [],
    types: cleanTypes(types, existing?.types ?? []),
  };
}

/** Types keep their id when renamed; new ones get an id from their name. */
function cleanTypes(types, previous) {
  const known = new Set(previous.map((t) => t.id));
  const names = new Set();
  const ids = new Set();

  return (Array.isArray(types) ? types : []).flatMap((type) => {
    const typeName = String(type?.name ?? "").trim();
    if (!typeName) return [];
    if (names.has(typeName.toLowerCase())) {
      throw new ApiError(`${typeName} is listed twice. Each type needs its own name.`, 409);
    }
    names.add(typeName.toLowerCase());

    let id = known.has(type.id) ? type.id : slugify(typeName) || "type";
    for (let n = 2; ids.has(id) || (!known.has(type.id) && known.has(id)); n += 1) {
      id = `${slugify(typeName) || "type"}-${n}`;
    }
    ids.add(id);
    return [{ id, name: typeName }];
  });
}

function uniqueId(base) {
  const root = base || "category";
  const taken = new Set(categoryItems().map((c) => c.id));
  let id = root;
  for (let n = 2; taken.has(id); n += 1) id = `${root}-${n}`;
  return id;
}

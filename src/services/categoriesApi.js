import { ApiError, mockApi } from "@/api/mock";
import { getState, setState } from "./contentStore";
import { slugify } from "./products/productSlug";
import { catalogItems } from "./products/productStore";

/**
 * Categories: what a piece is. Each offers a set of sizes and a set of extra
 * details (occasion, fabric…) that the product form asks for.
 *
 * The id is fixed at creation: it is every product's collectionId and part of
 * the storefront's `cat:` filter token, so renaming changes only the name. A
 * category still holding products cannot be deleted.
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
    const updated = { ...existing, ...clean(input, id) };
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

function clean({ name, sizes, details } = {}, ignoreId = null) {
  const trimmed = String(name ?? "").trim();
  if (!trimmed) throw new ApiError("Give the category a name.", 422);

  const clash = categoryItems().find(
    (c) => c.id !== ignoreId && c.name.toLowerCase() === trimmed.toLowerCase(),
  );
  if (clash) throw new ApiError(`There is already a category called ${clash.name}.`, 409);

  return {
    name: trimmed,
    sizes: Array.isArray(sizes) ? sizes : [],
    details: Array.isArray(details) ? details : [],
  };
}

function uniqueId(base) {
  const root = base || "category";
  const taken = new Set(categoryItems().map((c) => c.id));
  let id = root;
  for (let n = 2; taken.has(id); n += 1) id = `${root}-${n}`;
  return id;
}

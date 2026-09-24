import { ApiError, mockApi } from "@/api/mock";
import { getState, setState } from "../store/contentStore";
import { slugify } from "./products/productSlug";
import { catalogItems } from "./products/productStore";
import { audited } from "../auth/audited";

/**
 * The size list — XS, EU 38, One Size — that a category offers from
 * (`category.sizes[]`) and a product picks within (`product.sizes[]`). An id
 * is fixed at creation, since it is what both of those arrays store;
 * renaming only ever changes the name they read.
 */

function sizeValues() {
  return getState("taxonomy").dimensions?.size?.values ?? [];
}

function uniqueId(base) {
  const taken = new Set(sizeValues().map((v) => v.id));
  if (!taken.has(base)) return base;
  let n = 2;
  while (taken.has(`${base}-${n}`)) n += 1;
  return `${base}-${n}`;
}

function write(values) {
  setState("taxonomy", (state) => ({
    ...state,
    dimensions: { ...state.dimensions, size: { ...state.dimensions.size, values } },
  }));
}

/** How many categories offer, and how many products carry, each size — keyed by size id. */
export function sizeUsage() {
  return mockApi(() => {
    const categories = {};
    const products = {};
    for (const c of getState("categories").items) {
      for (const id of c.sizes ?? []) categories[id] = (categories[id] ?? 0) + 1;
    }
    for (const p of catalogItems()) {
      for (const id of p.sizes ?? []) products[id] = (products[id] ?? 0) + 1;
    }
    return { categories, products };
  }, 0);
}

function createSize$raw(name) {
  return mockApi(() => {
    const trimmed = String(name ?? "").trim();
    if (!trimmed) throw new ApiError("Give it a name.", 422);
    const current = sizeValues();
    if (current.some((v) => v.name.toLowerCase() === trimmed.toLowerCase())) {
      throw new ApiError(`${trimmed} is already on the list.`, 409);
    }
    const value = { id: uniqueId(slugify(trimmed)), name: trimmed };
    write([...current, value]);
    return value;
  });
}

function renameSize$raw(id, name) {
  return mockApi(() => {
    const trimmed = String(name ?? "").trim();
    if (!trimmed) throw new ApiError("Give it a name.", 422);
    const current = sizeValues();
    if (!current.some((v) => v.id === id)) throw new ApiError("That no longer exists.", 404);
    write(current.map((v) => (v.id === id ? { ...v, name: trimmed } : v)));
    return { id, name: trimmed };
  });
}

function deleteSize$raw(id) {
  return mockApi(() => {
    const current = sizeValues();
    const value = current.find((v) => v.id === id);
    if (!value) throw new ApiError("That no longer exists.", 404);

    const catCount = getState("categories").items.filter((c) => (c.sizes ?? []).includes(id)).length;
    const prodCount = catalogItems().filter((p) => (p.sizes ?? []).includes(id)).length;
    if (catCount || prodCount) {
      const parts = [];
      if (catCount) parts.push(`${catCount} ${catCount === 1 ? "category" : "categories"}`);
      if (prodCount) parts.push(`${prodCount} ${prodCount === 1 ? "product" : "products"}`);
      throw new ApiError(`${value.name} is offered by ${parts.join(" and ")}. Remove it from them before deleting.`, 409);
    }
    write(current.filter((v) => v.id !== id));
    return value;
  });
}

/* Recorded in the staff activity log. */
export const createSize = audited("catalogue", ([name]) => `Added size ${name}`, createSize$raw);
export const renameSize = audited("catalogue", ([, name]) => `Renamed a size to ${name}`, renameSize$raw);
export const deleteSize = audited("catalogue", ([id]) => `Deleted size ${id}`, deleteSize$raw);

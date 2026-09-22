import { ApiError, mockApi } from "@/api/mock";
import { DIMENSION_PREFIX } from "../../utils/faceting";
import { getState, setState } from "../store/contentStore";
import { slugify } from "./products/productSlug";
import { catalogItems } from "./products/productStore";

/**
 * Values within a detail dimension — Occasion, Fabric, Style, Length, Hair —
 * the chips a product form offers once its category asks for that detail.
 * Colour and Size are managed elsewhere (Categories & Colours, and a
 * category's own "Sizes offered") because each carries more than a name.
 *
 * An id is fixed at creation and is the product tag (`occ:party`), so renaming
 * changes only what shoppers and admins read. A value still tagged on a
 * product cannot be removed.
 */

const MANAGED = new Set(["occasion", "fabric", "style", "length", "hair"]);

function values(dimension) {
  if (!MANAGED.has(dimension)) throw new ApiError(`"${dimension}" is not a detail dimension.`, 404);
  return getState("taxonomy").dimensions?.[dimension]?.values ?? [];
}

function tokenFor(dimension, id) {
  return `${DIMENSION_PREFIX[dimension] ?? dimension}:${id}`;
}

function uniqueId(dimension, base) {
  const taken = new Set(values(dimension).map((v) => v.id));
  if (!taken.has(base)) return base;
  let n = 2;
  while (taken.has(`${base}-${n}`)) n += 1;
  return `${base}-${n}`;
}

function write(dimension, next) {
  setState("taxonomy", (state) => ({
    ...state,
    dimensions: { ...state.dimensions, [dimension]: { ...state.dimensions[dimension], values: next } },
  }));
}

/** How many products carry each detail value, keyed by its tag (`occ:party`). */
export function detailValueUsage() {
  return mockApi(() => {
    const counts = {};
    for (const product of catalogItems()) {
      for (const tag of product.tags ?? []) counts[tag] = (counts[tag] ?? 0) + 1;
    }
    return counts;
  }, 0);
}

export function createDetailValue(dimension, name) {
  return mockApi(() => {
    const trimmed = String(name ?? "").trim();
    if (!trimmed) throw new ApiError("Give it a name.", 422);
    const current = values(dimension);
    if (current.some((v) => v.name.toLowerCase() === trimmed.toLowerCase())) {
      throw new ApiError(`${trimmed} is already on the list.`, 409);
    }
    const value = { id: uniqueId(dimension, slugify(trimmed)), name: trimmed };
    write(dimension, [...current, value]);
    return value;
  });
}

export function renameDetailValue(dimension, id, name) {
  return mockApi(() => {
    const trimmed = String(name ?? "").trim();
    if (!trimmed) throw new ApiError("Give it a name.", 422);
    const current = values(dimension);
    if (!current.some((v) => v.id === id)) throw new ApiError("That no longer exists.", 404);
    write(dimension, current.map((v) => (v.id === id ? { ...v, name: trimmed } : v)));
    return { id, name: trimmed };
  });
}

export function deleteDetailValue(dimension, id) {
  return mockApi(() => {
    const current = values(dimension);
    const value = current.find((v) => v.id === id);
    if (!value) throw new ApiError("That no longer exists.", 404);

    const token = tokenFor(dimension, id);
    const count = catalogItems().filter((p) => (p.tags ?? []).includes(token)).length;
    if (count) {
      throw new ApiError(
        `${value.name} is on ${count} ${count === 1 ? "product" : "products"}. Remove it from them before deleting.`,
        409,
      );
    }
    write(dimension, current.filter((v) => v.id !== id));
    return value;
  });
}

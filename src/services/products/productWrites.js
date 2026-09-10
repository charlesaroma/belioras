/* Catalogue Writes */
import { ApiError, mockApi } from "../apiClient";
import { setState } from "../contentStore";
import { slugify } from "./productSlug";
import { catalogItems, normalize } from "./productStore";

function nextProductId(items) {

  const highest = items.reduce((max, p) => {

    const n = Number(String(p.id).match(/\d+/)?.[0] ?? 0);
    return n > max ? n : max;
  }, 0);
  return `p${highest + 1}`;
}

/** Ensures a slug is unique, suffixing -2, -3 … when a name repeats. */
function uniqueSlug(items, base, ignoreId = null) {

  const taken = new Set(items.filter((p) => p.id !== ignoreId).map((p) => p.slug));
  if (!taken.has(base)) return base;
  let n = 2;
  while (taken.has(`${base}-${n}`)) n += 1;
  return `${base}-${n}`;
}

export function createProduct(input) {
  return mockApi(() => {

    const name = String(input.name ?? "").trim();
    if (!name) throw new ApiError("A product needs a name.", 422);
    if (!(Number(input.price) > 0)) throw new ApiError("A product needs a price.", 422);

    const items = catalogItems();

    const id = nextProductId(items);

    const product = {
      ...input,
      id,
      name,
      slug: uniqueSlug(items, input.slug ? slugify(input.slug) : slugify(name)),
      price: Number(input.price),
      originalPrice: input.originalPrice ? Number(input.originalPrice) : null,
      stock: Number(input.stock) || 0,
      images: input.images ?? [],
      colors: input.colors ?? [],
      sizes: input.sizes ?? [],
      categories: input.categories ?? [],
      status: input.status ?? "draft",
      createdAt: new Date().toISOString(),
    };

    setState("products", (state) => ({ ...state, items: [product, ...state.items] }));
    return normalize(product);
  });
}

export function updateProduct(id, patch) {
  return mockApi(() => {

    const items = catalogItems();

    const existing = items.find((p) => p.id === id);
    if (!existing) throw new ApiError("Product not found.", 404);

    const name = patch.name !== undefined ? String(patch.name).trim() : existing.name;
    if (!name) throw new ApiError("A product needs a name.", 422);

    const updated = {
      ...existing,
      ...patch,
      id,
      name,
      // Re-slug only when the name actually changed, so an existing product
      // URL does not quietly break on an unrelated edit.
      slug:
        name !== existing.name
          ? uniqueSlug(items, slugify(name), id)
          : existing.slug,
      price: patch.price !== undefined ? Number(patch.price) : existing.price,
      stock: patch.stock !== undefined ? Number(patch.stock) || 0 : existing.stock,
      updatedAt: new Date().toISOString(),
    };

    setState("products", (state) => ({
      ...state,
      items: state.items.map((p) => (p.id === id ? updated : p)),
    }));
    return normalize(updated);
  });
}

export function deleteProduct(id) {
  return mockApi(() => {

    const existing = catalogItems().find((p) => p.id === id);
    if (!existing) throw new ApiError("Product not found.", 404);

    setState("products", (state) => ({
      ...state,
      items: state.items.filter((p) => p.id !== id),
    }));
    // Returned so the caller can offer Undo without having kept a copy.
    return existing;
  });
}

/** Re-inserts a deleted product, for the Undo action on the delete toast. */
export function restoreProduct(product) {
  return mockApi(() => {
    setState("products", (state) =>
      state.items.some((p) => p.id === product.id)
        ? state
        : { ...state, items: [product, ...state.items] },
    );
    return normalize(product);
  });
}

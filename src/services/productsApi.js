import newArrivalsSeed from "../data/newArrivals.json";

import { ApiError, mockApi } from "./apiClient";
import { getState, setState } from "./contentStore";
import { getBestSellerProductIds } from "./ordersApi";
import { COLOR_NAME_TO_TAXONOMY, LEGACY_CATEGORY_TOKENS } from "../utils/constants";

/**
 * The catalogue, read through the content store rather than straight from the
 * fixture files.
 *
 * This is what makes the dashboard real. Previously the catalogue was a
 * module-level const, so an admin could add or edit a product and the change
 * existed only in that page's component state — invisible to the storefront
 * and gone on reload. Reading the store means one edit reaches every surface
 * and survives a restart, and the eventual swap to a real API stays inside
 * this file.
 *
 * A getter, not a captured value: setState replaces the domain object, so a
 * const bound at module load would go stale after the first write.
 */

/* catalog Items */
function catalogItems() {
  return getState("products").items;
}

/**
 * Derives the prefixed-tag vocabulary the mega menu and filters match against.
 *
 * Derived rather than stored so no product fixture had to be rewritten: the PDP
 * and shop filters keep reading `categories` / `collectionId` untouched. When
 * products carry authored `tags[]`, this can be deleted along with
 * LEGACY_CATEGORY_TOKENS.
 */

function deriveTags(product) {

  const tags = new Set(product.tags ?? []);

  if (product.collectionId) tags.add(`cat:${product.collectionId}`);
  if (product.isNew) tags.add("tag:new");
  if (product.bestseller) tags.add("tag:bestseller");
  if (product.featured) tags.add("tag:featured");

  for (const category of product.categories ?? []) {

    const token = LEGACY_CATEGORY_TOKENS[category];
    if (token) tags.add(token);
    // Keep the raw value too, so a menu leaf whose slug already matches a
    // category (e.g. jumpsuits) resolves without a map entry.
    tags.add(`cat:${category}`);
  }

  for (const color of product.colors ?? []) {

    const swatch = COLOR_NAME_TO_TAXONOMY[color];
    if (swatch) tags.add(`color:${swatch}`);
  }

  return [...tags];
}

function normalize(product) {
  return { ...product, images: product.images ?? [], tags: deriveTags(product) };
}

/* get Products */
export function getProducts() {
  return mockApi(() => catalogItems().map(normalize));
}

export function getProduct(idOrSlug) {
  return mockApi(() => {

    const product = catalogItems().find((p) => p.id === idOrSlug || p.slug === idOrSlug);
    if (!product) throw new ApiError("Product not found.", 404);
    return normalize(product);
  });
}

/* get Products By Collection */
export function getProductsByCollection(collectionId) {
  return mockApi(() =>
    catalogItems().filter((p) => p.collectionId === collectionId).map(normalize)
  );
}

/* get New Arrivals */
export function getNewArrivals() {
  return mockApi(() =>
    newArrivalsSeed
      .slice()
      .sort((a, b) => (a.addedAt < b.addedAt ? 1 : -1))
      .map((entry) => {

        const product = catalogItems().find((p) => p.id === entry.productId);
        return product ? { ...normalize(product), addedAt: entry.addedAt } : null;
      })
      .filter(Boolean)
  );
}

/* search Products */
export function searchProducts(query) {
  return mockApi(() => {

/* q */
    const q = String(query ?? "").trim().toLowerCase();
    if (!q) return [];
    return catalogItems()
      .filter((p) =>
        [p.name, p.description, (p.categories ?? []).join(" ")]
          .join(" ")
          .toLowerCase()
          .includes(q)
      )
      .map(normalize);
  });
}

/* get Featured Products */
export function getFeaturedProducts() {
  return mockApi(() => catalogItems().filter((p) => p.bestseller || p.featured).map(normalize));
}

/**
 * Best sellers, ranked by actual units sold.
 *
 * The `bestseller` flag is a backfill, not the source: with a thin order
 * history the aggregate alone would return two or three products and the
 * section would look broken. The backfill lives here rather than in the
 * component because a real backend would apply the same rule server-side.
 */

/* get Best Sellers */
export function getBestSellers(limit = 8) {
  return mockApi(async () => {

    const ranked = await getBestSellerProductIds({ limit });

    const products = ranked
      .map(({ productId }) => catalogItems().find((p) => p.id === productId))
      .filter(Boolean)
      .map(normalize);

    if (products.length >= limit) return products;

    const seen = new Set(products.map((p) => p.id));

    const backfill = catalogItems()
      .filter((p) => p.bestseller && !seen.has(p.id))
      .slice(0, limit - products.length)
      .map(normalize);

    return [...products, ...backfill];
  }, 0);
}
/* ------------------------------------------------------------------ writes */

/**
 * Ligatures and strokes that NFD does not decompose.
 *
 * Unicode normalisation splits é into e + a combining accent, but œ, æ, ø, ß
 * and đ are single characters with no base letter to fall back to — so
 * stripping "everything not a-z" turns "Cœur" into "cur". This maps them to
 * the transliteration each language actually uses. It matters here: the brand
 * is Portuguese and names its pieces in French.
 */

const LIGATURES = {
  œ: "oe",
  æ: "ae",
  ø: "o",
  ß: "ss",
  đ: "d",
  ð: "d",
  þ: "th",
  ł: "l",
};

/** Slugify a product name for its URL. */
export function slugify(value) {
  return String(value)
    .toLowerCase()
    .replace(/[œæøßđðþł]/g, (ch) => LIGATURES[ch] ?? ch)
    // Split accented letters into base + combining mark, then drop the marks.
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/**
 * Next free product id.
 *
 * The dashboard generated `PRD-${Math.random() * 1000}`, which collides often
 * enough to matter with only a thousand slots and no uniqueness check — two
 * products sharing an id would make the PDP resolve to whichever came first.
 * Counting past the highest existing id cannot collide.
 */

/* next Product Id */
function nextProductId(items) {

  const highest = items.reduce((max, p) => {

/* n */
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

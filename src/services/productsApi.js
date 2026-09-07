import productsSeed from "../data/products.json";
import hairSeed from "../data/hair.json";
import accessoriesSeed from "../data/accessories.json";
import catalogExtraSeed from "../data/catalogExtra.json";
import newArrivalsSeed from "../data/newArrivals.json";

import { ApiError, mockApi } from "./apiClient";
import { getBestSellerProductIds } from "./ordersApi";
import { COLOR_NAME_TO_TAXONOMY, LEGACY_CATEGORY_TOKENS } from "../utils/constants";

/**
 * catalogExtra holds the inventory carried over from the design prototype,
 * normalised into this repo's product shape. It is a separate file so the
 * originally authored fixtures stay identifiable when real stock replaces both.
 */
const catalog = [...productsSeed, ...hairSeed, ...accessoriesSeed, ...catalogExtraSeed];

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

export function getProducts() {
  return mockApi(() => catalog.map(normalize));
}

export function getProduct(idOrSlug) {
  return mockApi(() => {
    const product = catalog.find((p) => p.id === idOrSlug || p.slug === idOrSlug);
    if (!product) throw new ApiError("Product not found.", 404);
    return normalize(product);
  });
}

export function getProductsByCollection(collectionId) {
  return mockApi(() =>
    catalog.filter((p) => p.collectionId === collectionId).map(normalize)
  );
}

export function getNewArrivals() {
  return mockApi(() =>
    newArrivalsSeed
      .slice()
      .sort((a, b) => (a.addedAt < b.addedAt ? 1 : -1))
      .map((entry) => {
        const product = catalog.find((p) => p.id === entry.productId);
        return product ? { ...normalize(product), addedAt: entry.addedAt } : null;
      })
      .filter(Boolean)
  );
}

export function searchProducts(query) {
  return mockApi(() => {
    const q = String(query ?? "").trim().toLowerCase();
    if (!q) return [];
    return catalog
      .filter((p) =>
        [p.name, p.description, (p.categories ?? []).join(" ")]
          .join(" ")
          .toLowerCase()
          .includes(q)
      )
      .map(normalize);
  });
}

export function getFeaturedProducts() {
  return mockApi(() => catalog.filter((p) => p.bestseller || p.featured).map(normalize));
}

/**
 * Best sellers, ranked by actual units sold.
 *
 * The `bestseller` flag is a backfill, not the source: with a thin order
 * history the aggregate alone would return two or three products and the
 * section would look broken. The backfill lives here rather than in the
 * component because a real backend would apply the same rule server-side.
 */
export function getBestSellers(limit = 8) {
  return mockApi(async () => {
    const ranked = await getBestSellerProductIds({ limit });

    const products = ranked
      .map(({ productId }) => catalog.find((p) => p.id === productId))
      .filter(Boolean)
      .map(normalize);

    if (products.length >= limit) return products;

    const seen = new Set(products.map((p) => p.id));
    const backfill = catalog
      .filter((p) => p.bestseller && !seen.has(p.id))
      .slice(0, limit - products.length)
      .map(normalize);

    return [...products, ...backfill];
  }, 0);
}
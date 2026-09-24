/* Catalogue Reads */
import { ApiError, mockApi } from "@/api/mock";
import { getState } from "../../store/contentStore";
import { getBestSellerProductIds } from "../../sales/ordersApi";
import { catalogItems, normalize } from "./productStore";

/**
 * What the shop may show: a piece is live unless the dashboard has it as a
 * draft. Every storefront read goes through this, so an unpublished piece is
 * absent from the shop, search, menu pages, the home page and its own address.
 * Older pieces carry no status and are live.
 */
function isLive(product) {
  return (product.status ?? "active") === "active";
}

/** Live pieces, for the storefront. */
export function getProducts() {
  return mockApi(() => catalogItems().filter(isLive).map(normalize));
}

/** Every piece whatever its status — the dashboard, and order history, which must still name a piece that was later unpublished. */
export function getAllProducts() {
  return mockApi(() => catalogItems().map(normalize));
}

export function getProduct(idOrSlug, { includeDrafts = false } = {}) {
  return mockApi(() => {

    const product = catalogItems().find((p) => p.id === idOrSlug || p.slug === idOrSlug);
    if (!product || (!includeDrafts && !isLive(product))) throw new ApiError("Product not found.", 404);
    return normalize(product);
  });
}

export function getProductsByCollection(collectionId) {
  return mockApi(() =>
    catalogItems().filter((p) => p.collectionId === collectionId && isLive(p)).map(normalize)
  );
}

/**
 * Pieces marked "New arrival" in the dashboard, newest first.
 *
 * This used to read a separate newArrivals.json that no screen could edit, so
 * a piece added in the dashboard never reached the home page rail however it
 * was flagged. The flag is now the single switch: badge, menu and rail.
 */
export function getNewArrivals() {
  return mockApi(() =>
    catalogItems()
      .filter((p) => p.isNew && isLive(p))
      .sort((a, b) => new Date(b.createdAt ?? 0) - new Date(a.createdAt ?? 0))
      .map(normalize),
  );
}

/**
 * Matches a piece's name and description, and where it is filed: its category,
 * type and the Subcategory types it is tagged with — so "satin", "wig" or
 * "cocktail" find the pieces under them.
 */
export function searchProducts(query) {
  return mockApi(() => {

    const q = String(query ?? "").trim().toLowerCase();
    if (!q) return [];
    const categories = getState("categories").items;
    return catalogItems()
      .filter(isLive)
      .filter((p) => filedUnder(p, categories).concat(p.name, p.description ?? "").join(" ").toLowerCase().includes(q))
      .map(normalize);
  });
}

function filedUnder(product, categories) {
  const category = categories.find((c) => c.id === product.collectionId);
  if (!category) return [];
  const names = [category.name, category.types?.find((t) => t.id === product.type)?.name];
  for (const tag of product.tags ?? []) {
    const [prefix, subId, typeId] = String(tag).split(":");
    if (prefix !== "subcat") continue;
    const sub = category.subcategories?.find((s) => s.id === subId);
    names.push(sub?.types?.find((t) => t.id === typeId)?.name);
  }
  return names.filter(Boolean);
}

export function getFeaturedProducts() {
  return mockApi(() => catalogItems().filter((p) => isLive(p) && (p.bestseller || p.featured)).map(normalize));
}

export function getBestSellers(limit = 8) {
  return mockApi(async () => {

    const ranked = await getBestSellerProductIds({ limit });

    const products = ranked
      .map(({ productId }) => catalogItems().find((p) => p.id === productId && isLive(p)))
      .filter(Boolean)
      .map(normalize);

    if (products.length >= limit) return products;

    const seen = new Set(products.map((p) => p.id));

    const backfill = catalogItems()
      .filter((p) => isLive(p) && p.bestseller && !seen.has(p.id))
      .slice(0, limit - products.length)
      .map(normalize);

    return [...products, ...backfill];
  }, 0);
}

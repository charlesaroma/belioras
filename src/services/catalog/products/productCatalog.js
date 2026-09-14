/* Catalogue Reads */
import { ApiError, mockApi } from "@/api/mock";
import { getBestSellerProductIds } from "../../sales/ordersApi";
import { catalogItems, normalize } from "./productStore";

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

export function getProductsByCollection(collectionId) {
  return mockApi(() =>
    catalogItems().filter((p) => p.collectionId === collectionId).map(normalize)
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
      .filter((p) => p.isNew && p.status !== "draft")
      .sort((a, b) => new Date(b.createdAt ?? 0) - new Date(a.createdAt ?? 0))
      .map(normalize),
  );
}

export function searchProducts(query) {
  return mockApi(() => {

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

export function getFeaturedProducts() {
  return mockApi(() => catalogItems().filter((p) => p.bestseller || p.featured).map(normalize));
}

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

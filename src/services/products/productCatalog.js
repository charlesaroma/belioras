/* Catalogue Reads */
import newArrivalsSeed from "../../data/newArrivals.json";

import { ApiError, mockApi } from "@/api/mock";
import { getBestSellerProductIds } from "../ordersApi";
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

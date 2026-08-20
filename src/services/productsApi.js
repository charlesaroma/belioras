import productsSeed from "../data/products.json";
import hairSeed from "../data/hair.json";
import accessoriesSeed from "../data/accessories.json";
import newArrivalsSeed from "../data/newArrivals.json";

import { ApiError, mockApi } from "./apiClient";

const catalog = [...productsSeed, ...hairSeed, ...accessoriesSeed];

function normalize(product) {
  return { ...product, images: product.images ?? [] };
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
  return mockApi(() => catalog.filter((p) => p.bestseller).map(normalize));
}
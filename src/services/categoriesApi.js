import categoriesSeed from "../data/categories.json";

import { mockApi } from "./apiClient";

export function getCategories() {
  return mockApi(() => categoriesSeed);
}

export function getCategoryById(id) {
  return mockApi(() => categoriesSeed.find((c) => c.id === id) ?? null);
}
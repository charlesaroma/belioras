import reviewsSeed from "../data/reviews.json";

import { mockApi } from "./apiClient";

export function getReviews(productId) {
  return mockApi(() =>
    reviewsSeed
      .filter((r) => r.productId === productId)
      .sort((a, b) => (a.date < b.date ? 1 : -1))
  );
}

export function getRecentReviews(limit = 3) {
  return mockApi(() =>
    reviewsSeed
      .slice()
      .sort((a, b) => (a.date < b.date ? 1 : -1))
      .slice(0, limit)
  );
}
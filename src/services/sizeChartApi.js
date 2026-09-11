import { mockApi } from "@/api/mock";
import { getState } from "./contentStore";

/**
 * The size reference tables.
 *
 * These lived in three places at once: the garment table inside product.jsx,
 * the footwear table byte-identically in both product.jsx and
 * shoe-size-guide.jsx, and the hair tables only on their own page. A fourth,
 * incompatible garment chart sat unused in dresses.json. One document now
 * backs the product-page modal and both standalone guides, so they cannot
 * disagree about what a size means.
 */

export function getSizeCharts() {
  return mockApi(() => structuredClone(getState("sizeCharts")), 0);
}

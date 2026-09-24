import { ApiError, mockApi } from "@/api/mock";
import { getState, resetDomain, setState } from "../store/contentStore";
import { audited } from "../auth/audited";

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

const SECTIONS = new Set(["garment", "international", "footwear", "hair", "howToMeasure"]);

/** Replaces one whole section — "garment", "international", "footwear", "hair" or "howToMeasure". */
function updateSizeChart$raw(section, data) {
  return mockApi(() => {
    if (!SECTIONS.has(section)) throw new ApiError(`"${section}" is not a size chart section.`, 404);
    // Remembers when each section was last edited, for the dashboard's cards.
    setState("sizeCharts", (state) => ({ ...state, [section]: data, updated: { ...state.updated, [section]: new Date().toISOString() } }));
    return data;
  });
}

/** Discards every edit and returns to the shipped tables. */
function resetSizeCharts$raw() {
  return mockApi(() => structuredClone(resetDomain("sizeCharts")));
}

/* Recorded in the staff activity log. */
export const updateSizeChart = audited("sizes", ([section]) => `Edited the ${section} size guide`, updateSizeChart$raw);
export const resetSizeCharts = audited("sizes", () => "Reset the size guides to defaults", resetSizeCharts$raw);

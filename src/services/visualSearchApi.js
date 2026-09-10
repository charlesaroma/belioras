import { mockApi } from "./apiClient";

/**
 * Search by photograph.
 *
 * A seam, deliberately not an implementation.
 *
 * Visual similarity needs an embedding model and a vector index — the backend
 * `search` module, plus a pgvector column on Media, neither of which exists
 * yet. What could be built today without them is a matcher that returns
 * plausible-looking results by colour histogram or, worse, at random. That
 * would be indistinguishable from working, for a while, and then quietly
 * wrong forever: a shopper photographs a black satin slip and is shown a
 * cream wool coat, and concludes the boutique does not stock what they want.
 *
 * So this returns `unavailable` and the interface says so. Everything a
 * working feature needs is in place around it — the camera, the crop, the
 * downscale, the results surface — and the cutover is this one file.
 *
 * When it does go live, `detectedTags` come back in the prefixed-tag
 * vocabulary the rest of the app already speaks (cat:, len:, occ:, style:,
 * fabric:, color:, hair:), so results feed straight into applyFilters and
 * useFilterParams with no new filtering code, and the shopper can correct a
 * mis-detected chip rather than being stuck with it.
 */

export function searchByImage(blob) {
  return mockApi(() => {
    if (!blob) {
      return { status: "error", message: "No image was provided.", results: [], detectedTags: [] };
    }

    return {
      status: "unavailable",
      message:
        "Search by photograph is not live yet. We are training it on the Belioras catalogue.",
      results: [],
      detectedTags: [],
    };
  }, 900);
}

/** Whether to offer the entry point at all. Flips with the backend. */
export function isVisualSearchAvailable() {
  return false;
}

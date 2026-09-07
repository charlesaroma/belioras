import { mockApi } from "./apiClient";
import { getState } from "./contentStore";

/**
 * Navigation tree and product taxonomy.
 *
 * Replaces the old categoriesApi. The tree is the single source of truth for
 * both the mega menu and URL validity — a leaf that exists in the menu always
 * resolves, and a path that is not in the tree always 404s.
 */

export function getNavigation() {
  return mockApi(() => getState("navigation").items, 0);
}

export function getNavItem(id) {
  return mockApi(() => getState("navigation").items.find((item) => item.id === id) ?? null, 0);
}

/** Attribute dimensions (colour, size, fabric, occasion, style, length, hair). */
export function getTaxonomy() {
  return mockApi(() => getState("taxonomy").dimensions, 0);
}

/** Flat list of every leaf, used for URL resolution and breadcrumbs. */
export function getNavLeaves() {
  return mockApi(() => flattenLeaves(getState("navigation").items), 0);
}

export function flattenLeaves(items) {
  return items.flatMap((root) =>
    root.sections.flatMap((section) =>
      section.items.map((leaf) => ({ ...leaf, rootId: root.id, rootLabel: root.label })),
    ),
  );
}

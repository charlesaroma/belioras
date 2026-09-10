import { mockApi } from "./apiClient";
import { getState, resetDomain, setState } from "./contentStore";

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

/* ------------------------------------------------------------------ writes */

/**
 * Replace the navigation tree.
 *
 * The whole tree at once rather than per-item patches: the mega menu is one
 * ordered structure, and a reorder touches every sibling anyway. It goes
 * through the content store, so an edit reaches the storefront's menu and
 * survives a reload — the tree was previously read-only from the dashboard.
 *
 * Callers pass the roots array; `rev` is preserved by the store.
 */

export function updateNavigation(items) {
  return mockApi(() => {
    setState("navigation", (state) => ({ ...state, items }));
    return items;
  });
}

/** Restore the shipped menu, discarding every dashboard edit. */
export function resetNavigation() {
  return mockApi(() => resetDomain("navigation").items);
}

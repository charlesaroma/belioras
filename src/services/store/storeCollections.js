import { getState, setState } from "./contentStore";

/**
 * Deletes that stay deleted.
 *
 * Hydration puts every seed item back, so a deleted seed item returns on
 * reload unless its id is remembered. Domains where a delete must stick (an
 * erased subscriber) record the id in `removed` and read through `liveItems`.
 */

/** A collection without the items listed in its `removed` ids. */
export function liveItems(domain) {
  const { items = [], removed = [] } = getState(domain);
  if (!removed.length) return items;
  const gone = new Set(removed);
  return items.filter((item) => !gone.has(item.id));
}

/** Removes an item from a collection for good, seed item or not. */
export function removeItem(domain, id) {
  return setState(domain, (s) => ({
    ...s,
    items: s.items.filter((item) => item.id !== id),
    removed: [...new Set([...(s.removed ?? []), id])],
  }));
}

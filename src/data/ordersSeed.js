import orders from "./orders.json";

/**
 * Orders, wrapped as a revisioned collection.
 *
 * orders.json is a bare array; the content store needs `{rev, items}`. Wrapping
 * here keeps the fixture file in the shape a real API response would have.
 *
 * Orders go through the store because the dashboard changes their status and a
 * shopper places new ones — both of which previously lived in a module-level
 * `let orders = [...seed]` and vanished on reload.
 */
export default {
  rev: 1,
  items: orders,
};

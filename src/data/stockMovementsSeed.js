/**
 * The stock history: every change to what is on the shelf, with its reason.
 *
 * Starts empty. Each row is `{ id, productId, colorId, size, delta,
 * onHandAfter, reason, orderId, note, by, at }`, where reason is one of
 * received · adjusted · counted · damaged · sold · returned. `colorId` and
 * `size` are "*" for a piece whose stock is one number rather than per colour
 * and size.
 */
export default {
  rev: 1,
  items: [],
};

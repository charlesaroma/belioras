/* Stock Diff */
import { colorwaysOf } from "../products/productColorways";
import { ANY, isTracked, onHandOf } from "./variants";

/**
 * History rows for the stock a product save changed, so the history is
 * complete whether stock moved through Inventory or the product form.
 * `before` is null for a new product, whose stock is its opening count.
 */
export function stockDiff(before, after, { by = null } = {}) {
  const note = before ? "Edited in the product form" : "Opening stock";
  const reason = before ? "adjusted" : "counted";
  const row = (colorId, size, delta, onHandAfter, extra = {}) => ({
    productId: after.id, colorId, size, delta, onHandAfter, reason, note, by, ...extra,
  });

  if (!isTracked(after)) {
    const delta = onHandOf(after) - (before ? onHandOf(before) : 0);
    return delta ? [row(ANY, ANY, delta, onHandOf(after))] : [];
  }

  // A piece counted as one number, now counted per colour and size: one row
  // for the difference rather than a row per cell it was spread across.
  if (before && !isTracked(before)) {
    const delta = onHandOf(after) - onHandOf(before);
    return delta ? [row(ANY, ANY, delta, onHandOf(after), { reason: "counted", note: "Split across colours and sizes" })] : [];
  }

  const cells = new Set();
  for (const p of [before, after].filter(Boolean)) {
    for (const w of colorwaysOf(p)) for (const size of Object.keys(w.stock ?? {})) cells.add(`${w.colorId}|${size}`);
  }
  return [...cells].flatMap((cell) => {
    const [colorId, size] = cell.split("|");
    const now = onHandOf(after, colorId, size);
    const delta = now - (before ? onHandOf(before, colorId, size) : 0);
    return delta ? [row(colorId, size, delta, now)] : [];
  });
}

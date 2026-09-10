/** Pure helpers over the whole navigation tree. */

/** Live product count for one link, matched on the leaf's own slug segment. */
export function countForItem(item, products) {
  if (!products) return null;
  const slug = item.slug?.split("/").pop();
  if (!slug) return null;
  return products.filter((p) => (p.tags ?? []).some((t) => t.endsWith(`:${slug}`))).length;
}

/** Every link across every root, for the summary line. */
export function totalLinks(tree) {
  return tree.reduce(
    (n, root) => n + (root.sections ?? []).reduce((m, s) => m + (s.items ?? []).length, 0),
    0,
  );
}

export function patchRootIn(tree, rootId, patch) {
  return tree.map((r) => (r.id === rootId ? { ...r, ...patch } : r));
}

/** Swap a root with its neighbour, or return the tree unchanged at the ends. */
export function moveRootIn(tree, index, delta) {
  const target = index + delta;
  if (target < 0 || target >= tree.length) return tree;
  const next = [...tree];
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}

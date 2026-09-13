/** Pure helpers over the whole navigation tree. */

/** Live product count for one link, matched on the leaf's own slug segment. */
export function countForItem(item, products) {
  if (!products) return null;

  const slug = item.slug?.split("/").pop();
  if (!slug) return null;
  return products.filter((p) => (p.tags ?? []).some((t) => t.endsWith(`:${slug}`))).length;
}

/**
 * Links that currently lead to an empty page. A shopper following one lands on
 * a grid with nothing in it, which is the most useful thing to flag here.
 * Group links (a whole root) are skipped: they have no slug of their own.
 */
export function emptyLinks(tree, products) {
  if (!products) return [];
  return tree.flatMap((root) =>
    (root.sections ?? []).flatMap((section) =>
      (section.items ?? [])
        .filter((item) => countForItem(item, products) === 0)
        .map((item) => ({ ...item, rootLabel: root.label })),
    ),
  );
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

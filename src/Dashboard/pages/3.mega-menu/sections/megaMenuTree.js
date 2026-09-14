/** Pure helpers over the whole menu tree. */
import { matchesTarget, menuSlug } from "@/utils/menuTargets";

/** How many pieces a target shows, or null while products are loading. */
export function countFor(target, products) {
  if (!products || !target) return null;
  return products.filter((p) => matchesTarget(p, target)).length;
}

/** Links that currently lead to an empty page. */
export function emptyLinks(tree, products) {
  if (!products) return [];
  return tree.flatMap((root) =>
    (root.sections ?? []).flatMap((section) =>
      (section.items ?? [])
        .filter((item) => countFor(item.target, products) === 0)
        .map((item) => ({ ...item, rootLabel: root.label })),
    ),
  );
}

/** Every link across every item, for the summary line. */
export function totalLinks(tree) {
  return tree.reduce(
    (n, root) => n + (root.sections ?? []).reduce((m, s) => m + (s.items ?? []).length, 0),
    0,
  );
}

export function patchRootIn(tree, rootId, patch) {
  return tree.map((r) => (r.id === rootId ? { ...r, ...patch } : r));
}

export function removeRootIn(tree, rootId) {
  return tree.filter((r) => r.id !== rootId);
}

/** Swap an item with its neighbour, or return the tree unchanged at the ends. */
export function moveRootIn(tree, index, delta) {
  const target = index + delta;
  if (target < 0 || target >= tree.length) return tree;

  const next = [...tree];
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}

/** A new top-level item. Its address comes from its name and never takes one the shop uses. */
export function addRootIn(tree, { label, target }) {
  const slug = menuSlug(label, new Set(tree.map((r) => r.slug)), { reserved: true });
  const root = {
    id: `menu-${slug}-${Date.now().toString(36)}`,
    label,
    slug,
    url: `/${slug}`,
    target,
    sections: [],
    tiles: [],
  };
  return [...tree, root];
}

/** A new link under an item, addressed /item/link-name, unique across the menu. */
export function newLeaf(tree, root, { label, target }) {
  const prefix = `${root.slug}/`;
  const taken = new Set(
    tree.flatMap((r) => (r.sections ?? []).flatMap((s) => s.items.map((i) => i.slug)))
      .filter((slug) => slug?.startsWith(prefix))
      .map((slug) => slug.slice(prefix.length)),
  );
  const segment = menuSlug(label, taken);
  return {
    id: `${root.id}-${segment}-${Date.now().toString(36)}`,
    label,
    slug: `${root.slug}/${segment}`,
    url: `/${root.slug}/${segment}`,
    target,
  };
}

/** Every page in the menu, for choosing where a feature tile links. */
export function menuPages(tree) {
  return tree.flatMap((root) => [
    { id: root.id, name: root.label, context: "Menu item", url: root.url, target: root.target },
    ...(root.sections ?? []).flatMap((section) =>
      section.items.map((item) => ({
        id: item.id,
        name: item.label,
        context: `${root.label} › ${section.title}`,
        url: item.url,
        target: item.target,
      })),
    ),
  ]);
}

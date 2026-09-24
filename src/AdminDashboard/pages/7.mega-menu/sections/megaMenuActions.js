/* Mega Menu Picker Results */
import { addRootIn, newLeaf, patchRootIn } from "./megaMenuTree";

/**
 * Applies what a picker returned to the menu draft.
 *
 * `request` says what was being picked for: a new or existing menu item, a new
 * or existing link in a column, or a new or existing tile. Returns the next
 * tree, and the id of a newly added item so the page can open it.
 */
export function applyPick(tree, request, result) {
  const { mode, rootId, sectionId, itemId, tileId } = request ?? {};

  if (mode === "item" && !rootId) {
    const next = addRootIn(tree, result);
    return { tree: next, openRoot: next.at(-1).id };
  }

  const root = tree.find((r) => r.id === rootId);
  if (!root) return { tree };

  if (mode === "item") {
    const renamed = result.label !== root.label ? { label: result.label, i18nKey: undefined } : {};
    return { tree: patchRootIn(tree, rootId, { target: result.target, ...renamed }) };
  }

  if (mode === "link") {
    const sections = (root.sections ?? []).map((section) => {
      if (section.id !== sectionId) return section;
      const items = itemId
        ? section.items.map((i) => (i.id === itemId ? { ...i, label: result.label, target: result.target } : i))
        : [...section.items, newLeaf(tree, root, section, result)];
      return { ...section, items };
    });
    return { tree: patchRootIn(tree, rootId, { sections }) };
  }

  if (mode === "tile") {
    const chosen = { title: result.title, target: result.target, url: result.url };
    const tiles = tileId
      ? (root.tiles ?? []).map((t) => (t.id === tileId ? { ...t, ...chosen } : t))
      : [...(root.tiles ?? []), { id: `${root.id}-tile-${Date.now().toString(36)}`, image: null, ...chosen }];
    return { tree: patchRootIn(tree, rootId, { tiles }) };
  }

  return { tree };
}

/**
 * The edits one menu root supports, as pure functions over its sections.
 *
 * Each returns the patch to hand back up, so the component stays declarative
 * and the reordering arithmetic is testable on its own.
 */

export function makeRootEditor(root, onPatch) {

  const sections = root.sections ?? [];

  const patchSection = (sectionId, patch) =>
    onPatch({ sections: sections.map((s) => (s.id === sectionId ? { ...s, ...patch } : s)) });

  const sectionById = (id) => sections.find((s) => s.id === id);

  return {
    patchSection,

    patchItem: (sectionId, itemId, patch) =>
      patchSection(sectionId, {
        items: sectionById(sectionId).items.map((i) => (i.id === itemId ? { ...i, ...patch } : i)),
      }),

    /** Arrows rather than drag: they work by keyboard and on a phone. */
    moveItem: (sectionId, index, delta) => {

      const section = sectionById(sectionId);

      const target = index + delta;
      if (target < 0 || target >= section.items.length) return;

      const items = [...section.items];
      [items[index], items[target]] = [items[target], items[index]];
      patchSection(sectionId, { items });
    },

    removeItem: (sectionId, itemId) =>
      patchSection(sectionId, {
        items: sectionById(sectionId).items.filter((i) => i.id !== itemId),
      }),

    addItem: (sectionId) => {

      const section = sectionById(sectionId);

      const id = `${sectionId}-new-${Date.now().toString(36)}`;
      patchSection(sectionId, {
        items: [...section.items, { id, label: "New link", slug: "", url: root.url }],
      });
    },

    patchTile: (tileId, patch) =>
      onPatch({ tiles: root.tiles.map((t) => (t.id === tileId ? { ...t, ...patch } : t)) }),
  };
}

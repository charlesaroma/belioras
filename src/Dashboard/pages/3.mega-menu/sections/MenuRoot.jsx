import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";

import { cn } from "../../../../utils/cn";
import IconButton from "./IconButton";

/**
 * One top-level menu — Shop, Dresses, Hair — with its sections and links.
 *
 * Collapsed by default. Shop alone carries five sections and forty links;
 * showing every root expanded would be a wall of inputs rather than a menu you
 * can reason about.
 *
 * Reordering is arrows rather than drag-and-drop. Arrows work by keyboard and
 * on a phone, and a menu is a short list — the drag affordance would cost more
 * than it saves here.
 */
export default function MenuRoot({ root, open, onToggle, onPatch, countFor, controls }) {
  const sections = root.sections ?? [];

  const patchSection = (sectionId, patch) =>
    onPatch({
      sections: sections.map((s) => (s.id === sectionId ? { ...s, ...patch } : s)),
    });

  const patchItem = (sectionId, itemId, patch) => {
    const section = sections.find((s) => s.id === sectionId);
    patchSection(sectionId, {
      items: section.items.map((i) => (i.id === itemId ? { ...i, ...patch } : i)),
    });
  };

  const moveItem = (sectionId, index, delta) => {
    const section = sections.find((s) => s.id === sectionId);
    const target = index + delta;
    if (target < 0 || target >= section.items.length) return;
    const items = [...section.items];
    [items[index], items[target]] = [items[target], items[index]];
    patchSection(sectionId, { items });
  };

  const removeItem = (sectionId, itemId) => {
    const section = sections.find((s) => s.id === sectionId);
    patchSection(sectionId, { items: section.items.filter((i) => i.id !== itemId) });
  };

  const addItem = (sectionId) => {
    const section = sections.find((s) => s.id === sectionId);
    const id = `${sectionId}-new-${Date.now().toString(36)}`;
    patchSection(sectionId, {
      items: [...section.items, { id, label: "New link", slug: "", url: root.url }],
    });
  };

  const linkCount = sections.reduce((n, s) => n + (s.items ?? []).length, 0);

  return (
    <div className="border border-umber-50 bg-ivory-50">
      <div className="flex items-center gap-2 px-4 py-3">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          className="flex min-w-0 flex-1 items-center gap-3 text-left"
        >
          <ChevronDown
            className={cn(
              "size-4 shrink-0 text-espresso/40 transition-transform",
              open && "rotate-180",
            )}
            aria-hidden="true"
          />
          <span className="truncate font-display text-lg tracking-wide text-espresso">
            {root.label}
          </span>
          <span className="shrink-0 text-[11px] text-espresso-soft">
            {sections.length} {sections.length === 1 ? "section" : "sections"} · {linkCount} links
          </span>
          <code className="ml-auto hidden shrink-0 text-[11px] text-espresso-soft sm:block">
            {root.url}
          </code>
        </button>

        <div className="flex shrink-0 items-center gap-1">{controls}</div>
      </div>

      {open && (
        <div className="space-y-5 border-t border-umber-50 px-4 py-5">
          <label className="block">
            <span className="input-label">Menu label</span>
            <input
              value={root.label}
              onChange={(e) => onPatch({ label: e.target.value })}
              className="input max-w-xs"
            />
          </label>

          {sections.map((section) => (
            <section key={section.id} className="border border-umber-50 p-4">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <input
                  value={section.title}
                  onChange={(e) => patchSection(section.id, { title: e.target.value })}
                  aria-label={`Section heading for ${section.title}`}
                  className="input max-w-xs py-1.5 text-[13px] font-medium"
                />
                <button
                  type="button"
                  onClick={() => addItem(section.id)}
                  className="ml-auto inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.14em] text-gold-700 transition-opacity hover:opacity-70"
                >
                  <Plus className="size-3.5" aria-hidden="true" />
                  Add link
                </button>
              </div>

              <ul className="space-y-1.5">
                {(section.items ?? []).map((item, i) => {
                  const count = countFor(item);
                  return (
                    <li
                      key={item.id}
                      className="flex flex-wrap items-center gap-2 border-b border-umber-50/60 pb-2 last:border-b-0 sm:border-b-0 sm:pb-0"
                    >
                      {/* Full width on a phone, side by side from sm. The two
                          inputs previously shared a row with ~148px of
                          controls in 271px of space, so the path collapsed. */}
                      <input
                        value={item.label}
                        onChange={(e) => patchItem(section.id, item.id, { label: e.target.value })}
                        aria-label="Link label"
                        className="input w-full py-1.5 text-[13px] sm:w-44"
                      />
                      <input
                        value={item.url ?? ""}
                        onChange={(e) => patchItem(section.id, item.id, { url: e.target.value })}
                        aria-label="Link path"
                        placeholder="/dresses/mini"
                        className="input w-full min-w-0 py-1.5 font-mono text-[12px] sm:w-auto sm:flex-1"
                      />

                      {/* A link returning nothing is a dead end a shopper finds
                          by walking into it; better it is visible here. */}
                      <span
                        className={cn(
                          "w-16 shrink-0 text-[11px] tabular-nums sm:text-right",
                          count === 0 ? "text-error" : "text-espresso-soft",
                        )}
                        title={count === null ? "" : `${count} pieces match this link`}
                      >
                        {count === null ? "—" : `${count} pcs`}
                      </span>

                      <IconButton
                        label="Move up"
                        icon={ChevronUp}
                        disabled={i === 0}
                        onClick={() => moveItem(section.id, i, -1)}
                      />
                      <IconButton
                        label="Move down"
                        icon={ChevronDown}
                        disabled={i === section.items.length - 1}
                        onClick={() => moveItem(section.id, i, 1)}
                      />
                      <IconButton
                        label={`Remove ${item.label}`}
                        icon={Trash2}
                        destructive
                        onClick={() => removeItem(section.id, item.id)}
                      />
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}

          {(root.tiles ?? []).length > 0 && (
            <section className="border border-umber-50 p-4">
              <p className="input-label">Feature tiles</p>
              <ul className="grid gap-3 sm:grid-cols-2">
                {root.tiles.map((tile) => (
                  <li key={tile.id} className="flex gap-3">
                    <img
                      src={tile.image}
                      alt=""
                      className="size-16 shrink-0 border border-umber-50 object-cover"
                    />
                    <div className="min-w-0 flex-1 space-y-1.5">
                      <input
                        value={tile.title}
                        onChange={(e) =>
                          onPatch({
                            tiles: root.tiles.map((t) =>
                              t.id === tile.id ? { ...t, title: e.target.value } : t,
                            ),
                          })
                        }
                        aria-label="Tile title"
                        className="input w-full py-1.5 text-[13px]"
                      />
                      <input
                        value={tile.url}
                        onChange={(e) =>
                          onPatch({
                            tiles: root.tiles.map((t) =>
                              t.id === tile.id ? { ...t, url: e.target.value } : t,
                            ),
                          })
                        }
                        aria-label="Tile path"
                        className="input w-full py-1.5 font-mono text-[12px]"
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      )}
    </div>
  );
}

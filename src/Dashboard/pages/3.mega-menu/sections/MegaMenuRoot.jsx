/* Admin Dashboard Page: Mega-menu - MegaMenuRoot */
import { ChevronDown, Plus } from "lucide-react";

import { cn } from "../../../../utils/cn";
import { makeRootEditor } from "./megaMenuEdits";
import MenuLinkRow from "./MegaMenuLinkRow";
import MenuTiles from "./MegaMenuTiles";

export default function MenuRoot({ root, open, onToggle, onPatch, countFor, controls }) {
  const sections = root.sections ?? [];
  const editor = makeRootEditor(root, onPatch);
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
                  onChange={(e) => editor.patchSection(section.id, { title: e.target.value })}
                  aria-label={`Section heading for ${section.title}`}
                  className="input max-w-xs py-1.5 text-[13px] font-medium"
                />
                <button
                  type="button"
                  onClick={() => editor.addItem(section.id)}
                  className="ml-auto inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.14em] text-gold-700 transition-opacity hover:opacity-70"
                >
                  <Plus className="size-3.5" aria-hidden="true" />
                  Add link
                </button>
              </div>

              <ul className="space-y-1.5">
                {(section.items ?? []).map((item, i) => (
                  <MenuLinkRow
                    key={item.id}
                    item={item}
                    index={i}
                    lastIndex={section.items.length - 1}
                    count={countFor(item)}
                    editor={editor}
                    sectionId={section.id}
                  />
                ))}
              </ul>
            </section>
          ))}

          <MenuTiles tiles={root.tiles} editor={editor} />
        </div>
      )}
    </div>
  );
}

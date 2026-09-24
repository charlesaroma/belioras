/* Admin Dashboard Page: Mega-menu - MegaMenuItemEditor */
import { Plus } from "lucide-react";

import MegaMenuPanel from "@/components/layout/navbar/MegaMenuPanel";
import Field from "@/components/ui/Field";
import { describeTarget } from "@/utils/menuTargetText";
import { useDragReorder } from "../../../lib/useDragReorder";
import MegaMenuColumn from "./MegaMenuColumn";
import MegaMenuTiles from "./MegaMenuTiles";

/** Everything about one menu item: its name, what it shows, its columns and tiles. */
export default function MegaMenuItemEditor({ root, editor, lookups, onPick }) {
  const sections = root.sections ?? [];
  const columns = useDragReorder(editor.reorderSections);

  return (
    <div className="space-y-6 border-t border-umber-50 px-4 py-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name in the menu" required>
          <input value={root.label} onChange={(e) => editor.rename(e.target.value)} />
        </Field>

        <div>
          <p className="input-label">Shows</p>
          <div className="flex min-h-12 items-center justify-between gap-3 border border-umber-100 bg-white px-4">
            <span className="min-w-0 truncate text-[14px] text-espresso">{describeTarget(root.target, lookups)}</span>
            <button
              type="button"
              onClick={() => onPick({ mode: "item", rootId: root.id, initial: root })}
              className="shrink-0 text-[11px] uppercase tracking-[0.14em] text-gold-700 transition-colors hover:text-espresso"
            >
              Change
            </button>
          </div>
          <p className="input-helper mt-1.5 text-espresso-soft">
            Its page is <code>{root.url}</code>, which stays the same if you rename it.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <div>
            <p className="input-label mb-0">Dropdown columns</p>
            <p className="text-[12px] text-espresso-soft">Each column is a heading with links under it.</p>
          </div>
          <button
            type="button"
            onClick={editor.addSection}
            className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.14em] text-gold-700 transition-colors hover:text-espresso"
          >
            <Plus className="size-3.5" aria-hidden="true" />
            Add column
          </button>
        </div>

        {sections.length === 0 ? (
          <p className="border border-dashed border-umber-100 px-4 py-4 text-[13px] text-espresso-soft">
            No columns, so this item goes straight to its page. Add a column to give it a dropdown.
          </p>
        ) : (
          <div className="grid gap-3 xl:grid-cols-2">
            {sections.map((section, i) => (
              <MegaMenuColumn
                key={section.id}
                root={root}
                section={section}
                index={i}
                total={sections.length}
                editor={editor}
                lookups={lookups}
                onPick={onPick}
                drag={columns}
              />
            ))}
          </div>
        )}
      </div>

      <MegaMenuTiles root={root} editor={editor} lookups={lookups} onPick={onPick} />

      {(sections.length > 0 || (root.tiles ?? []).length > 0) && (
        <div className="space-y-2">
          <p className="input-label mb-0">Preview</p>
          <p className="text-[12px] text-espresso-soft">How this dropdown looks in the shop right now, including your unsaved changes.</p>
          {/* Links here are for looking at: clicking one must not leave the dashboard. */}
          <div
            onClickCapture={(e) => {
              if (e.target.closest("a")) e.preventDefault();
            }}
            className="overflow-hidden border border-umber-100 bg-ivory-50"
          >
            <MegaMenuPanel item={root} onNavigate={() => {}} />
          </div>
        </div>
      )}
    </div>
  );
}

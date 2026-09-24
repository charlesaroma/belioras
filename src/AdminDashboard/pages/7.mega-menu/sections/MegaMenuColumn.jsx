/* Admin Dashboard Page: Mega-menu - MegaMenuColumn */
import { useState } from "react";
import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";

import ConfirmDialog from "../../../../components/ui/ConfirmDialog";
import IconAction from "../../../components/IconAction";
import MegaMenuLinkRow from "./MegaMenuLinkRow";

/** One column of the dropdown: a heading and its links. */
export default function MegaMenuColumn({ root, section, index, total, editor, lookups, onPick }) {
  const [asking, setAsking] = useState(false);
  // An empty column goes at once; one holding links asks first.
  const removeColumn = () => (section.items.length ? setAsking(true) : editor.removeSection(section.id));

  return (
    <section className="border border-umber-50 bg-white">
      <div className="flex items-center gap-1 border-b border-umber-50 px-3 py-2">
        <input
          value={section.title}
          onChange={(e) => editor.patchSection(section.id, { title: e.target.value })}
          aria-label="Column heading"
          placeholder="Column heading"
          className="input h-9 min-w-0 flex-1 py-1.5 text-[13px] font-medium"
        />
        <IconAction label={`Move ${section.title} earlier`} icon={ChevronUp} disabled={index === 0} onClick={() => editor.moveSection(index, -1)} />
        <IconAction label={`Move ${section.title} later`} icon={ChevronDown} disabled={index === total - 1} onClick={() => editor.moveSection(index, 1)} />
        <IconAction label={`Remove column ${section.title}`} icon={Trash2} destructive onClick={removeColumn} />
      </div>

      {section.items.length > 0 ? (
        <ul className="divide-y divide-umber-50/70 px-3">
          {section.items.map((item, i) => (
            <MegaMenuLinkRow
              key={item.id}
              root={root}
              sectionId={section.id}
              item={item}
              index={i}
              lastIndex={section.items.length - 1}
              editor={editor}
              lookups={lookups}
              onPick={onPick}
            />
          ))}
        </ul>
      ) : (
        <p className="px-3 py-3 text-[13px] text-espresso-soft">No links yet.</p>
      )}

      <div className="border-t border-umber-50/70 px-3 py-2.5">
        <button
          type="button"
          onClick={() => onPick({ mode: "link", rootId: root.id, sectionId: section.id })}
          className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.14em] text-gold-700 transition-colors hover:text-espresso"
        >
          <Plus className="size-3.5" aria-hidden="true" />
          Add link
        </button>
      </div>
      <ConfirmDialog
        open={asking}
        onClose={() => setAsking(false)}
        onConfirm={() => {
          setAsking(false);
          editor.removeSection(section.id);
        }}
        title={`Remove ${section.title || "this column"}?`}
        description={`The column and its ${section.items.length} ${section.items.length === 1 ? "link" : "links"} leave the menu when you save. Nothing changes on the site until then.`}
        confirmLabel="Remove column"
      />
    </section>
  );
}

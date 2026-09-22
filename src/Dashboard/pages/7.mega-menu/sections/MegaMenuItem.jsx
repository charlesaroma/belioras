/* Admin Dashboard Page: Mega-menu - MegaMenuItem */
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";

import { cn } from "@/utils/cn";
import { describeTarget } from "@/utils/menuTargetText";
import IconAction from "../../../components/IconAction";
import MegaMenuItemEditor from "./MegaMenuItemEditor";
import { piecesText } from "./megaMenuPickerOptions";
import { countFor } from "./megaMenuTree";

/** One top-level menu item: a summary row that opens into its editor. */
export default function MegaMenuItem({ root, index, total, open, onToggle, onMove, onRemove, editor, lookups, onPick }) {
  const sections = root.sections ?? [];
  const links = sections.reduce((n, s) => n + s.items.length, 0);
  const shape = links
    ? `${sections.length} ${sections.length === 1 ? "column" : "columns"}, ${links} ${links === 1 ? "link" : "links"}`
    : "No dropdown";

  return (
    <div className={cn("border bg-ivory-50 transition-colors", open ? "border-espresso/30" : "border-umber-50")}>
      <div className="flex items-center gap-2 px-4 py-3">
        <button type="button" onClick={onToggle} aria-expanded={open} className="flex min-w-0 flex-1 items-center gap-3 text-left">
          <ChevronDown className={cn("size-4 shrink-0 text-espresso/40 transition-transform", open && "rotate-180")} aria-hidden="true" />
          <span className="min-w-0">
            <span className="block truncate font-display text-lg tracking-wide text-espresso">{root.label}</span>
            <span className="block truncate text-[12px] text-espresso-soft">
              {describeTarget(root.target, lookups)} · {shape}
            </span>
          </span>
          <span className="ml-auto hidden shrink-0 text-[11px] tabular-nums text-espresso-soft sm:block">
            {piecesText(countFor(root.target, lookups.products))}
          </span>
        </button>

        <div className="flex shrink-0 items-center">
          <IconAction label={`Move ${root.label} earlier`} icon={ChevronUp} disabled={index === 0} onClick={() => onMove(-1)} />
          <IconAction label={`Move ${root.label} later`} icon={ChevronDown} disabled={index === total - 1} onClick={() => onMove(1)} />
          <IconAction label={`Remove ${root.label}`} icon={Trash2} destructive onClick={onRemove} />
        </div>
      </div>

      {open && <MegaMenuItemEditor root={root} editor={editor} lookups={lookups} onPick={onPick} />}
    </div>
  );
}

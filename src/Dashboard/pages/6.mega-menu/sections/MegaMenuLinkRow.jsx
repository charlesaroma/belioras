/* Admin Dashboard Page: Mega-menu - MegaMenuLinkRow */
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";

import { cn } from "@/utils/cn";
import { describeTarget } from "@/utils/menuTargetText";
import IconAction from "../../../components/IconAction";
import { piecesText } from "./megaMenuPickerOptions";
import { countFor } from "./megaMenuTree";

/** One link: its name, what it shows (click to change), and how many pieces that is. */
export default function MegaMenuLinkRow({ root, sectionId, item, index, lastIndex, editor, lookups, onPick }) {
  const count = countFor(item.target, lookups.products);

  return (
    <li className="flex flex-wrap items-center gap-x-3 gap-y-1.5 py-2.5">
      <input
        value={item.label}
        onChange={(e) => editor.patchItem(sectionId, item.id, { label: e.target.value })}
        aria-label="Link name"
        className="input h-9 w-full py-1.5 text-[13px] sm:w-48"
      />

      <button
        type="button"
        onClick={() => onPick({ mode: "link", rootId: root.id, sectionId, itemId: item.id, initial: item })}
        title="Change what this link shows"
        className="min-w-0 flex-1 text-left text-[12px] leading-snug text-espresso-soft transition-colors hover:text-espresso"
      >
        <span className="block truncate">{describeTarget(item.target, lookups)}</span>
        <span className={cn("block tabular-nums", count === 0 && "text-error")}>
          {piecesText(count)}
          <span className="ml-2 text-gold-700">Change</span>
        </span>
      </button>

      <div className="flex shrink-0 items-center">
        <IconAction label={`Move ${item.label} up`} icon={ChevronUp} disabled={index === 0} onClick={() => editor.moveItem(sectionId, index, -1)} />
        <IconAction label={`Move ${item.label} down`} icon={ChevronDown} disabled={index === lastIndex} onClick={() => editor.moveItem(sectionId, index, 1)} />
        <IconAction label={`Remove ${item.label}`} icon={Trash2} destructive onClick={() => editor.removeItem(sectionId, item.id)} />
      </div>
    </li>
  );
}

import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";

import { cn } from "../../../../utils/cn";
import IconAction from "../../../components/IconAction";

/** One link: its label, its path, how many pieces it returns, and its controls. */
export default function MenuLinkRow({ item, index, lastIndex, count, editor, sectionId }) {
  return (
    <li className="flex flex-wrap items-center gap-2 border-b border-umber-50/60 pb-2 last:border-b-0 sm:border-b-0 sm:pb-0">
      {/* Full width on a phone, side by side from sm. The two inputs previously
          shared a row with ~148px of controls in 271px of space, so the path
          collapsed. */}
      <input
        value={item.label}
        onChange={(e) => editor.patchItem(sectionId, item.id, { label: e.target.value })}
        aria-label="Link label"
        className="input w-full py-1.5 text-[13px] sm:w-44"
      />
      <input
        value={item.url ?? ""}
        onChange={(e) => editor.patchItem(sectionId, item.id, { url: e.target.value })}
        aria-label="Link path"
        placeholder="/dresses/mini"
        className="input w-full min-w-0 py-1.5 font-mono text-[12px] sm:w-auto sm:flex-1"
      />

      {/* A link returning nothing is a dead end a shopper finds by walking into
          it; better it is visible here. */}
      <span
        className={cn(
          "w-16 shrink-0 text-[11px] tabular-nums sm:text-right",
          count === 0 ? "text-error" : "text-espresso-soft",
        )}
        title={count === null ? "" : `${count} pieces match this link`}
      >
        {count === null ? "—" : `${count} pcs`}
      </span>

      <IconAction
        label="Move up"
        icon={ChevronUp}
        disabled={index === 0}
        onClick={() => editor.moveItem(sectionId, index, -1)}
      />
      <IconAction
        label="Move down"
        icon={ChevronDown}
        disabled={index === lastIndex}
        onClick={() => editor.moveItem(sectionId, index, 1)}
      />
      <IconAction
        label={`Remove ${item.label}`}
        icon={Trash2}
        destructive
        onClick={() => editor.removeItem(sectionId, item.id)}
      />
    </li>
  );
}

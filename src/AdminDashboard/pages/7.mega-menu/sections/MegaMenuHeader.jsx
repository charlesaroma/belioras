/* Admin Dashboard Page: Mega-menu - MegaMenuHeader */
import { Plus, RotateCcw, Save } from "lucide-react";

import Button from "@/components/ui/Button";

/** The summary line, the page actions, and a note on links with nothing in them yet. */
export default function MegaMenuHeader({ itemCount, linkCount, dirty, saving, empty, onRestore, onAdd, onSave }) {
  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-[12px] text-espresso-soft">
          {itemCount} menu items · {linkCount} links
          {dirty && <span className="ml-2 text-gold-700">· unsaved changes</span>}
        </p>
        <div className="flex flex-wrap gap-2">
          <Button variant="ghost" icon={RotateCcw} onClick={onRestore}>
            Restore original
          </Button>
          <Button variant="secondary" icon={Plus} onClick={onAdd}>
            Add menu item
          </Button>
          <Button icon={Save} onClick={onSave} loading={saving} disabled={!dirty}>
            Save menu
          </Button>
        </div>
      </div>

      {empty.length > 0 && (
        <p className="border-l-2 border-gold-500 py-2 pl-4 text-[12px] leading-relaxed text-espresso-soft">
          <strong className="font-medium text-espresso">
            {empty.length} {empty.length === 1 ? "link has" : "links have"} no pieces yet
          </strong>
          {": "}
          {empty.slice(0, 6).map((item) => `${item.rootLabel} › ${item.label}`).join(", ")}
          {empty.length > 6 && `, and ${empty.length - 6} more`}. They fill as you add products, or you can remove them.
        </p>
      )}
    </>
  );
}

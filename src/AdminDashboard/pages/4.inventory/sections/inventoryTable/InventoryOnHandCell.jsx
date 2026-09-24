/* Admin Dashboard Page: Inventory - InventoryOnHandCell */
import { useState } from "react";

import { useToast } from "@/context/ToastContext";
import { adjustStock } from "@/services/catalog/inventory/inventoryApi";

/**
 * The on-hand count, editable where it sits: click it, type what is on the
 * shelf and press Enter. Saved as a stock count, so the history says so.
 */
export default function InventoryOnHandCell({ row, by, onSaved }) {
  const { toast } = useToast();
  const [draft, setDraft] = useState(null);

  const commit = async () => {
    const next = draft;
    setDraft(null);
    if (next === null || next === "" || Number(next) === row.onHand) return;
    try {
      await adjustStock({ productId: row.productId, colorId: row.colorId, size: row.size, mode: "set", quantity: next, reason: "counted", by });
      toast(`${row.name}: ${Math.floor(Number(next))} on hand.`, "success");
      onSaved?.();
    } catch (err) {
      toast(err.message ?? "Could not change that stock.", "error");
    }
  };

  if (draft === null) {
    return (
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setDraft(String(row.onHand));
        }}
        title="Click to change the count"
        aria-label={`${row.name}: ${row.onHand} on hand. Change the count`}
        className="min-w-10 border border-transparent px-2 py-1 text-right tabular-nums text-espresso transition-colors hover:border-umber-100 hover:bg-ivory-50"
      >
        {row.onHand}
      </button>
    );
  }
  return (
    <input
      autoFocus
      type="number"
      min="0"
      step="1"
      value={draft}
      aria-label={`On hand for ${row.name}`}
      onClick={(e) => e.stopPropagation()}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => {
        if (e.key === "Enter") e.currentTarget.blur();
        if (e.key === "Escape") setDraft(null);
      }}
      className="input h-9 w-20 py-1 text-right tabular-nums"
    />
  );
}


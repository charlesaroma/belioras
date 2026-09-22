/* Admin Dashboard Page: Inventory - InventoryHistoryDialog */
import { History } from "lucide-react";

import Modal from "@/components/common/Modal";
import { useAsyncData } from "@/hooks/useAsyncData";
import { REASONS, getStockHistory } from "@/services/catalog/inventory/inventoryApi";
import { cn } from "@/utils/cn";
import { variantLabel } from "./inventoryRows";

/** Every change to one variant's stock, newest first. Remount with a `key` per variant. */
export default function InventoryHistoryDialog({ row, taxonomy, dateFmt, onClose }) {
  const { data: moves, loading } = useAsyncData(
    () => (row ? getStockHistory(row.productId, row.colorId, row.size) : Promise.resolve([])),
    [row?.id],
  );

  return (
    <Modal open={Boolean(row)} onClose={onClose} title="Stock history" width="max-w-xl">
      {row && (
        <div className="space-y-5">
          <div className="flex items-baseline justify-between gap-4">
            <div className="min-w-0">
              <p className="truncate font-medium text-espresso">{row.name}</p>
              <p className="text-[12px] text-espresso-soft">{variantLabel(row, taxonomy)}</p>
            </div>
            <p className="shrink-0 text-[12px] text-espresso-soft">
              <span className="font-display text-xl tabular-nums text-espresso">{row.onHand}</span> on hand
            </p>
          </div>

          {loading ? (
            <p className="text-[13px] text-espresso-soft">Loading…</p>
          ) : !moves?.length ? (
            <div className="flex flex-col items-center gap-2 border border-dashed border-umber-100 px-6 py-10 text-center">
              <History className="size-5 text-espresso/30" aria-hidden="true" />
              <p className="text-[13px] text-espresso">No changes recorded yet</p>
              <p className="max-w-xs text-[12px] text-espresso-soft">
                Stock received, adjusted, shipped or returned from now on is listed here.
              </p>
            </div>
          ) : (
            <ol className="max-h-[55vh] divide-y divide-umber-50 overflow-y-auto border border-umber-50">
              {moves.map((m) => (
                <li key={m.id} className="flex items-start justify-between gap-4 px-4 py-3 text-[13px]">
                  <div className="min-w-0">
                    <p className="text-espresso">
                      {REASONS[m.reason] ?? m.reason}
                      {m.orderId && <span className="text-espresso-soft"> · {m.orderId}</span>}
                    </p>
                    <p className="text-[12px] text-espresso-soft">
                      {dateFmt.format(new Date(m.at))}
                      {m.by && ` · ${m.by}`}
                      {m.note && ` · ${m.note}`}
                    </p>
                  </div>
                  <div className="shrink-0 text-right tabular-nums">
                    <p className={cn("font-medium", m.delta > 0 ? "text-success" : "text-error")}>
                      {m.delta > 0 ? `+${m.delta}` : m.delta}
                    </p>
                    <p className="text-[11px] text-espresso-soft">{m.onHandAfter} after</p>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </div>
      )}
    </Modal>
  );
}

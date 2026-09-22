/* Admin Dashboard Page: Inventory - inventoryTableColumns */
import { History, Package, SlidersHorizontal } from "lucide-react";

import StatusChip from "@/components/ui/StatusChip";
import IconAction from "@/Dashboard/components/IconAction";
import { cn } from "@/utils/cn";
import { ANY, variantLabel } from "../inventoryRows";

const NUMBER = { meta: { align: "right" } };
const count = (className) => ({ getValue }) => <span className={cn("tabular-nums", className)}>{getValue()}</span>;

export function buildInventoryColumns({ taxonomy, onAdjust, onHistory }) {
  return [
    {
      // Name, colour and size in one value, so search finds "Aurora champagne".
      id: "name",
      accessorFn: (r) => `${r.name} ${r.colorName ?? ""} ${r.size === ANY ? "" : r.size}`,
      header: "Piece",
      cell: ({ row }) => {
        const r = row.original;
        return (
          <div className="flex items-center gap-3">
            {r.image ? (
              <img src={r.image} alt="" loading="lazy" className="size-10 shrink-0 border border-umber-50 object-cover" />
            ) : (
              <span className="flex size-10 shrink-0 items-center justify-center border border-umber-50 text-espresso/30">
                <Package className="size-4" aria-hidden="true" />
              </span>
            )}
            <div className="min-w-0">
              <p className="truncate font-medium text-espresso">{r.name}</p>
              <p className="flex items-center gap-1.5 truncate text-[12px] text-espresso-soft">
                {r.colorId !== ANY && (
                  <span aria-hidden="true" className="size-2.5 shrink-0 border border-umber-100" style={{ backgroundColor: r.hex ?? "#ccc" }} />
                )}
                {variantLabel(r, taxonomy)}
              </p>
            </div>
          </div>
        );
      },
    },
    { accessorKey: "onHand", header: "On hand", ...NUMBER, cell: count("text-espresso") },
    { accessorKey: "reserved", header: "In open orders", ...NUMBER, cell: count("text-espresso-soft") },
    {
      accessorKey: "available",
      header: "Available",
      ...NUMBER,
      cell: ({ row, getValue }) => (
        <span className={cn("font-medium tabular-nums", row.original.level === "out" ? "text-error" : row.original.level === "low" ? "text-warning" : "text-espresso")}>
          {getValue()}
        </span>
      ),
    },
    { accessorKey: "level", header: "Status", cell: ({ getValue }) => <StatusChip status={getValue()} kind="stock" /> },
    {
      id: "actions",
      header: "",
      enableSorting: false,
      meta: { align: "right" },
      cell: ({ row }) => (
        <div className="flex justify-end gap-1" onClick={(e) => e.stopPropagation()}>
          <IconAction label={`Adjust stock of ${row.original.name}`} icon={SlidersHorizontal} onClick={() => onAdjust(row.original)} />
          <IconAction label={`Stock history of ${row.original.name}`} icon={History} onClick={() => onHistory(row.original)} />
        </div>
      ),
    },
  ];
}

/* Admin Dashboard Page: Categories - coloursColumns */
import { Pencil, Trash2 } from "lucide-react";

import IconAction from "@/Dashboard/components/IconAction";

export function buildColourColumns({ familyById, usage, onEdit, onDelete }) {
  return [
    {
      accessorKey: "name",
      header: "Colour",
      cell: ({ row: r }) => (
        <span className="inline-flex items-center gap-3">
          <span aria-hidden="true" className="size-6 border border-umber-100" style={{ backgroundColor: r.original.hex }} />
          <span className="font-medium text-espresso">{r.original.name}</span>
          <code className="text-[11px] text-espresso-soft">{r.original.hex}</code>
        </span>
      ),
    },
    {
      id: "family",
      accessorFn: (c) => familyById.get(c.family)?.name ?? c.family,
      header: "Shop filter",
      cell: ({ row: r, getValue }) => (
        <span className="inline-flex items-center gap-2">
          <span aria-hidden="true" className="size-2.5 border border-umber-50" style={{ backgroundColor: familyById.get(r.original.family)?.hex }} />
          {getValue()}
        </span>
      ),
    },
    {
      id: "products",
      accessorFn: (c) => usage?.[c.id] ?? 0,
      header: "Products",
      meta: { align: "right" },
      cell: ({ getValue }) => <span className="tabular-nums">{getValue()}</span>,
    },
    {
      id: "actions",
      header: "",
      enableSorting: false,
      meta: { align: "right" },
      cell: ({ row: r }) => (
        <div className="flex justify-end gap-1">
          <IconAction label={`Edit ${r.original.name}`} icon={Pencil} onClick={() => onEdit(r.original)} />
          <IconAction label={`Delete ${r.original.name}`} icon={Trash2} destructive onClick={() => onDelete(r.original)} />
        </div>
      ),
    },
  ];
}

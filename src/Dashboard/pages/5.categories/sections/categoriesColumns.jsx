/* Admin Dashboard Page: Categories - categoriesColumns */
import { Pencil, Trash2 } from "lucide-react";

import IconAction from "@/Dashboard/components/IconAction";
import { sizeLabel } from "@/Dashboard/lib/catalogOptions";

export function buildCategoryColumns({ taxonomy, usage, onEdit, onDelete }) {
  return [
    {
      accessorKey: "name",
      header: "Category",
      cell: ({ row: r }) => <span className="font-medium text-espresso">{r.original.name}</span>,
    },
    {
      id: "sizes",
      header: "Sizes offered",
      enableSorting: false,
      cell: ({ row: r }) =>
        r.original.sizes?.length ? (
          r.original.sizes.map((id) => sizeLabel(taxonomy, id)).join(", ")
        ) : (
          <span className="text-espresso-soft">One size</span>
        ),
    },
    {
      id: "types",
      header: "Types",
      enableSorting: false,
      cell: ({ row: r }) =>
        r.original.types?.length ? (
          <span className="line-clamp-2 max-w-xs">{r.original.types.map((t) => t.name).join(", ")}</span>
        ) : (
          <span className="text-espresso-soft">None</span>
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

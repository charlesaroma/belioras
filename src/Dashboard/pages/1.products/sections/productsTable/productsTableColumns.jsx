import { Eye, Package, Pencil, Trash2 } from "lucide-react";

import StatusChip from "../../../../../components/ui/StatusChip";
import { cn } from "../../../../../utils/cn";
import IconAction from "../../../../components/IconAction";

/** Low stock reads amber, none reads red — the two states worth acting on. */
const LOW_STOCK = 5;

/**
 * Table columns for the catalogue list.
 *
 * A factory: the price cell closes over the currency formatter and the three
 * row actions close over the page's handlers.
 */
export function buildProductColumns({ format, onView, onEdit, onDelete }) {
  return [
    {
      accessorKey: "name",
      header: "Product",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          {row.original.images?.[0] ? (
            <img
              src={row.original.images[0]}
              alt=""
              loading="lazy"
              className="size-10 shrink-0 border border-umber-50 object-cover"
            />
          ) : (
            <span className="flex size-10 shrink-0 items-center justify-center border border-umber-50 text-espresso/30">
              <Package className="size-4" aria-hidden="true" />
            </span>
          )}
          <div className="min-w-0">
            <p className="truncate font-medium text-espresso">{row.original.name}</p>
            <p className="truncate text-[11px] text-espresso-soft">{row.original.slug}</p>
          </div>
        </div>
      ),
    },
    { accessorKey: "category", header: "Category" },
    {
      accessorKey: "price",
      header: "Price",
      meta: { align: "right" },
      cell: ({ getValue }) => <span className="tabular-nums">{format(getValue())}</span>,
    },
    {
      accessorKey: "stock",
      header: "Stock",
      meta: { align: "right" },
      cell: ({ getValue }) => {
        const stock = getValue();
        return (
          <span
            className={cn(
              "tabular-nums",
              stock === 0 ? "text-error" : stock <= LOW_STOCK ? "text-warning" : "",
            )}
          >
            {stock}
          </span>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ getValue }) => <StatusChip status={getValue()} kind="product" />,
    },
    {
      id: "actions",
      header: "",
      enableSorting: false,
      meta: { align: "right" },
      cell: ({ row }) => (
        <div className="flex justify-end gap-1" onClick={(e) => e.stopPropagation()}>
          <IconAction label={`View ${row.original.name}`} icon={Eye} onClick={() => onView(row.original)} />
          <IconAction label={`Edit ${row.original.name}`} icon={Pencil} onClick={() => onEdit(row.original)} />
          <IconAction
            label={`Delete ${row.original.name}`}
            icon={Trash2}
            destructive
            onClick={() => onDelete(row.original)}
          />
        </div>
      ),
    },
  ];
}

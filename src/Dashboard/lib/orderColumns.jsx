import StatusChip from "../../components/ui/StatusChip";

/**
 * Table columns for an order list.
 *
 * Lives in lib/ rather than one page's sections/ because two pages render it —
 * the Orders page and the Overview's recent-orders panel. Per docs/10, a
 * section's piece is promoted the moment a second page wants it, rather than
 * being imported across page folders.
 *
 * A factory because two cells close over the currency formatter and the
 * locale-bound date formatter the page owns. `compact` drops the item count,
 * which the Overview has no room for.
 */
export function buildOrderColumns({ format, dateFmt, compact = false }) {
  return [
    {
      accessorKey: "id",
      header: "Order",
      cell: ({ row: r }) => <span className="font-medium tabular-nums">{r.original.id}</span>,
    },
    { accessorKey: "customer", header: "Customer" },
    ...(compact
      ? []
      : [
          {
            id: "items",
            header: "Items",
            enableSorting: false,
            meta: { align: "right" },
            cell: ({ row: r }) => (
              <span className="tabular-nums">
                {(r.original.items ?? []).reduce((n, i) => n + (i.quantity ?? 1), 0)}
              </span>
            ),
          },
        ]),
    {
      accessorKey: "total",
      header: "Total",
      meta: { align: "right" },
      cell: ({ row: r }) => <span className="tabular-nums">{format(r.original.total)}</span>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row: r }) => <StatusChip status={r.original.status} />,
    },
    {
      accessorKey: "createdAt",
      header: "Placed",
      cell: ({ row: r }) => (
        <span className="whitespace-nowrap text-espresso-soft">
          {dateFmt.format(new Date(r.original.createdAt))}
        </span>
      ),
    },
  ];
}

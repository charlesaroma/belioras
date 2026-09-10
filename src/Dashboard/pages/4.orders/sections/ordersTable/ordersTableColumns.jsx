import StatusChip from "../../../../../components/ui/StatusChip";

/**
 * Table columns for the Orders page.
 *
 * Lives in this page's own sections/ rather than a shared module: the Overview
 * shows a narrower version of the same list, and the two drift apart over time
 * — this one carries the item count and is the place to add anything an admin
 * working through orders needs next.
 *
 * A factory because two cells close over the currency formatter and the
 * locale-bound date formatter the page owns.
 */
export function buildOrderColumns({ format, dateFmt }) {
  return [
    {
      accessorKey: "id",
      header: "Order",
      cell: ({ row: r }) => <span className="font-medium tabular-nums">{r.original.id}</span>,
    },
    { accessorKey: "customer", header: "Customer" },
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

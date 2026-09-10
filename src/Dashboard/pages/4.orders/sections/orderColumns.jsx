import StatusChip from "../../../../components/ui/StatusChip";

/**
 * Table columns for the order list.
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

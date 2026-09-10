/* Admin Dashboard Page: Overview - overviewRecentOrderColumns */
import StatusChip from "../../../../../components/ui/StatusChip";

/* build Recent Order Columns */
export function buildRecentOrderColumns({ format, dateFmt }) {
  return [
    {
      accessorKey: "id",
      header: "Order",
      cell: ({ row: r }) => <span className="font-medium tabular-nums">{r.original.id}</span>,
    },
    { accessorKey: "customer", header: "Customer" },
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

import StatusChip from "../../../../../components/ui/StatusChip";

/**
 * Table columns for the Overview's recent-orders panel.
 *
 * Deliberately its own file rather than a flag on the Orders page's columns:
 * this panel is a glance, not a workspace. It drops the item count the narrow
 * card has no room for, and it is free to diverge further — a preview and a
 * management table answer different questions.
 */
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

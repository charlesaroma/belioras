import Avatar from "../../../../components/account/Avatar";

/** Table columns for the customer list. */
export function buildCustomerColumns({ format, dateFmt }) {
  return [
    {
      accessorKey: "name",
      header: "Customer",
      cell: ({ row: r }) => (
        <div className="flex items-center gap-3">
          <Avatar user={r.original} size="sm" />
          <div className="min-w-0">
            <p className="truncate font-medium text-espresso">{r.original.name}</p>
            <p className="truncate text-[11px] text-espresso-soft">{r.original.email}</p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "orderCount",
      header: "Orders",
      meta: { align: "right" },
      cell: ({ row: r }) => <span className="tabular-nums">{r.original.orderCount}</span>,
    },
    {
      accessorKey: "spent",
      header: "Lifetime value",
      meta: { align: "right" },
      cell: ({ row: r }) => (
        <span className="tabular-nums">{r.original.spent ? format(r.original.spent) : "—"}</span>
      ),
    },
    {
      accessorKey: "lastOrder",
      header: "Last order",
      cell: ({ row: r }) => (
        <span className="whitespace-nowrap text-espresso-soft">
          {r.original.lastOrder ? dateFmt.format(r.original.lastOrder) : "—"}
        </span>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Joined",
      cell: ({ row: r }) => (
        <span className="whitespace-nowrap text-espresso-soft">
          {r.original.createdAt ? dateFmt.format(new Date(r.original.createdAt)) : "—"}
        </span>
      ),
    },
  ];
}

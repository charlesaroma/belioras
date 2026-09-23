/* Admin Dashboard Page: Transactions - transactionsTableColumns */
import StatusChip from "../../../../../components/ui/StatusChip";
import {
  TRANSACTION_TYPE,
  describeMethod,
  formatCharged,
} from "../../../../../utils/transactionStatus";

export function buildTransactionColumns({ locale, dateFmt }) {
  return [
    {
      accessorKey: "createdAt",
      header: "Date",
      cell: ({ row: r }) => (
        <span className="whitespace-nowrap text-espresso-soft">
          {dateFmt.format(new Date(r.original.createdAt))}
        </span>
      ),
    },
    {
      accessorKey: "providerRef",
      header: "Transaction",
      cell: ({ row: r }) => (
        <span className="font-mono text-[12px] text-espresso">{r.original.providerRef}</span>
      ),
    },
    {
      accessorKey: "orderId",
      header: "Order",
      cell: ({ row: r }) => (
        <span className="whitespace-nowrap font-medium tabular-nums">{r.original.orderId}</span>
      ),
    },
    {
      // Name and email together, so the search box finds a customer by either.
      id: "customer",
      accessorFn: (t) => `${t.customer} ${t.email ?? ""}`,
      header: "Customer",
      cell: ({ row: r }) => <span className="whitespace-nowrap">{r.original.customer}</span>,
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row: r }) => TRANSACTION_TYPE[r.original.type] ?? r.original.type,
    },
    {
      id: "method",
      accessorFn: (t) => describeMethod(t.method),
      header: "Method",
      enableSorting: false,
      cell: ({ getValue }) => <span className="whitespace-nowrap">{getValue()}</span>,
    },
    {
      accessorKey: "signedAmount",
      header: "Amount",
      meta: { align: "right" },
      cell: ({ row: r }) => (
        <span
          className={`whitespace-nowrap tabular-nums ${r.original.type === "refund" ? "text-espresso-soft" : "text-espresso"}`}
        >
          {formatCharged(r.original.signedAmount, r.original.currency, locale)}
        </span>
      ),
    },
    {
      accessorKey: "displayStatus",
      header: "Status",
      cell: ({ row: r }) => <StatusChip kind="transaction" status={r.original.displayStatus} />,
    },
  ];
}

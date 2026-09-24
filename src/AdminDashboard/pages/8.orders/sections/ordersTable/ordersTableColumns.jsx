/* Admin Dashboard Page: Orders - ordersTableColumns */
import { cn } from "../../../../../utils/cn";
import OrdersPill from "./OrdersPill";
import { FULFILMENT, PAYMENT } from "./ordersRows";

const NEXT = {
  ship: { label: "Mark shipped", primary: true },
  deliver: { label: "Mark delivered", primary: false },
};

/** Waiting this long is worth a second look. */
const LATE_DAYS = 7;

export function buildOrderColumns({ format, dateFmt, canEdit, onNext }) {
  return [
    {
      accessorKey: "createdAt",
      header: "Order",
      cell: ({ row: r }) => (
        <div>
          <p className="font-medium tabular-nums text-espresso">{r.original.id}</p>
          <p className="whitespace-nowrap text-[12px] text-espresso-soft">
            {dateFmt.format(new Date(r.original.createdAt))}
            {r.original.age === 0 && <span className="text-gold-800"> · today</span>}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "customer",
      header: "Customer",
      cell: ({ row: r }) => (
        <div className="min-w-0">
          <p className="truncate text-espresso">{r.original.customer}</p>
          <p className="truncate text-[12px] text-espresso-soft">{r.original.customerNote}</p>
        </div>
      ),
    },
    { accessorKey: "itemCount", header: "Items", meta: { align: "right" }, cell: ({ getValue }) => <span className="tabular-nums">{getValue()}</span> },
    { accessorKey: "payment", header: "Payment", cell: ({ getValue }) => <OrdersPill meta={PAYMENT[getValue()]} /> },
    { accessorKey: "fulfilment", header: "Fulfilment", cell: ({ getValue }) => <OrdersPill meta={FULFILMENT[getValue()]} /> },
    {
      accessorKey: "total",
      header: "Total",
      meta: { align: "right" },
      cell: ({ row: r }) => {
        const o = r.original;
        const waiting = o.status === "to-ship" ? `Waiting ${o.age} days` : null;
        return (
          <div className="text-right">
            <p className="tabular-nums text-espresso">{format(o.total)}</p>
            {waiting && o.age >= LATE_DAYS && <p className="whitespace-nowrap text-[12px] text-gold-800">{waiting}</p>}
          </div>
        );
      },
    },
    {
      id: "next",
      header: "Next step",
      enableSorting: false,
      meta: { align: "right" },
      cell: ({ row: r }) => {
        const step = NEXT[r.original.next];
        if (!step || !canEdit) return null;
        return (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onNext(r.original);
            }}
            className={cn(
              "whitespace-nowrap border px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] transition-colors",
              step.primary ? "border-espresso bg-espresso text-ivory-50 hover:bg-espresso-600" : "border-umber-100 text-espresso hover:border-espresso",
            )}
          >
            {step.label}
          </button>
        );
      },
    },
  ];
}

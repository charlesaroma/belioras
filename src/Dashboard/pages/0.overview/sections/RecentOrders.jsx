import { useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Receipt } from "lucide-react";

import DashTable from "../../../components/DashTable";
import { buildOrderColumns } from "../../../lib/orderColumns";

/**
 * The last handful of orders, with a way through to the full list.
 *
 * Renders through DashTable like every other data table in the dashboard —
 * it used to be a hand-rolled <table>, so it had its own header markup, its
 * own row styling and no empty state. `compact` drops the item count, which
 * this panel has no room for.
 */
export default function RecentOrders({ orders, format, dateFmt }) {
  const columns = useMemo(
    () => buildOrderColumns({ format, dateFmt, compact: true }),
    [format, dateFmt],
  );

  return (
    <section className="border border-umber-50 bg-ivory-50" aria-labelledby="orders-heading">
      <div className="flex items-baseline justify-between gap-4 border-b border-umber-50 px-6 py-5">
        <h2 id="orders-heading" className="font-display text-2xl text-espresso">
          Recent orders
        </h2>
        <Link
          to="/dashboard/orders"
          className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-gold-700 transition-colors hover:text-espresso"
        >
          View all
          <ArrowRight className="size-3.5" aria-hidden="true" />
        </Link>
      </div>

      <div className="p-6">
        <DashTable
          columns={columns}
          data={orders ?? []}
          initialSorting={[{ id: "createdAt", desc: true }]}
          unit={(orders ?? []).length === 1 ? "order" : "orders"}
          empty={{
            icon: Receipt,
            title: "No orders yet",
            description: "Orders placed on the storefront appear here.",
          }}
        />
      </div>
    </section>
  );
}

import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import StatusChip from "../../../../components/ui/StatusChip";

const HEADINGS = ["Order", "Customer", "Total", "Status", "Placed"];

/** The last handful of orders, with a way through to the full list. */
export default function RecentOrders({ orders, format, dateFmt }) {
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

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left">
          <thead>
            <tr className="border-b border-umber-50">
              {HEADINGS.map((heading) => (
                <th
                  key={heading}
                  scope="col"
                  className="px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-espresso-soft"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(orders ?? []).map((order) => (
              <tr
                key={order.id}
                className="border-b border-umber-50/60 last:border-b-0 transition-colors hover:bg-brown-50/40"
              >
                <td className="px-6 py-4 font-mono text-[13px] text-espresso">{order.id}</td>
                <td className="px-6 py-4 text-sm text-espresso">{order.customer}</td>
                <td className="px-6 py-4 text-sm tabular-nums text-espresso">
                  {format(order.total)}
                </td>
                <td className="px-6 py-4">
                  <StatusChip status={order.status} />
                </td>
                <td className="px-6 py-4 text-sm text-espresso-soft">
                  {dateFmt.format(new Date(order.createdAt))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

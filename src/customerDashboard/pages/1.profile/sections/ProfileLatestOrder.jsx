/* Customer Dashboard Page: Profile - ProfileLatestOrder */
import { Link } from "react-router-dom";
import { Package } from "lucide-react";

import OrderTimeline from "../../../../components/account/OrderTimeline";
import StatusChip from "../../../../components/ui/StatusChip";
import EmptyState from "../../../../components/ui/EmptyState";
import { isOffTimeline } from "../../../../utils/orderStatus";

export default function LatestOrder({ order, loading, totalOrders, format }) {
  return (
    <section>
      <div className="mb-4 flex items-baseline justify-between gap-4">
        <h2 className="font-display text-xl tracking-wide text-espresso">Latest order</h2>
        {totalOrders > 1 && (
          <Link to="/account/orders" className="eyebrow hover:opacity-70">
            All orders
          </Link>
        )}
      </div>

      {loading ? (
        <div className="skeleton h-32 w-full" />
      ) : !order ? (
        <EmptyState
          icon={Package}
          title="No orders yet"
          description="When you order, this is where you will follow it."
          action={{ label: "Browse the collection", to: "/shop" }}
        />
      ) : (
        <Link
          to={`/account/orders/${order.id}`}
          className="block border border-umber-50 p-5 transition-colors hover:border-espresso/25"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-medium tabular-nums text-espresso">{order.id}</p>
              <p className="mt-0.5 text-[12px] text-espresso-soft">
                {(order.items ?? []).length}{" "}
                {(order.items ?? []).length === 1 ? "piece" : "pieces"} · {format(order.total)}
              </p>
            </div>
            <StatusChip status={order.status} />
          </div>

          {isOffTimeline(order.status) ? (
            <p className="mt-4 text-[13px] text-espresso-soft">
              This order is closed. Open it for the details.
            </p>
          ) : (
            <OrderTimeline status={order.status} bordered={false} className="mt-4" />
          )}
        </Link>
      )}
    </section>
  );
}

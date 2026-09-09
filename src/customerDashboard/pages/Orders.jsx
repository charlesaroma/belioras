import { Link } from "react-router-dom";
import { ArrowRight, Package, PackageOpen } from "lucide-react";

import StatusChip from "../../components/ui/StatusChip";
import { useAuth } from "../../context/AuthContext";
import { useCurrency } from "../../context/CurrencyContext";
import { useAsyncData } from "../../hooks/useAsyncData";
import { getOrders } from "../../services/ordersApi";

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-IE", { day: "numeric", month: "short", year: "numeric" });
}

export default function Orders() {
  const { user } = useAuth();
  const { format } = useCurrency();
  const { data: orders, loading } = useAsyncData(() => getOrders(user?.id), [user?.id]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-medium tracking-wide">Orders</h2>
        <p className="mt-1 text-sm text-espresso-soft">Review your order history and track status.</p>
      </div>

      {loading ? (
        <div className="space-y-3" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <div key={i} className="animate-pulse rounded-2xl border border-umber-50 bg-white p-5">
              <div className="h-4 w-32 rounded bg-brown-50" />
              <div className="mt-3 h-3 w-48 rounded bg-brown-50" />
              <div className="mt-3 h-3 w-24 rounded bg-brown-50" />
            </div>
          ))}
        </div>
      ) : !orders?.length ? (
        <div className="rounded-2xl border border-umber-50 bg-white px-6 py-16 text-center">
          <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-gold-500/15 text-gold-700">
            <PackageOpen className="size-6" aria-hidden="true" />
          </span>
          <h2 className="mt-5 font-display text-xl font-medium tracking-wide">No orders yet</h2>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-espresso-soft">
            When you place an order it will appear here, with live status and delivery details.
          </p>
          <Link
            to="/shop"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-espresso px-6 py-3 text-sm font-medium text-ivory-50 transition-colors duration-200 hover:bg-umber-500 active:scale-[0.98]"
          >
            <Package className="size-4" aria-hidden="true" />
            Browse the store
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-umber-50 bg-white">
          <ul className="divide-y divide-umber-50">
            {orders.map((order) => (
              <li key={order.id}>
                <Link
                  to={`/account/orders/${order.id}`}
                  className="group flex cursor-pointer items-center gap-4 px-5 py-4 transition-colors hover:bg-brown-50/60 sm:px-6"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <p className="text-sm font-semibold text-espresso">{order.id}</p>
                      <StatusChip status={order.status} />
                    </div>
                    <p className="mt-1 text-xs text-espresso-soft">
                      {formatDate(order.createdAt)} · {order.items.length} item{order.items.length === 1 ? "" : "s"}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <p className="text-sm font-semibold text-espresso">
                      {format(order.total)}
                    </p>
                    <ArrowRight
                      className="size-4 text-espresso-soft transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-gold-700"
                      aria-hidden="true"
                    />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
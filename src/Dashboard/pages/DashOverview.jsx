import { Link } from "react-router-dom";
import { ArrowRight, Package, Receipt, Users, Wallet } from "lucide-react";

import { useAsyncData } from "../../hooks/useAsyncData";
import { useCurrency } from "../../context/CurrencyContext";
import { useLanguage } from "../../context/LanguageContext";
import { getDashboardStats, getRecentOrders } from "../../services/dashboardApi";
import { ORDER_STATUS } from "../lib/constants";

import StatCard from "../components/StatCard";
import SalesChart from "../components/SalesChart";

/**
 * Overview.
 *
 * Every figure is derived from the same order and product data the storefront
 * reads — previously they were hardcoded, showing dollar amounts in a euro
 * store and dates from 2024. A test order placed on the site now appears here.
 */
export default function DashOverview() {
  const { data: stats, loading } = useAsyncData(getDashboardStats, []);
  const { data: orders } = useAsyncData(() => getRecentOrders(6), []);
  const { format, currency } = useCurrency();
  const { locale } = useLanguage();

  const compact = (value) =>
    new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(value);

  return (
    <div className="space-y-10">
      <section aria-label="Key figures">
        <div className="grid gap-px border border-umber-50 bg-umber-50 sm:grid-cols-2 xl:grid-cols-4">
          {/* A single hairline grid rather than four floating cards — it reads
              as one instrument panel instead of scattered widgets. */}
          <StatCard
            label="Revenue"
            value={loading ? "—" : format(stats?.revenue ?? 0)}
            change={stats?.revenueChange}
            hint="vs last month"
            icon={Wallet}
          />
          <StatCard
            label="Orders"
            value={loading ? "—" : (stats?.orderCount ?? 0).toLocaleString(locale)}
            change={stats?.orderChange}
            hint="vs last month"
            icon={Receipt}
          />
          <StatCard
            label="Average order"
            value={loading ? "—" : format(stats?.averageOrder ?? 0)}
            icon={Package}
          />
          <StatCard
            label="Customers"
            value={loading ? "—" : (stats?.customerCount ?? 0).toLocaleString(locale)}
            hint={`${stats?.productCount ?? 0} pieces live`}
            icon={Users}
          />
        </div>

        {stats?.lowStockCount > 0 && (
          <Link
            to="/dashboard/products"
            className="mt-4 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-gold-700 transition-colors hover:text-espresso"
          >
            {stats.lowStockCount} {stats.lowStockCount === 1 ? "piece is" : "pieces are"} low on
            stock
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </Link>
        )}
      </section>

      <section className="border border-umber-50 bg-ivory-50 p-6" aria-labelledby="revenue-heading">
        <div className="mb-6 flex items-baseline justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-espresso-soft">
              Performance
            </p>
            <h2 id="revenue-heading" className="mt-1 font-display text-2xl text-espresso">
              Revenue
            </h2>
          </div>
        </div>
        <SalesChart data={stats?.series ?? []} formatValue={compact} />
      </section>

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
                {["Order", "Customer", "Total", "Status", "Placed"].map((heading) => (
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
                    <OrderStatus status={order.status} />
                  </td>
                  <td className="px-6 py-4 text-sm text-espresso-soft">
                    {new Intl.DateTimeFormat(locale, {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    }).format(new Date(order.createdAt))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

/** Uses the brand's status chips rather than stock green/blue/purple pills. */
function OrderStatus({ status }) {
  const meta = ORDER_STATUS[status] ?? { label: status, tone: "neutral" };
  const tone = {
    positive: "bg-success/10 text-success",
    pending: "bg-gold-500/15 text-gold-800",
    progress: "bg-brown-50 text-brown-700",
    neutral: "bg-umber-50 text-espresso-soft",
    negative: "bg-error/10 text-error",
  }[meta.tone];

  return (
    <span
      className={`inline-flex rounded-sm px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${tone}`}
    >
      {meta.label}
    </span>
  );
}

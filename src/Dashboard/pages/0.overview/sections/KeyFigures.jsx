import { Link } from "react-router-dom";
import { ArrowRight, Package, Receipt, Users, Wallet } from "lucide-react";

import StatCard from "../../../components/StatCard";

/**
 * The four headline numbers, plus the one thing worth chasing.
 *
 * A single hairline grid rather than four floating cards — it reads as one
 * instrument panel instead of scattered widgets.
 */
export default function KeyFigures({ stats, loading, format, locale }) {
  return (
    <section aria-label="Key figures">
      <div className="grid gap-px border border-umber-50 bg-umber-50 sm:grid-cols-2 xl:grid-cols-4">
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
          {stats.lowStockCount} {stats.lowStockCount === 1 ? "piece is" : "pieces are"} low on stock
          <ArrowRight className="size-3.5" aria-hidden="true" />
        </Link>
      )}
    </section>
  );
}

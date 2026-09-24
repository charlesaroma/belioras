/* Admin Dashboard Page: Discounts - DiscountsSummary */
import { Percent, Receipt, Ticket, Users } from "lucide-react";

import { useCurrency } from "@/context/CurrencyContext";
import StatCard from "../../../components/StatCard";

/** What the codes have done in total: uses, people, the revenue those orders brought in, and the discount given away. */
export default function DiscountsSummary({ stats, activeCodes, loading }) {
  const { format } = useCurrency();
  const t = stats?.totals;
  const dash = (v) => (loading || !t ? "—" : v);
  const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;

  const share = t?.allRevenue > 0 ? Math.round((t.revenue / t.allRevenue) * 100) : 0;
  const average = t?.redemptions > 0 ? t.discount / t.redemptions : 0;

  return (
    <section aria-label="Coupon summary">
      <div className="grid gap-px border border-umber-50 bg-umber-50 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Redemptions"
          value={dash(String(t?.redemptions ?? 0))}
          hint={`across ${plural(activeCodes, "active code", "active codes")}`}
          icon={Ticket}
        />
        <StatCard
          label="Customers"
          value={dash(String(t?.customers ?? 0))}
          hint="who have used a code"
          icon={Users}
        />
        <StatCard
          label="Revenue from codes"
          value={dash(format(t?.revenue ?? 0))}
          hint={t?.allRevenue ? `${share}% of all revenue` : "orders that used a code"}
          icon={Receipt}
        />
        <StatCard
          label="Discount given"
          value={dash(format(t?.discount ?? 0))}
          hint={t?.redemptions ? `${format(average)} per order` : "nothing given yet"}
          icon={Percent}
        />
      </div>
    </section>
  );
}

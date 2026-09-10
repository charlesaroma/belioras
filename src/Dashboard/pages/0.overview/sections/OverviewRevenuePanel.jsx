/* Admin Dashboard Page: Overview - OverviewRevenuePanel */
import SalesChart from "../../../components/SalesChart";

export default function RevenuePanel({ series, formatCompact }) {
  return (
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
      <SalesChart data={series ?? []} formatValue={formatCompact} />
    </section>
  );
}

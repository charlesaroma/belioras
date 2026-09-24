/* Admin Dashboard Page: Overview - OverviewRevenuePanel */
import { useMemo, useState } from "react";

import { cn } from "../../../../utils/cn";
import SalesChart from "../../../components/SalesChart";

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const RANGES = [
  { months: 3, label: "3 months" },
  { months: 6, label: "6 months" },
  { months: 12, label: "12 months" },
];

/**
 * Revenue by month over a chosen window, with the window before it drawn
 * faintly behind so a rise or dip has something to be measured against.
 */
export default function RevenuePanel({ series = [], formatCompact }) {
  const [months, setMonths] = useState(6);

  // Calendar months ending at the latest one with sales, so 12 months really
  // is twelve — months before the first order are left empty, not drawn as
  // zero. The window before it is laid alongside, month for month.
  const data = useMemo(() => {
    if (!series.length) return [];
    const byKey = new Map(series.map((d) => [d.key, d]));
    const first = series[0].key;
    const last = series.at(-1).key;
    const nameOf = (key) => `${MONTH_NAMES[key % 12]}`;
    const valueAt = (key) => (key < first ? null : byKey.get(key)?.sales ?? 0);
    return Array.from({ length: months }, (_, i) => {
      const key = last - months + 1 + i;
      return {
        key,
        name: nameOf(key),
        label: `${MONTH_NAMES[key % 12]} ${Math.floor(key / 12)}`,
        sales: valueAt(key),
        previous: valueAt(key - months),
      };
    });
  }, [series, months]);

  const hasPrevious = data.some((d) => d.previous !== null && d.previous !== undefined);
  const ranges = RANGES;
  const active = months;

  return (
    <section className="border border-umber-50 bg-ivory-50 p-6" aria-labelledby="revenue-heading">
      <div className="mb-6 flex flex-wrap items-baseline justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-espresso-soft">
            Performance
          </p>
          <h2 id="revenue-heading" className="mt-1 font-display text-2xl text-espresso">
            Revenue
          </h2>
        </div>

        <div className="flex items-center gap-4">
          {hasPrevious && (
            <span className="hidden items-center gap-2 text-[11px] text-espresso-soft sm:flex">
              <span aria-hidden="true" className="h-px w-5 border-t border-dashed border-espresso/40" />
              Previous period
            </span>
          )}
          <div role="group" aria-label="Period" className="flex border border-umber-100">
            {ranges.map((r) => (
              <button
                key={r.months}
                type="button"
                aria-pressed={active === r.months}
                onClick={() => setMonths(r.months)}
                className={cn(
                  "px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] transition-colors",
                  active === r.months ? "bg-espresso text-ivory-50" : "text-espresso-soft hover:text-espresso",
                )}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      <SalesChart data={data} formatValue={formatCompact} />
    </section>
  );
}

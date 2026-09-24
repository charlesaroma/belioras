/* Admin Dashboard Page: Overview - OverviewRevenuePanel */
import { useMemo, useState } from "react";

import { cn } from "../../../../utils/cn";
import SalesChart from "../../../components/SalesChart";

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
  const ranges = RANGES.filter((r) => series.length > 3 || r.months === 3);
  const [months, setMonths] = useState(6);
  const active = Math.min(months, Math.max(3, series.length));

  const data = useMemo(() => {
    const current = series.slice(-active);
    const before = series.slice(-active * 2, -active);
    // Aligned from the right, so the last month meets the last month before it.
    const offset = current.length - before.length;
    return current.map((d, i) => ({ ...d, previous: i - offset >= 0 ? before[i - offset]?.sales ?? null : null }));
  }, [series, active]);

  const hasPrevious = data.some((d) => d.previous !== null);

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

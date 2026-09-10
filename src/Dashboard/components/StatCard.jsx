/* Admin Dashboard: StatCard */
import { cn } from "../../utils/cn";

export default function StatCard({ label, value, change, hint, icon: Icon }) {

  const hasChange = typeof change === "number" && Number.isFinite(change);

/* is Positive */
  const isPositive = hasChange && change >= 0;

  return (
    <div className="group relative border border-umber-50 bg-ivory-50 p-6 transition-colors hover:border-gold-500/40">
      <div className="flex items-start justify-between gap-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-espresso-soft">
          {label}
        </p>
        {Icon && (
          <Icon className="size-4 shrink-0 text-espresso/25" strokeWidth={1.5} aria-hidden="true" />
        )}
      </div>

      <span aria-hidden="true" className="mt-3 block h-px w-8 bg-gold-500" />

      <p className="mt-4 font-display text-[34px] leading-none tracking-tight text-espresso">
        {value}
      </p>

      <div className="mt-3 flex items-baseline gap-2 text-[11px]">
        {hasChange ? (
          <span className={cn("font-medium tabular-nums", isPositive ? "text-success" : "text-error")}>
            {isPositive ? "↑" : "↓"} {Math.abs(change).toFixed(1)}%
          </span>
        ) : (
          // No prior period to compare against — saying "0%" would be a claim
          // the data does not support.
          <span className="text-espresso/30">—</span>
        )}
        {hint && <span className="text-espresso/40">{hint}</span>}
      </div>
    </div>
  );
}

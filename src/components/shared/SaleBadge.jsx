import { SALE_BADGE } from "../../utils/constants";
import { cn } from "../../utils/cn";

export default function SaleBadge({ product, className = "" }) {
  const label = product ? SALE_BADGE.label(product) : null;
  if (!label) return null;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-gold-600 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-ivory-50",
        className
      )}
    >
      {label}
    </span>
  );
}
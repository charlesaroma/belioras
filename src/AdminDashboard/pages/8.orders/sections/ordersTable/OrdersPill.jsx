/* Admin Dashboard Page: Orders - OrdersPill */
import { cn } from "../../../../../utils/cn";
import { STATUS_TONES } from "../../../../lib/constants";

/** A status pill with a dot, as the list reads at a glance. */
export default function OrdersPill({ meta }) {
  if (!meta) return null;
  if (!meta.tone) return <span className="text-[12px] text-espresso-soft">{meta.label}</span>;
  return (
    <span className={cn("inline-flex items-center gap-1.5 whitespace-nowrap px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em]", STATUS_TONES[meta.tone])}>
      <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />
      {meta.label}
    </span>
  );
}


/* Admin Dashboard: Toggle */
import { cn } from "@/utils/cn";

/** A labelled on/off switch. The whole row is the target, not just the track. */
export default function Toggle({ checked, onChange, label, description }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex w-full items-start justify-between gap-6 py-1 text-left"
    >
      <span className="min-w-0">
        <span className="block text-[14px] text-espresso">{label}</span>
        {description && (
          <span className="mt-0.5 block text-[12px] leading-relaxed text-espresso-soft">
            {description}
          </span>
        )}
      </span>
      <span
        aria-hidden="true"
        className={cn(
          "relative mt-0.5 h-6 w-11 shrink-0 border transition-colors",
          checked ? "border-espresso bg-espresso" : "border-umber-100 bg-ivory-50",
        )}
      >
        <span
          className={cn(
            "absolute top-[2px] size-[18px] transition-all duration-200",
            checked ? "left-[22px] bg-gold-400" : "left-[2px] bg-umber-100",
          )}
        />
      </span>
    </button>
  );
}

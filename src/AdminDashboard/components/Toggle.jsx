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
            "absolute left-[2px] top-[2px] size-[18px] transition-[translate,background-color] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)]",
            checked ? "translate-x-5 bg-gold-400" : "translate-x-0 bg-umber-100",
          )}
        />
      </span>
    </button>
  );
}

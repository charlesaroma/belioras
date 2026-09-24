/* Admin Dashboard: Switch */
import { cn } from "@/utils/cn";

/**
 * The on/off track on its own: green and knob-right when on, grey and
 * knob-left when off. `label` names it for screen readers; pass `text` to
 * write the state beside it ("Live", "Paused").
 */
export default function Switch({ checked, onChange, label, text, disabled = false, className }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn("inline-flex items-center gap-2 disabled:cursor-not-allowed disabled:opacity-40", className)}
    >
      <span
        aria-hidden="true"
        className={cn(
          "relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200",
          checked ? "bg-success" : "bg-umber-100",
        )}
      >
        <span
          className={cn(
            "absolute left-[3px] top-[3px] size-[18px] rounded-full bg-white shadow-sm transition-[translate] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)]",
            checked ? "translate-x-5" : "translate-x-0",
          )}
        />
      </span>
      {text && <span className="w-14 text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-espresso-soft">{text}</span>}
    </button>
  );
}

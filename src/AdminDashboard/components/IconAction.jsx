/* Admin Dashboard: IconAction */
import { cn } from "../../utils/cn";

export default function IconAction({
  label,
  icon: Icon,
  onClick,
  disabled = false,
  destructive = false,
  className,
}) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={cn(
        "liquid-hover rounded-full p-2 transition-[color,scale] duration-150 active:scale-90",
        disabled
          ? "cursor-not-allowed text-espresso/15"
          : destructive
            ? "text-espresso/45 hover:text-error"
            : "text-espresso/45 hover:text-espresso",
        className,
      )}
    >
      <Icon className="liquid-icon size-4" strokeWidth={1.5} aria-hidden="true" />
    </button>
  );
}

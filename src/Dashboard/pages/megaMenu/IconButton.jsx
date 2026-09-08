import { cn } from "../../../utils/cn";

/** Small square action inside a menu row. */
export default function IconButton({ label, icon: Icon, onClick, disabled, destructive }) {
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
        "p-1.5 transition-colors",
        disabled
          ? "cursor-not-allowed text-espresso/15"
          : destructive
            ? "text-espresso/40 hover:text-error"
            : "text-espresso/40 hover:text-espresso",
      )}
    >
      <Icon className="size-4" strokeWidth={1.5} aria-hidden="true" />
    </button>
  );
}

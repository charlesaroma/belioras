import { cn } from "../../utils/cn";

/**
 * Small square icon action for a table or list row.
 *
 * Promoted here from two page folders that had each written their own — the
 * mega menu's IconButton and the catalogue's IconAction were the same
 * component with different padding. Per docs/10, a section's piece moves to
 * components/ the moment a second page wants it, rather than being imported
 * across page folders.
 */
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
        "p-2 transition-colors",
        disabled
          ? "cursor-not-allowed text-espresso/15"
          : destructive
            ? "text-espresso/45 hover:text-error"
            : "text-espresso/45 hover:text-espresso",
        className,
      )}
    >
      <Icon className="size-4" strokeWidth={1.5} aria-hidden="true" />
    </button>
  );
}

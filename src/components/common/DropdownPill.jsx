import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "../../utils/cn";

const PILL_TRIGGER =
  "inline-flex items-center gap-1.5 border border-current/30 px-3 py-1.5 text-[11px] uppercase tracking-widest transition-colors hover:border-current/60";

const ICON_TRIGGER =
  "flex size-10 items-center justify-center rounded-full text-current transition-opacity hover:opacity-70";

/**
 * Accessible listbox used for the header's language and currency selectors.
 *
 * `iconOnly` is the header presentation the design review asked for — a clear
 * icon rather than a labelled pill. The pill form is used in denser contexts
 * such as the mobile drawer.
 */
export default function DropdownPill({
  ariaLabel,
  icon,
  label,
  options,
  activeCode,
  onSelect,
  iconOnly = false,
  showChevron = true,
  triggerClassName,
  align = "right",
}) {
  const [open, setOpen] = useState(false);
  const listId = useId();
  const containerRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-label={ariaLabel}
        className={cn(triggerClassName || (iconOnly ? ICON_TRIGGER : PILL_TRIGGER))}
      >
        {icon}
        {!iconOnly && label}
        {!iconOnly && showChevron && (
          <ChevronDown
            className={cn("size-3.5 transition-transform duration-200", open && "rotate-180")}
            aria-hidden="true"
          />
        )}
      </button>

      {open && (
        <>
          {/* Click-away scrim. aria-hidden + tabIndex -1 keeps it out of the
              tab order and off the accessibility tree. */}
          <button
            type="button"
            aria-hidden="true"
            tabIndex={-1}
            className="fixed inset-0 z-40 cursor-default"
            onClick={() => setOpen(false)}
          />
          <ul
            id={listId}
            role="listbox"
            aria-label={ariaLabel}
            className={cn(
              "absolute z-50 mt-2 max-h-64 w-44 overflow-y-auto border border-umber-50 bg-ivory-50 py-1 shadow-large",
              align === "right" ? "right-0" : "left-0",
            )}
          >
            {options.map((opt) => (
              <li key={opt.code}>
                <button
                  type="button"
                  role="option"
                  aria-selected={opt.code === activeCode}
                  onClick={() => {
                    onSelect(opt.code);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-xs uppercase tracking-wide transition-colors hover:bg-brown-50",
                    opt.code === activeCode ? "text-gold-700" : "text-espresso",
                  )}
                >
                  <span>{opt.display}</span>
                  {opt.meta && <span className="tabular-nums opacity-60">{opt.meta}</span>}
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

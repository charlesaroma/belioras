import { useEffect, useId, useRef } from "react";
import { X } from "lucide-react";

import { cn } from "../../utils/cn";

/**
 * Reusable slide-over panel.
 *
 * Ported from the design prototype, which had the right shape: always mounted
 * and translated rather than mounted/unmounted, so the transition runs in both
 * directions and the browser does no layout work on open. Escape closes it and
 * body scroll is locked while it is up.
 *
 * Added here: focus is moved into the panel on open and restored to whatever
 * opened it on close, and the panel is inert while hidden. Without that, a
 * closed drawer is still in the tab order — the keyboard walks into an
 * invisible dialog, which is the same defect the mega menu had.
 */
export default function Drawer({
  open,
  onClose,
  title,
  side = "left",
  width = "max-w-sm",
  footer,
  children,
}) {
  const panelRef = useRef(null);
  const restoreFocusRef = useRef(null);
  const titleId = useId();

  useEffect(() => {
    if (!open) return undefined;

    restoreFocusRef.current = document.activeElement;

    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    // Focus the panel itself rather than the first control, so a screen reader
    // announces the dialog's name before its contents.
    panelRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
      restoreFocusRef.current?.focus?.();
    };
  }, [open, onClose]);

  const isRight = side === "right";

  return (
    <div
      className={cn("fixed inset-0 z-50", !open && "pointer-events-none")}
      aria-hidden={!open}
      inert={!open || undefined}
    >
      <div
        onClick={onClose}
        className={cn(
          "absolute inset-0 bg-espresso/40 backdrop-blur-[2px] transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0",
        )}
      />

      <aside
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={cn(
          "surface-header absolute top-0 flex h-full w-full flex-col shadow-large outline-none",
          "transition-transform duration-300 ease-out motion-reduce:transition-none",
          width,
          isRight ? "right-0" : "left-0",
          open ? "translate-x-0" : isRight ? "translate-x-full" : "-translate-x-full",
        )}
      >
        <header className="flex shrink-0 items-center justify-between border-b border-umber-50 px-6 py-5">
          <h2
            id={titleId}
            className="font-display text-lg uppercase tracking-wide text-espresso"
          >
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-espresso/40 transition-colors hover:text-espresso"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto">{children}</div>

        {footer && <div className="shrink-0 border-t border-umber-50">{footer}</div>}
      </aside>
    </div>
  );
}

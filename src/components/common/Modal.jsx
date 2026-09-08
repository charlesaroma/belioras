import { useEffect, useId, useRef } from "react";
import { X } from "lucide-react";

import { cn } from "../../utils/cn";

/**
 * Centred dialog.
 *
 * Companion to Drawer, sharing its behaviour: Escape closes, body scroll is
 * locked while open, focus moves into the panel and returns to whatever opened
 * it, and the whole thing is inert while hidden so the keyboard cannot walk
 * into an invisible dialog.
 *
 * Unlike Drawer it is genuinely modal — a size guide is a detour from the task,
 * not a parallel surface — so it dims the page and traps attention.
 */
export default function Modal({ open, onClose, title, width = "max-w-lg", children }) {
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
    panelRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
      restoreFocusRef.current?.focus?.();
    };
  }, [open, onClose]);

  return (
    <div
      className={cn(
        "fixed inset-0 z-[60] flex items-center justify-center p-4",
        !open && "pointer-events-none",
      )}
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

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={cn(
          "relative w-full bg-ivory-50 shadow-2xl outline-none",
          "transition-all duration-300 ease-out motion-reduce:transition-none",
          width,
          open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
        )}
      >
        <header className="flex items-center justify-between border-b border-umber-50 px-6 py-4">
          <h2 id={titleId} className="font-display text-lg uppercase tracking-wide text-espresso">
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

        <div className="max-h-[70vh] overflow-y-auto px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

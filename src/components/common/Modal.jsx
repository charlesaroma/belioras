/* Common Component: Modal */
import { useEffect, useId, useRef } from "react";
import { X } from "lucide-react";

import { cn } from "../../utils/cn";

export default function Modal({ open, onClose, title, width = "max-w-lg", bare = false, children }) {

  const panelRef = useRef(null);

  const restoreFocusRef = useRef(null);

  const titleId = useId();

  /* Focus Management */
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
        "fixed inset-0 z-[60] flex justify-center",
        bare ? "items-end p-0 sm:items-center sm:p-4" : "items-center p-4",
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
          "surface-header relative w-full shadow-large outline-none",
          "transition-[translate,opacity] ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none",
          width,
          bare && "max-sm:rounded-t-2xl",
          open ? "translate-y-0 opacity-100 duration-300" : cn("opacity-0 duration-200", bare ? "translate-y-8 sm:translate-y-3" : "translate-y-3"),
        )}
      >
        {bare ? (
          <>
            <h2 id={titleId} className="sr-only">{title}</h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute right-2 top-2 z-10 flex size-11 items-center justify-center rounded-full bg-ivory-50/90 text-espresso-soft shadow-[0_1px_3px_rgba(43,29,20,0.18)] transition-colors hover:text-espresso liquid-hover"
            >
              <X className="liquid-icon size-5" aria-hidden="true" />
            </button>
          </>
        ) : (
        <header className="flex items-center justify-between border-b border-umber-50 px-6 py-4">
          <h2 id={titleId} className="font-display text-lg uppercase tracking-wide text-espresso">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="liquid-hover -mr-3 flex size-11 items-center justify-center rounded-full text-espresso/40 transition-colors hover:text-espresso"
          >
            <X className="liquid-icon size-5" aria-hidden="true" />
          </button>
        </header>
        )}

        <div className={cn("overflow-y-auto", bare ? "max-h-[92dvh] p-5 sm:max-h-[88vh] sm:p-8" : "max-h-[70vh] px-6 py-5")}>{children}</div>
      </div>
    </div>
  );
}

/* Escape And Click Away */
import { useEffect } from "react";

// Focus is only taken where this panel owns the field. On desktop the navbar
// input already has it, and restoring focus on close handed it back to that
// input, whose onFocus reopened the panel — the Close button looked broken
// even though it had run.
export function useSearchPanelDismiss({ open, onDismiss, panelRef, inputRef, restoreFocusRef }) {
  useEffect(() => {
    if (!open) return undefined;

    const ownsFocus = window.matchMedia("(max-width: 1023px)").matches;
    restoreFocusRef.current = ownsFocus ? document.activeElement : null;
    if (ownsFocus) inputRef.current?.focus();

    const onKeyDown = (e) => {
      if (e.key === "Escape") onDismiss();
    };
    const onPointerDown = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) onDismiss();
    };

    document.addEventListener("keydown", onKeyDown);
    // pointerdown rather than click: a click that starts inside the panel and
    // ends outside it should not count as clicking away.
    document.addEventListener("pointerdown", onPointerDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
      restoreFocusRef.current?.focus?.();
    };
  }, [open, onDismiss, panelRef, inputRef, restoreFocusRef]);
}

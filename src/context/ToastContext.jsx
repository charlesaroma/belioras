import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";

const ToastContext = createContext(null);

let nextId = 0;

/** Long enough to read a sentence; the UX baseline is 3–5s. */
const DEFAULT_DURATION = 4000;

/** An undoable action needs time to notice and reach for it. */
const ACTION_DURATION = 8000;

/**
 * Transient feedback.
 *
 * This provider has been mounted app-wide since the beginning, holding state
 * and running dismissal timers, but nothing ever rendered `toasts` — so every
 * toast() call in the app was a silent no-op. ToastViewport is the missing
 * half; mount exactly one, which App.jsx does.
 *
 * Two additions over the original:
 *
 * `action` lets a destructive operation offer Undo. That is what makes a
 * delete safe to perform immediately rather than gating it behind a second
 * confirmation, and it gets a longer window because the shopper has to notice
 * it and decide.
 *
 * `pause`/`resume` stop the countdown while a pointer or the keyboard is on
 * the toast. A message that vanishes while being read — or an Undo that
 * expires as the cursor travels to it — is worse than no message.
 */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  // id -> {timer, expiresAt, remaining}
  const timers = useRef(new Map());

  const clearTimer = useCallback((id) => {
    const entry = timers.current.get(id);
    if (entry?.timer) clearTimeout(entry.timer);
    timers.current.delete(id);
  }, []);

  const dismiss = useCallback(
    (id) => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
      clearTimer(id);
    },
    [clearTimer],
  );

  const schedule = useCallback(
    (id, ms) => {
      const timer = setTimeout(() => dismiss(id), ms);
      timers.current.set(id, { timer, expiresAt: Date.now() + ms, remaining: ms });
    },
    [dismiss],
  );

  /**
   * toast("Saved") · toast("Failed", "error") · toast("Deleted", {action})
   *
   * The second argument still accepts a bare type string, because four call
   * sites already use that form.
   */
  const toast = useCallback(
    (message, typeOrOptions = "info") => {
      const options =
        typeof typeOrOptions === "string" ? { type: typeOrOptions } : (typeOrOptions ?? {});
      const { type = "info", action, duration } = options;

      const id = ++nextId;
      const ms = duration ?? (action ? ACTION_DURATION : DEFAULT_DURATION);

      setToasts((prev) => [...prev, { id, message, type, action }]);
      schedule(id, ms);
      return id;
    },
    [schedule],
  );

  const pause = useCallback((id) => {
    const entry = timers.current.get(id);
    if (!entry?.timer) return;
    clearTimeout(entry.timer);
    timers.current.set(id, {
      timer: null,
      expiresAt: entry.expiresAt,
      remaining: Math.max(0, entry.expiresAt - Date.now()),
    });
  }, []);

  const resume = useCallback(
    (id) => {
      const entry = timers.current.get(id);
      // Only resume something that is actually paused, so a stray pointerleave
      // cannot stack a second timer onto a live toast.
      if (!entry || entry.timer) return;
      schedule(id, entry.remaining);
    },
    [schedule],
  );

  const value = useMemo(
    () => ({ toasts, toast, dismiss, pause, resume }),
    [toasts, toast, dismiss, pause, resume],
  );

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

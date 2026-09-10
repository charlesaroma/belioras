/* Ui Component: ToastViewport */
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { AlertTriangle, Check, Info, X, XCircle } from "lucide-react";

import { useToast } from "../../context/ToastContext";
import { cn } from "../../utils/cn";

const ICONS = {
  success: Check,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

// Colour carries the tone, but never alone — each type also has its own icon,
// so the meaning survives for anyone who cannot separate the hues.
const TONES = {
  success: "text-success",
  error: "text-error",
  warning: "text-warning",
  info: "text-gold-700",
};

export default function ToastViewport() {
  const { toasts, dismiss, pause, resume } = useToast();
  const reduceMotion = useReducedMotion();

  return (
    <div
      // Fixed and non-interactive as a whole, so the empty region never
      // swallows clicks meant for the page beneath; each toast opts back in.
      className="pointer-events-none fixed inset-x-0 bottom-0 z-[70] flex flex-col items-end gap-2 p-4 sm:p-6"
      style={{ paddingBottom: "calc(1rem + var(--consent-bar-height, 0px))" }}
    >
      <AnimatePresence initial={false}>
        {toasts.map((t) => {
          const Icon = ICONS[t.type] ?? Info;
          const isError = t.type === "error";

          return (
            <motion.div
              key={t.id}
              layout={!reduceMotion}
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.98 }}
              animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              role={isError ? "alert" : "status"}
              aria-live={isError ? "assertive" : "polite"}
              onPointerEnter={() => pause(t.id)}
              onPointerLeave={() => resume(t.id)}
              onFocusCapture={() => pause(t.id)}
              onBlurCapture={() => resume(t.id)}
              className="surface-header pointer-events-auto flex w-full max-w-sm items-start gap-3 border border-umber-50 px-4 py-3 shadow-large"
            >
              <Icon
                className={cn("mt-0.5 size-4 shrink-0", TONES[t.type] ?? TONES.info)}
                aria-hidden="true"
              />

              <p className="min-w-0 flex-1 text-[13px] leading-relaxed text-espresso">
                {t.message}
              </p>

              {t.action && (
                <button
                  type="button"
                  onClick={() => {
                    t.action.onClick?.();
                    dismiss(t.id);
                  }}
                  className="shrink-0 text-[11px] uppercase tracking-[0.14em] text-gold-700 underline underline-offset-4 transition-opacity hover:opacity-70"
                >
                  {t.action.label}
                </button>
              )}

              <button
                type="button"
                onClick={() => dismiss(t.id)}
                aria-label="Dismiss"
                className="-mr-1 shrink-0 text-espresso/35 transition-colors hover:text-espresso"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

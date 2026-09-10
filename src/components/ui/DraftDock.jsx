/* Ui Component: DraftDock */
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ImagePlus, X } from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { useProductDraft } from "../../context/ProductDraftContext";

export default function DraftDock() {
  const { drafts, clearDraft } = useProductDraft();
  const { isAdmin } = useAuth();

  const reduceMotion = useReducedMotion();

  // Only staff have anywhere to restore a product draft to.
  if (!isAdmin || drafts.length === 0) return null;

  return (
    <div className="pointer-events-none fixed bottom-0 right-0 z-[65] flex flex-col items-end gap-2 p-4 sm:p-6">
      <AnimatePresence initial={false}>
        {drafts.map((draft) => {

          const progress = draft.progress;

          const working = progress && progress.done < progress.total;

          return (
            <motion.div
              key={draft.key}
              layout={!reduceMotion}
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
              animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="surface-header pointer-events-auto w-[280px] border border-umber-50 shadow-large"
            >
              <div className="flex items-start gap-3 px-4 py-3">
                <ImagePlus
                  className="mt-0.5 size-4 shrink-0 text-gold-700"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />

                <div className="min-w-0 flex-1">
                  <p className="eyebrow">Draft</p>
                  <p className="mt-1 truncate text-[13px] text-espresso">{draft.title}</p>
                  <p className="mt-0.5 text-[11px] text-espresso-soft">
                    {working
                      ? `Processing ${progress.done + 1} of ${progress.total}`
                      : `${draft.imageCount ?? 0} ${
                          (draft.imageCount ?? 0) === 1 ? "image" : "images"
                        } added`}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => clearDraft(draft.key)}
                  aria-label={`Discard draft ${draft.title}`}
                  className="-mr-1 shrink-0 text-espresso/35 transition-colors hover:text-error"
                >
                  <X className="size-4" aria-hidden="true" />
                </button>
              </div>

              {working && (
                <div className="h-px bg-umber-50">
                  <div
                    className="h-full bg-gold-500 transition-[width] duration-200"
                    style={{ width: `${((progress.done + 1) / progress.total) * 100}%` }}
                  />
                </div>
              )}

              <Link
                to={draft.href ?? "/dashboard/products/new"}
                className="block border-t border-umber-50 px-4 py-2.5 text-center text-[11px] uppercase tracking-[0.14em] text-gold-700 transition-colors hover:bg-brown-50/50"
              >
                Resume
              </Link>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

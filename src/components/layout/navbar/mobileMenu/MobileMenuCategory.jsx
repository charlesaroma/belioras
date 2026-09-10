/* Category Accordion */
import { useState } from "react";
import { Plus } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { cn } from "../../../../utils/cn";
import MegaMenuPanel from "../MegaMenuPanel";
import { titleCase } from "./mobileMenuText";

export default function MobileMenuCategory({ category, onClose }) {
  const [open, setOpen] = useState(false);

  const reduceMotion = useReducedMotion();

  return (
    <div
      className={cn(
        "-mx-6 border-b border-umber-50 border-l-2 px-6 transition-colors duration-300",
        open ? "border-l-gold-500 bg-brown-50/45" : "border-l-transparent",
      )}
    >
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 py-5 text-left"
      >
        <span
          className={cn(
            "font-display text-[26px] leading-none tracking-[-0.01em] transition-colors",
            open ? "text-gold-700" : "text-espresso",
          )}
        >
          {titleCase(category.label)}
        </span>
        {/* A plus rotating into a cross — the motif already used by the
            product page accordions, rather than a third chevron style. */}
        <Plus
          className={cn(
            "size-4 shrink-0 text-espresso/35 transition-transform duration-[380ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
            open && "rotate-45",
          )}
          aria-hidden="true"
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            // Same curve and timing as the sections nested inside this panel
            // (see MegaMenuPanel), so opening a category and opening one of
            // its sections feel like one mechanism rather than two.
            transition={{
              height: { duration: reduceMotion ? 0 : 0.38, ease: [0.22, 1, 0.36, 1] },
              opacity: { duration: reduceMotion ? 0 : 0.24, ease: "easeOut" },
            }}
            className="overflow-hidden"
          >
            <div className="pb-5">
              <MegaMenuPanel item={category} variant="mobile" onNavigate={onClose} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

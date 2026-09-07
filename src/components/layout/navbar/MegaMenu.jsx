import { AnimatePresence, motion } from "motion/react";

import MegaMenuPanel from "./MegaMenuPanel";

/**
 * Desktop chrome around MegaMenuPanel.
 *
 * `hidden lg:block` deliberately matches the navbar container's breakpoint.
 * When this was `md` the panel existed in the DOM between 768 and 1024px with
 * no visible trigger, leaving keyboard users able to tab into an invisible menu.
 */
export default function MegaMenu({ category, onMouseEnter, onMouseLeave }) {
  return (
    <AnimatePresence>
      {category && (
        <motion.div
          key={category.id}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          className="hidden w-full border-t border-umber-50/60 bg-ivory-50/98 text-espresso shadow-large backdrop-blur lg:block"
          role="navigation"
          aria-label={`${category.label} menu`}
        >
          <div className="mx-auto max-w-7xl px-8 py-8 xl:px-16 2xl:px-24">
            <MegaMenuPanel item={category} variant="desktop" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

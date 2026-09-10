import { AnimatePresence, motion } from "motion/react";

import MegaMenuPanel from "./MegaMenuPanel";
import { megaMenuColumns, megaMenuLayoutFor } from "./megaMenuLayout";

/**
 * Desktop chrome around MegaMenuPanel.
 *
 * `hidden lg:block` deliberately matches the navbar container's breakpoint.
 * When this was `md` the panel existed in the DOM between 768 and 1024px with
 * no visible trigger, leaving keyboard users able to tab into an invisible menu.
 *
 * Two shapes now. A category with a lot in it keeps the full-bleed band; one
 * with a handful of links gets a dropdown that hugs its content, anchored
 * under the trigger that opened it. Previously every root rendered the band,
 * so two links and forty-four were given the same space.
 */
export default function MegaMenu({ category, anchorLeft, onMouseEnter, onMouseLeave }) {
  const layout = category ? megaMenuLayoutFor(category) : "compact";
  const columns = megaMenuColumns(category, layout);
  const compact = layout === "compact";

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
          className={
            compact
              ? "surface-header absolute z-40 hidden border border-umber-50 shadow-large lg:block"
              : "surface-header hidden w-full border-t border-umber-50/60 shadow-large lg:block"
          }
          // The compact panel is positioned against the header, so it opens
          // under the word that was hovered rather than at the page edge.
          style={compact ? { left: Math.max(anchorLeft ?? 0, 16) } : undefined}
          role="navigation"
          aria-label={`${category.label} menu`}
        >
          <div
            className={
              compact
                ? "min-w-[260px] max-w-[640px] px-7 py-6"
                : "mx-auto max-w-7xl px-8 py-8 xl:px-16 2xl:px-24"
            }
          >
            <MegaMenuPanel
              item={category}
              variant="desktop"
              columns={columns}
              // Imagery fills the band. In a dropdown it is the thing that
              // would create the emptiness rather than fill it.
              showTiles={!compact}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

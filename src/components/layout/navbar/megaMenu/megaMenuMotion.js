/* Mega Menu Motion */

// A long ease-out tail: the panel should read as settling, not snapping.
export const EASE_OUT_SOFT = [0.22, 1, 0.36, 1];
export const SECTION_DURATION = 0.38;

// Small offset, tight stagger — the columns settle together rather than
// sliding in one at a time.
export const COLUMN_STAGGER = 0.035;

// Shop carries 44 links. Showing every one turned a navigation aid into a
// sitemap, so sections cap and link onward.
export const ITEMS_PER_SECTION = 6;

export function sectionTransition(reduceMotion) {
  return {
    height: { duration: reduceMotion ? 0 : SECTION_DURATION, ease: EASE_OUT_SOFT },
    opacity: { duration: reduceMotion ? 0 : SECTION_DURATION * 0.6, ease: "easeOut" },
  };
}

// Stagger only on the way in. Cascading them out reads as hesitation when you
// are collapsing a section to get it out of the way.
export const LIST_VARIANTS = {
  open: { transition: { staggerChildren: 0.028, delayChildren: 0.05 } },
  closed: {},
};

export const ITEM_VARIANTS = {
  open: { opacity: 1, y: 0 },
  closed: { opacity: 0, y: -6 },
};

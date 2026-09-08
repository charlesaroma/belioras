/**
 * Grid density options and their column classes.
 *
 * Each selection renders exactly its column count from `sm` up. The prototype's
 * earlier attempt prefixed 4 and 6 with `xl:` and 3 with `lg:`, so picking "4"
 * on a laptop silently gave you 2 — the control lied about what it did.
 *
 * Phones default to two columns, but the choice between one and two is the
 * shopper's: GridViewSwitcher renders a mobile-only group below `md` for it.
 */
export const COLUMN_CLASSES = {
  2: "grid-cols-2",
  3: "grid-cols-2 sm:grid-cols-3",
  4: "grid-cols-2 sm:grid-cols-4",
  6: "grid-cols-2 sm:grid-cols-6",
  row: "grid-cols-1",
};

/**
 * Different option sets per breakpoint — the responsive column behaviour agreed
 * in the design review. Six columns is unreadable on a tablet, and a full-width
 * row view is what that size actually wants instead.
 *
 * Mobile only offers row (one per row) and 2 — three or more on a 375px screen
 * makes a card too narrow to read the price without zooming.
 */
export const MOBILE_COLUMN_OPTIONS = ["row", 2];
export const TABLET_COLUMN_OPTIONS = ["row", 2, 3];
export const DESKTOP_COLUMN_OPTIONS = [2, 4, 6];

export const DEFAULT_COLUMNS = 4;

/** Denser grids need tighter gutters or the cards lose their alignment. */
export const COLUMN_GAP_CLASSES = {
  2: "gap-x-4 gap-y-12 sm:gap-x-6 sm:gap-y-16",
  3: "gap-x-4 gap-y-12 sm:gap-x-8 sm:gap-y-20",
  4: "gap-x-4 gap-y-12 sm:gap-x-6 sm:gap-y-16",
  6: "gap-x-3 gap-y-8 sm:gap-x-4 sm:gap-y-12",
  row: "gap-y-10",
};

export function isValidColumns(value) {
  return value === "row" || [2, 3, 4, 6].includes(value);
}

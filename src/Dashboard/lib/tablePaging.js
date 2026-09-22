/** Rows-per-page choices every dashboard table offers. */
export const PAGE_SIZES = [10, 20, 30, 50];

/** Page numbers to show: the ends, the current page and one either side, with gaps. */
export function pageRange(current, count) {
  if (count <= 7) return Array.from({ length: count }, (_, i) => i);
  const middle = [current - 1, current, current + 1].filter((i) => i > 0 && i < count - 1);
  const pages = [0, ...middle, count - 1];
  return pages.flatMap((page, i) => (i > 0 && page - pages[i - 1] > 1 ? ["gap", page] : [page]));
}

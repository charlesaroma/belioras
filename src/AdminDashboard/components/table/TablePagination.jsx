/* Admin Dashboard: TablePagination */
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

import { cn } from "../../../utils/cn";
import { pageRange } from "../../lib/tablePaging";

const STEP = "flex size-10 items-center justify-center border border-umber-100 bg-ivory-50 text-espresso transition-colors hover:border-espresso disabled:pointer-events-none disabled:opacity-35";

export default function TablePagination({ table, total, unit, pageSizeOptions, onPageSizeChange }) {
  const { pageIndex, pageSize } = table.getState().pagination;
  // At least one page, so the bar reads the same on every list, however short.
  const pageCount = Math.max(1, table.getPageCount());
  const from = total === 0 ? 0 : pageIndex * pageSize + 1;
  const to = Math.min(total, (pageIndex + 1) * pageSize);

  return (
    <div className="mt-4 flex shrink-0 flex-wrap items-center justify-between gap-x-6 gap-y-3">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[12px] text-espresso-soft">
        <p aria-live="polite">
          Showing <span className="tabular-nums text-espresso">{from}–{to}</span> of{" "}
          <span className="tabular-nums text-espresso">{total}</span> {unit}
        </p>
        {pageSizeOptions?.length > 0 && (
          <label className="flex items-center gap-2">
            Rows per page
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="h-9 border border-umber-100 bg-ivory-50 px-2 text-[12px] text-espresso focus:border-espresso focus:outline-none"
            >
              {pageSizeOptions.map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </label>
        )}
      </div>

        <nav aria-label="Pages" className="flex items-center gap-1">
          <button type="button" className={cn(STEP, "hidden sm:flex")} onClick={() => table.firstPage()} disabled={!table.getCanPreviousPage()} aria-label="First page">
            <ChevronsLeft className="size-4" aria-hidden="true" />
          </button>
          <button type="button" className={STEP} onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} aria-label="Previous page">
            <ChevronLeft className="size-4" aria-hidden="true" />
          </button>

          {/* Numbers from sm; a phone gets the short form between the arrows. */}
          <span className="px-3 text-[12px] tabular-nums text-espresso-soft sm:hidden">
            {pageIndex + 1} / {pageCount}
          </span>
          <ol className="hidden items-center gap-1 sm:flex">
            {pageRange(pageIndex, pageCount).map((page, i) =>
              page === "gap" ? (
                <li key={`gap-${i}`} aria-hidden="true" className="w-6 text-center text-espresso-soft">…</li>
              ) : (
                <li key={page}>
                  <button
                    type="button"
                    onClick={() => table.setPageIndex(page)}
                    aria-current={page === pageIndex ? "page" : undefined}
                    aria-label={`Page ${page + 1}`}
                    className={cn(
                      STEP,
                      "min-w-10 w-auto px-2 text-[12px] tabular-nums",
                      page === pageIndex && "border-espresso bg-espresso text-ivory-50 hover:border-espresso",
                    )}
                  >
                    {page + 1}
                  </button>
                </li>
              ),
            )}
          </ol>

          <button type="button" className={STEP} onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} aria-label="Next page">
            <ChevronRight className="size-4" aria-hidden="true" />
          </button>
          <button type="button" className={cn(STEP, "hidden sm:flex")} onClick={() => table.lastPage()} disabled={!table.getCanNextPage()} aria-label="Last page">
            <ChevronsRight className="size-4" aria-hidden="true" />
          </button>
        </nav>
    </div>
  );
}

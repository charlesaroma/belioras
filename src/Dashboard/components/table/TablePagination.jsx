
/* Table Pagination */
export default function TablePagination({ table, pageCount, total, unit }) {
  if (pageCount <= 1) {
    return (
      <p className="mt-4 text-[11px] uppercase tracking-[0.14em] text-espresso-soft">
        {total} {unit}
      </p>
    );
  }

  return (
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
      <p className="text-[11px] uppercase tracking-[0.14em] text-espresso-soft">
        Page {table.getState().pagination.pageIndex + 1} of {pageCount} · {total} {unit}
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="btn btn-sm btn-secondary"
        >
          Previous
        </button>
        <button
          type="button"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="btn btn-sm btn-secondary"
        >
          Next
        </button>
      </div>
    </div>
  );
}

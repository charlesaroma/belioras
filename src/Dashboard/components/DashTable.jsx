import { useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";

import EmptyState from "../../components/ui/EmptyState";
import { cn } from "../../utils/cn";

/**
 * The admin table, on TanStack Table.
 *
 * Headless, so the markup below is still ours — square corners, hairlines, the
 * brand type scale. What TanStack takes over is the part that was hand-rolled
 * and duplicated: sorting, filtering, pagination and row selection, which lived
 * in a bespoke useDashList hook that every list page imported separately.
 *
 * Sorting and filtering run over the whole set before the page is sliced, so
 * "sort by price" means the cheapest piece in the catalogue, not the cheapest
 * on the page you happen to be looking at. That was true of the old hook and
 * is worth stating because it is the easy thing to get wrong.
 *
 * `getRowId` keys selection on the record's own id rather than its index, so a
 * selection survives a sort or a filter change instead of silently jumping to
 * whichever rows now occupy those positions.
 */
export default function DashTable({
  columns,
  data,
  loading = false,
  globalFilter = "",
  enableSelection = false,
  onSelectionChange,
  onRowClick,
  empty,
  unit = "rows",
  pageSize = 25,
  initialSorting = [],
  skeletonRows = 6,
}) {
  const [sorting, setSorting] = useState(initialSorting);
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data: data ?? [],
    columns,
    state: { sorting, globalFilter, rowSelection },
    onSortingChange: setSorting,
    onRowSelectionChange: (updater) => {
      const next = typeof updater === "function" ? updater(rowSelection) : updater;
      setRowSelection(next);
      onSelectionChange?.(Object.keys(next).filter((id) => next[id]));
    },
    enableRowSelection: enableSelection,
    getRowId: (row, index) => row.id ?? String(index),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize } },
    autoResetPageIndex: true,
  });

  const rows = table.getRowModel().rows;
  const total = table.getFilteredRowModel().rows.length;
  const pageCount = table.getPageCount();

  if (!loading && total === 0 && empty) {
    return <EmptyState {...empty} />;
  }

  return (
    <div>
      <div className="overflow-x-auto border border-umber-50 bg-ivory-50">
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b border-umber-50">
                {enableSelection && (
                  <th scope="col" className="w-10 px-4 py-3">
                    <input
                      type="checkbox"
                      checked={table.getIsAllPageRowsSelected()}
                      // Indeterminate is a DOM property, not an attribute, so
                      // it has to be set on the node itself.
                      ref={(el) => {
                        if (el) el.indeterminate = table.getIsSomePageRowsSelected();
                      }}
                      onChange={table.getToggleAllPageRowsSelectedHandler()}
                      aria-label="Select all rows on this page"
                      className="size-3.5 accent-espresso"
                    />
                  </th>
                )}

                {headerGroup.headers.map((header) => {
                  const canSort = header.column.getCanSort();
                  const direction = header.column.getIsSorted();
                  const Icon = !direction ? ChevronsUpDown : direction === "asc" ? ArrowUp : ArrowDown;
                  const align = header.column.columnDef.meta?.align;

                  return (
                    <th
                      key={header.id}
                      scope="col"
                      className={cn(
                        "whitespace-nowrap px-6 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.18em] text-espresso-soft",
                        align === "right" && "text-right",
                      )}
                    >
                      {header.isPlaceholder ? null : canSort ? (
                        <button
                          type="button"
                          onClick={header.column.getToggleSortingHandler()}
                          aria-label={`Sort by ${header.column.columnDef.header}`}
                          className={cn(
                            "inline-flex items-center gap-1.5 transition-colors hover:text-espresso",
                            direction && "text-espresso",
                          )}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          <Icon className="size-3" aria-hidden="true" />
                        </button>
                      ) : (
                        flexRender(header.column.columnDef.header, header.getContext())
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>

          <tbody>
            {loading
              ? Array.from({ length: skeletonRows }).map((_, i) => (
                  <tr key={i} className="border-b border-umber-50/60" aria-hidden="true">
                    {enableSelection && <td className="px-4 py-4" />}
                    {columns.map((column, c) => (
                      <td key={column.id ?? column.accessorKey ?? c} className="px-6 py-4">
                        <div className="skeleton h-3 w-24" />
                      </td>
                    ))}
                  </tr>
                ))
              : rows.map((row) => (
                  <tr
                    key={row.id}
                    onClick={() => onRowClick?.(row.original)}
                    className={cn(
                      "border-b border-umber-50/60 transition-colors last:border-b-0 hover:bg-brown-50/40",
                      onRowClick && "cursor-pointer",
                      row.getIsSelected() && "bg-gold-500/[0.06]",
                    )}
                  >
                    {enableSelection && (
                      <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={row.getIsSelected()}
                          disabled={!row.getCanSelect()}
                          onChange={row.getToggleSelectedHandler()}
                          aria-label={`Select ${row.original.name ?? row.id}`}
                          className="size-3.5 accent-espresso"
                        />
                      </td>
                    )}

                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className={cn(
                          "px-6 py-4 text-[13px] text-espresso",
                          cell.column.columnDef.meta?.align === "right" && "text-right",
                        )}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      {/* Pagination is part of the table rather than a sibling the page has to
          remember to render and keep in step. */}
      {pageCount > 1 ? (
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
      ) : (
        <p className="mt-4 text-[11px] uppercase tracking-[0.14em] text-espresso-soft">
          {total} {unit}
        </p>
      )}
    </div>
  );
}

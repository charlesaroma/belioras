/* Admin Dashboard: DashTable */
import { useState } from "react";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import EmptyState from "../../components/ui/EmptyState";
import TableHead from "./table/TableHead";
import TableBody from "./table/TableBody";
import TablePagination from "./table/TablePagination";

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

  const total = table.getFilteredRowModel().rows.length;
  const pageCount = table.getPageCount();

  if (!loading && total === 0 && empty) {
    return <EmptyState {...empty} />;
  }

  return (
    <div>
      <div className="overflow-x-auto border border-umber-50 bg-ivory-50">
        <table className="w-full">
          <TableHead table={table} enableSelection={enableSelection} />
          <TableBody
            table={table}
            columns={columns}
            loading={loading}
            skeletonRows={skeletonRows}
            enableSelection={enableSelection}
            onRowClick={onRowClick}
          />
        </table>
      </div>

      <TablePagination table={table} pageCount={pageCount} total={total} unit={unit} />
    </div>
  );
}

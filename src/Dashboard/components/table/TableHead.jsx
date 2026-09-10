/* Admin Dashboard: TableHead */
import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";
import { flexRender } from "@tanstack/react-table";

import { cn } from "../../../utils/cn";

export default function TableHead({ table, enableSelection }) {
  return (
    <thead>
      {table.getHeaderGroups().map((headerGroup) => (
        <tr key={headerGroup.id} className="border-b border-umber-50">
          {enableSelection && (
            <th scope="col" className="w-10 px-4 py-3">
              <input
                type="checkbox"
                checked={table.getIsAllPageRowsSelected()}
                // Indeterminate is a DOM property, not an attribute, so it has
                // to be set on the node itself.
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

            return (
              <th
                key={header.id}
                scope="col"
                className={cn(
                  "whitespace-nowrap px-6 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.18em] text-espresso-soft",
                  header.column.columnDef.meta?.align === "right" && "text-right",
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
  );
}

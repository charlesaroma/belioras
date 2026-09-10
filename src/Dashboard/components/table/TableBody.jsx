import { flexRender } from "@tanstack/react-table";

import { cn } from "../../../utils/cn";

/** Rows, or a skeleton of the same shape while the data loads. */
export default function TableBody({ table, columns, loading, skeletonRows, enableSelection, onRowClick }) {
  if (loading) {
    return (
      <tbody>
        {Array.from({ length: skeletonRows }).map((_, i) => (
          <tr key={i} className="border-b border-umber-50/60" aria-hidden="true">
            {enableSelection && <td className="px-4 py-4" />}
            {columns.map((column, c) => (
              <td key={column.id ?? column.accessorKey ?? c} className="px-6 py-4">
                <div className="skeleton h-3 w-24" />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    );
  }

  return (
    <tbody>
      {table.getRowModel().rows.map((row) => (
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
  );
}

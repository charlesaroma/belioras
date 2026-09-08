import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";

import EmptyState from "../../components/ui/EmptyState";
import { cn } from "../../utils/cn";

/**
 * The admin table.
 *
 * The original was 36 lines that rendered rows and nothing else: no empty
 * state, so a filtered-to-nothing table drew its header over blank space; no
 * loading state, so it flashed empty before data arrived; and no sorting or
 * selection, while every page above it advertised a Filter button that did
 * nothing.
 *
 * Sorting and selection are controlled from the page rather than held here,
 * because the page owns the data and has to sort the whole set — sorting only
 * the current page of rows would be a lie.
 *
 * Square corners and hairlines to match the shell and Overview; the rounded,
 * shadowed language this used to carry belonged to the older half of the
 * dashboard.
 */
export default function DashTable({
  columns,
  data,
  onRowClick,
  loading = false,
  sort,
  onSortChange,
  selectable = false,
  selectedIds = [],
  onSelectionChange,
  empty,
  skeletonRows = 6,
}) {
  const selected = new Set(selectedIds);
  const allOnPageSelected = data.length > 0 && data.every((row) => selected.has(row.id));

  const toggleAll = () => {
    if (!onSelectionChange) return;
    onSelectionChange(allOnPageSelected ? [] : data.map((row) => row.id));
  };

  const toggleOne = (id) => {
    if (!onSelectionChange) return;
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    onSelectionChange([...next]);
  };

  const headerCell = (column) => {
    if (!column.sortable || !onSortChange) return column.label;

    const active = sort?.key === column.key;
    const Icon = !active ? ChevronsUpDown : sort.direction === "asc" ? ArrowUp : ArrowDown;

    return (
      <button
        type="button"
        onClick={() =>
          onSortChange({
            key: column.key,
            direction: active && sort.direction === "asc" ? "desc" : "asc",
          })
        }
        className={cn(
          "inline-flex items-center gap-1.5 transition-colors hover:text-espresso",
          active && "text-espresso",
        )}
        aria-label={`Sort by ${column.label}`}
      >
        {column.label}
        <Icon className="size-3" aria-hidden="true" />
      </button>
    );
  };

  if (!loading && data.length === 0 && empty) {
    return <EmptyState {...empty} />;
  }

  return (
    <div className="overflow-x-auto border border-umber-50 bg-ivory-50">
      <table className="w-full">
        <thead>
          <tr className="border-b border-umber-50">
            {selectable && (
              <th scope="col" className="w-10 px-4 py-3">
                <input
                  type="checkbox"
                  checked={allOnPageSelected}
                  onChange={toggleAll}
                  aria-label="Select all rows"
                  className="size-3.5 accent-espresso"
                />
              </th>
            )}
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className={cn(
                  "whitespace-nowrap px-6 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.18em] text-espresso-soft",
                  column.align === "right" && "text-right",
                )}
              >
                {headerCell(column)}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {loading
            ? Array.from({ length: skeletonRows }).map((_, i) => (
                <tr key={i} className="border-b border-umber-50/60" aria-hidden="true">
                  {selectable && <td className="px-4 py-4" />}
                  {columns.map((column) => (
                    <td key={column.key} className="px-6 py-4">
                      <div className="skeleton h-3 w-24" />
                    </td>
                  ))}
                </tr>
              ))
            : data.map((row, index) => (
                <tr
                  key={row.id ?? index}
                  onClick={() => onRowClick?.(row)}
                  className={cn(
                    "border-b border-umber-50/60 transition-colors last:border-b-0 hover:bg-brown-50/40",
                    onRowClick && "cursor-pointer",
                    selected.has(row.id) && "bg-gold-500/[0.06]",
                  )}
                >
                  {selectable && (
                    <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selected.has(row.id)}
                        onChange={() => toggleOne(row.id)}
                        aria-label={`Select ${row.name ?? row.id}`}
                        className="size-3.5 accent-espresso"
                      />
                    </td>
                  )}
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={cn(
                        "px-6 py-4 text-[13px] text-espresso",
                        column.align === "right" && "text-right",
                      )}
                    >
                      {column.render ? column.render(row) : row[column.key]}
                    </td>
                  ))}
                </tr>
              ))}
        </tbody>
      </table>
    </div>
  );
}

/* Admin Dashboard Page: Categories - CategoriesTree */
import { useMemo, useState } from "react";
import { ChevronDown, Pencil, Shapes, Trash2 } from "lucide-react";

import EmptyState from "@/components/ui/EmptyState";
import IconAction from "@/Dashboard/components/IconAction";
import { cn } from "@/utils/cn";

/**
 * Categories and their types, as one hierarchy — Dresses holding Jumpsuits,
 * Two-Piece Sets and Coats & Jackets; Accessories holding Heels, Handbags and
 * the rest — rather than a flat table with a "Types" column squeezed into
 * one cell. A type belongs to exactly one category, so this two-level tree is
 * the whole shape: no category nests inside another.
 */
export default function CategoriesTree({ categories, usage, typeUsage, query, onEdit, onDelete }) {
  const [expanded, setExpanded] = useState(new Set());

  const q = query.trim().toLowerCase();
  const rows = useMemo(() => {
    if (!q) return categories;
    return categories.filter(
      (c) => c.name.toLowerCase().includes(q) || (c.types ?? []).some((t) => t.name.toLowerCase().includes(q)),
    );
  }, [categories, q]);

  // A search match opens its category, so a found type is not hidden behind a collapsed row.
  const isOpen = (id) => q.length > 0 || expanded.has(id);
  const toggle = (id) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  if (!rows.length) {
    return (
      <EmptyState
        icon={Shapes}
        title={q ? "Nothing matches" : "No categories yet"}
        description={q ? "Try a different search." : "Add the first, such as Dresses."}
      />
    );
  }

  return (
    <ul className="space-y-2">
      {rows.map((category) => {
        const types = (category.types ?? []).filter((t) => !q || t.name.toLowerCase().includes(q) || category.name.toLowerCase().includes(q));
        const open = isOpen(category.id);
        return (
          <li key={category.id} className="border border-umber-50 bg-ivory-50">
            <div className="flex items-center gap-2 px-4 py-3">
              <button
                type="button"
                onClick={() => toggle(category.id)}
                disabled={!category.types?.length}
                aria-expanded={open}
                aria-label={category.types?.length ? `${open ? "Collapse" : "Expand"} ${category.name}` : undefined}
                className="flex min-w-0 flex-1 items-center gap-3 text-left disabled:cursor-default"
              >
                <ChevronDown
                  className={cn(
                    "size-4 shrink-0 text-espresso/40 transition-transform",
                    open && "rotate-180",
                    !category.types?.length && "invisible",
                  )}
                  aria-hidden="true"
                />
                <span className="min-w-0">
                  <span className="block truncate font-medium text-espresso">{category.name}</span>
                  <span className="block truncate text-[12px] text-espresso-soft">
                    {category.types?.length
                      ? `${category.types.length} ${category.types.length === 1 ? "subcategory" : "subcategories"}`
                      : "No subcategories"}
                  </span>
                </span>
                <span className="ml-auto shrink-0 text-[11px] tabular-nums text-espresso-soft">
                  {usage?.[category.id] ?? 0} products
                </span>
              </button>

              <div className="flex shrink-0 items-center">
                <IconAction label={`Edit ${category.name}`} icon={Pencil} onClick={() => onEdit(category)} />
                <IconAction label={`Delete ${category.name}`} icon={Trash2} destructive onClick={() => onDelete(category)} />
              </div>
            </div>

            {open && types.length > 0 && (
              <ul className="space-y-1 border-t border-umber-50 px-4 py-3 pl-[3.25rem]">
                {types.map((type) => (
                  <li key={type.id} className="flex items-center justify-between gap-3 py-1 text-[13px]">
                    <span className="min-w-0 truncate text-espresso">{type.name}</span>
                    <span className="shrink-0 tabular-nums text-espresso-soft">
                      {typeUsage?.[`${category.id}:${type.id}`] ?? 0} products
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </li>
        );
      })}
    </ul>
  );
}

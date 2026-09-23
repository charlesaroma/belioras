/* Admin Dashboard Page: Categories - CategoriesTree */
import { useMemo, useState } from "react";
import { ChevronDown, Pencil, Shapes, Trash2 } from "lucide-react";

import EmptyState from "@/components/ui/EmptyState";
import IconAction from "@/AdminDashboard/components/IconAction";
import { cn } from "@/utils/cn";

/**
 * Categories and what's under them, as one hierarchy rather than a flat
 * table. Two separate things nest inside a category: its own `types`
 * (Dresses holding Jumpsuits, Two-Piece Sets…, product-taggable), and its
 * `subcategories` — a category's own "Shop by …" groups (Shop by Occasion,
 * Shop by Fabric…), each holding its own types one level deeper. No category
 * nests inside another.
 */
export default function CategoriesTree({ categories, usage, typeUsage, query, onEdit, onDelete }) {
  const [expanded, setExpanded] = useState(new Set());

  const q = query.trim().toLowerCase();
  const rows = useMemo(() => {
    if (!q) return categories;
    return categories.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (c.types ?? []).some((t) => t.name.toLowerCase().includes(q)) ||
        (c.subcategories ?? []).some(
          (s) => s.name.toLowerCase().includes(q) || (s.types ?? []).some((t) => t.name.toLowerCase().includes(q)),
        ),
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
        const matches = (name) => !q || name.toLowerCase().includes(q) || category.name.toLowerCase().includes(q);
        // Once a category has its own subcategories, its flat `types` list
        // (still the real, product-taggable field — untouched, see
        // CategoryDialog) would only repeat what "Shop by Category" already
        // shows here, so this read-only tree stops listing it separately.
        const hasSubcategories = (category.subcategories?.length ?? 0) > 0;
        const types = hasSubcategories ? [] : (category.types ?? []).filter((t) => matches(t.name));
        const subcategories = (category.subcategories ?? [])
          .map((s) => ({ ...s, types: (s.types ?? []).filter((t) => matches(t.name)) }))
          .filter((s) => matches(s.name) || s.types.length > 0);
        const hasChildren = types.length > 0 || subcategories.length > 0;
        const open = isOpen(category.id);
        const subcategoryTypeCount = (category.subcategories ?? []).reduce((n, s) => n + (s.types?.length ?? 0), 0);
        return (
          <li key={category.id} className="border border-umber-50 bg-ivory-50">
            <div className="flex items-center gap-2 px-4 py-3">
              <button
                type="button"
                onClick={() => toggle(category.id)}
                disabled={!hasChildren}
                aria-expanded={open}
                aria-label={hasChildren ? `${open ? "Collapse" : "Expand"} ${category.name}` : undefined}
                className="flex min-w-0 flex-1 items-center gap-3 text-left disabled:cursor-default"
              >
                <ChevronDown
                  className={cn(
                    "size-4 shrink-0 text-espresso/40 transition-transform",
                    open && "rotate-180",
                    !hasChildren && "invisible",
                  )}
                  aria-hidden="true"
                />
                <span className="min-w-0">
                  <span className="block truncate font-medium text-espresso">{category.name}</span>
                  <span className="block truncate text-[12px] text-espresso-soft">
                    {[
                      !hasSubcategories && category.types?.length
                        ? `${category.types.length} ${category.types.length === 1 ? "type" : "types"}`
                        : null,
                      hasSubcategories
                        ? `${category.subcategories.length} ${category.subcategories.length === 1 ? "subcategory" : "subcategories"} (${subcategoryTypeCount} types)`
                        : null,
                    ]
                      .filter(Boolean)
                      .join(" · ") || "Nothing set up yet"}
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

            {open && hasChildren && (
              <div className="border-t border-umber-50 px-4 py-4 pl-[3.25rem]">
                {types.length > 0 && (
                  <ul className={cn("space-y-1", subcategories.length > 0 && "mb-5")}>
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

                {/* A category can have many "Shop by …" groups (Dresses has
                    five), each short — a single stacked column left most of
                    a wide admin screen empty, so the groups lay out side by
                    side and wrap, same idea as the storefront mega menu's
                    own columns. */}
                {subcategories.length > 0 && (
                  <div className="grid grid-cols-2 gap-x-8 gap-y-5 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">
                    {subcategories.map((sub) => (
                      <div key={sub.id} className="min-w-0">
                        <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-gold-700">{sub.name}</p>
                        <ul className="mt-1 space-y-1">
                          {sub.types.map((type) => (
                            <li key={type.id} className="truncate py-0.5 text-[13px] text-espresso">
                              {type.name}
                            </li>
                          ))}
                          {sub.types.length === 0 && <li className="py-0.5 text-[13px] text-espresso-soft">No types yet</li>}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}

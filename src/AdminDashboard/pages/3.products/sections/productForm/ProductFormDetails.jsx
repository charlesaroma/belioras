/* Admin Dashboard Page: Products - ProductFormDetails */
import { useState } from "react";
import ChoiceChips from "@/AdminDashboard/components/ChoiceChips";
import { detailOptionsFrom } from "@/AdminDashboard/lib/catalogOptions";
import { cn } from "@/utils/cn";
import { subcategoryTag } from "./productFormPayload";

/**
 * Optional, but open by default. A category with its own Subcategories
 * (Shop by Category, Shop by Occasion…) drives this section on its own —
 * pick a subcategory, then pick its types, rather than every group and
 * every type poured out flat. The shared taxonomy dimensions (Occasion,
 * Fabric, Style…) only fill in for a category that has no Subcategories
 * of its own yet, so the same ground is never asked for twice.
 */
export default function ProductFormDetails({ category, taxonomy, tags, onChange }) {
  const [activeSub, setActiveSub] = useState(null);

  const subcategories = category?.subcategories ?? [];
  const dimensions = subcategories.length ? [] : detailOptionsFrom(taxonomy).filter((d) => category?.details?.includes(d.id));
  if (!dimensions.length && !subcategories.length) return null;

  const prefixes = new Set(dimensions.map((d) => d.prefix));
  const chosen = tags.filter((t) => prefixes.has(t.split(":")[0]) || t.split(":")[0] === "subcat").length;

  const toggle = (token) =>
    onChange((prev) => (prev.includes(token) ? prev.filter((t) => t !== token) : [...prev, token]));

  const current = subcategories.find((s) => s.id === activeSub) ?? null;

  return (
    <details open className="border border-umber-50 bg-ivory-50">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 [&::-webkit-details-marker]:hidden">
        <span>
          <span className="block font-display text-lg tracking-wide text-espresso">Shop by filters</span>
          <span className="mt-1 block text-[12px] leading-relaxed text-espresso-soft">
            Optional, but this is exactly what the storefront's "Shop by …" menu filters on — tag it here and the piece shows up there.
          </span>
        </span>
        <span className="shrink-0 text-[11px] uppercase tracking-[0.14em] text-espresso-soft">
          {chosen ? `${chosen} chosen` : "Add"}
        </span>
      </summary>
      <div className="space-y-5 border-t border-umber-50 p-5">
        {subcategories.length > 0 && (
          <div>
            <p className="input-label">Pick a group, then what applies within it</p>
            <div className="mt-1 flex flex-wrap gap-1.5">
              {subcategories.map((sub) => {
                const count = tags.filter((t) => t.startsWith(`subcat:${sub.id}:`)).length;
                const on = sub.id === activeSub;
                return (
                  <button
                    key={sub.id}
                    type="button"
                    aria-pressed={on}
                    onClick={() => setActiveSub(on ? null : sub.id)}
                    className={cn(
                      "inline-flex min-h-10 items-center gap-1.5 border px-3.5 text-[12px] tracking-[0.02em] transition-colors",
                      on
                        ? "border-gold-700 bg-gold-700 text-ivory-50"
                        : "border-umber-100 bg-ivory-50 text-espresso-soft hover:border-gold-700/50 hover:text-espresso",
                    )}
                  >
                    {sub.name}
                    {count > 0 && (
                      <span className={cn("text-[11px] tabular-nums", on ? "text-ivory-50/80" : "text-gold-700")}>
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {current && (
              <div className="mt-4">
                <ChoiceChips
                  options={current.types.map((t) => ({ id: subcategoryTag(current.id, t.id), label: t.name }))}
                  selected={tags}
                  onToggle={toggle}
                />
                {current.types.length === 0 && (
                  <p className="text-[13px] text-espresso-soft">No types under {current.name} yet.</p>
                )}
              </div>
            )}
          </div>
        )}

        {dimensions.map((d) => (
          <ChoiceChips
            key={d.id}
            label={`Shop by ${d.label}`}
            options={(taxonomy[d.id]?.values ?? []).map((v) => ({ id: `${d.prefix}:${v.id}`, label: v.name }))}
            selected={tags}
            onToggle={toggle}
          />
        ))}
      </div>
    </details>
  );
}

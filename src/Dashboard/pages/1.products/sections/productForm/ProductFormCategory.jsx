/* Admin Dashboard Page: Products - ProductFormCategory */
import { useState } from "react";
import { Plus } from "lucide-react";

import CategoryDialog from "@/Dashboard/components/CategoryDialog";
import { detailOptionsFrom, sizeLabel, sizeOptionsFrom } from "@/Dashboard/lib/catalogOptions";
import { createCategory } from "@/services/categoriesApi";
import { cn } from "@/utils/cn";
import FormSection from "./ProductFormSection";

function sizeSummary(category, taxonomy) {
  const sizes = category.sizes ?? [];
  if (!sizes.length) return "One size";
  if (sizes.length <= 2) return sizes.map((id) => sizeLabel(taxonomy, id)).join(", ");
  return `${sizeLabel(taxonomy, sizes[0])}–${sizeLabel(taxonomy, sizes.at(-1))}`;
}

export default function ProductFormCategory({ categories, value, type, taxonomy, onChange, onTypeChange, onCreated }) {
  const [dialog, setDialog] = useState({ open: false, n: 0 });
  const close = () => setDialog((d) => ({ ...d, open: false }));
  const chosen = categories.find((c) => c.id === value);

  const create = async (form) => {
    const category = await createCategory(form);
    close();
    onCreated(category);
  };

  return (
    <FormSection title="Category">
      <div role="radiogroup" aria-label="Category" className="divide-y divide-umber-50 border border-umber-50 bg-white">
        {categories.map((c) => {
          const on = c.id === value;
          return (
            <button
              key={c.id}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => onChange(c)}
              className={cn(
                "flex min-h-11 w-full items-center justify-between gap-3 px-3.5 text-left text-[14px] transition-colors",
                on ? "bg-espresso text-ivory-50" : "text-espresso hover:bg-brown-50/50",
              )}
            >
              <span className="flex items-center gap-2.5">
                <span aria-hidden="true" className={cn("size-2.5 rounded-full border", on ? "border-gold-400 bg-gold-400" : "border-umber-100")} />
                {c.name}
              </span>
              <span className={cn("text-[11px]", on ? "text-ivory-50/60" : "text-espresso-soft")}>{sizeSummary(c, taxonomy)}</span>
            </button>
          );
        })}
      </div>

      {chosen?.types?.length > 0 && (
        <div>
          <p className="input-label">
            Type <span className="font-normal normal-case tracking-normal text-espresso-soft">(optional)</span>
          </p>
          <div role="radiogroup" aria-label={`${chosen.name} type`} className="flex flex-wrap gap-1.5">
            {chosen.types.map((t) => {
              const on = t.id === type;
              return (
                <button
                  key={t.id}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  // Choosing the selected type again clears it.
                  onClick={() => onTypeChange(on ? "" : t.id)}
                  className={cn(
                    "inline-flex min-h-9 items-center border px-3 text-[12px] transition-colors",
                    on
                      ? "border-espresso bg-espresso text-ivory-50"
                      : "border-umber-100 bg-ivory-50 text-espresso-soft hover:border-espresso/50 hover:text-espresso",
                  )}
                >
                  {t.name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setDialog((d) => ({ open: true, n: d.n + 1 }))}
        className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-gold-700 transition-colors hover:text-espresso"
      >
        <Plus className="size-3.5" aria-hidden="true" />
        New category
      </button>

      <CategoryDialog key={dialog.n} open={dialog.open} sizeOptions={sizeOptionsFrom(taxonomy)} detailOptions={detailOptionsFrom(taxonomy)} onClose={close} onSave={create} />
    </FormSection>
  );
}

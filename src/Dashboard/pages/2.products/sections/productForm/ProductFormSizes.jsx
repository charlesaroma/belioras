/* Admin Dashboard Page: Products - ProductFormSizes */
import ChoiceChips from "@/Dashboard/components/ChoiceChips";
import { sizeLabel } from "@/Dashboard/lib/catalogOptions";

export default function ProductFormSizes({ category, taxonomy, sizes, onChange }) {
  const offered = category?.sizes ?? [];

  // Kept in the category's order, whatever order they were ticked in.
  const toggle = (id) => {
    const next = sizes.includes(id) ? sizes.filter((s) => s !== id) : [...sizes, id];
    onChange(offered.filter((s) => next.includes(s)));
  };

  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <p className="input-label">Sizes</p>
        {offered.length > 0 && (
          <div className="flex gap-4 text-[11px] uppercase tracking-[0.14em]">
            <button type="button" onClick={() => onChange(offered)} className="text-gold-700 transition-colors hover:text-espresso">
              Select all
            </button>
            {sizes.length > 0 && (
              <button type="button" onClick={() => onChange([])} className="text-espresso-soft transition-colors hover:text-espresso">
                Clear
              </button>
            )}
          </div>
        )}
      </div>

      {!category && <p className="text-[13px] text-espresso-soft">Choose a category to see its sizes.</p>}
      {category && offered.length === 0 && (
        <p className="text-[13px] text-espresso-soft">{category.name} pieces are one size.</p>
      )}
      {offered.length > 0 && (
        <ChoiceChips options={offered.map((id) => ({ id, label: sizeLabel(taxonomy, id) }))} selected={sizes} onToggle={toggle} />
      )}
    </div>
  );
}

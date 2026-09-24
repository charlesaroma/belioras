/* Admin Dashboard: CategorySubcategoriesField */
import { useState } from "react";
import { Plus, X } from "lucide-react";

import Button from "@/components/ui/Button";

/**
 * A category's own "Shop by …" groups — Shop by Occasion, Shop by Fabric,
 * Shop by Colour, and so on — each holding whatever types the admin lists
 * under it. Entirely this category's own: not the shared taxonomy, and not
 * Mega Menu (edited only at its own page). Purely organizational for now.
 */
export default function CategorySubcategoriesField({ subcategories, onChange }) {
  const [draft, setDraft] = useState("");
  const [typeDrafts, setTypeDrafts] = useState({});

  const renameSubcategory = (i, name) =>
    onChange(subcategories.map((s, j) => (j === i ? { ...s, name } : s)));

  const removeSubcategory = (i) => onChange(subcategories.filter((_, j) => j !== i));

  const addSubcategory = () => {
    const name = draft.trim();
    if (!name) return;
    onChange([...subcategories, { id: null, name, types: [] }]);
    setDraft("");
  };

  const renameType = (i, ti, name) =>
    onChange(
      subcategories.map((s, j) => (j === i ? { ...s, types: s.types.map((t, k) => (k === ti ? { ...t, name } : t)) } : s)),
    );

  const removeType = (i, ti) =>
    onChange(subcategories.map((s, j) => (j === i ? { ...s, types: s.types.filter((_, k) => k !== ti) } : s)));

  const addType = (i) => {
    const name = (typeDrafts[i] ?? "").trim();
    if (!name) return;
    onChange(subcategories.map((s, j) => (j === i ? { ...s, types: [...s.types, { id: null, name }] } : s)));
    setTypeDrafts((d) => ({ ...d, [i]: "" }));
  };

  return (
    <div>
      <p className="input-label">Subcategories</p>
      <p className="mb-2.5 text-[12px] leading-relaxed text-espresso-soft">
        This category's own "Shop by …" groups, such as Shop by Occasion or Shop by Fabric, and the types under
        each.
      </p>

      {subcategories.length > 0 && (
        <ul className="mb-3 space-y-3">
          {subcategories.map((sub, i) => (
            <li key={sub.id ?? `new-${i}`} className="border border-umber-50 bg-white p-3">
              <div className="flex items-center gap-2">
                <input
                  value={sub.name}
                  aria-label={`Subcategory ${i + 1} name`}
                  onChange={(e) => renameSubcategory(i, e.target.value)}
                  className="input h-10 flex-1 py-2 text-[13px] font-medium"
                />
                <button
                  type="button"
                  aria-label={`Remove ${sub.name}`}
                  onClick={() => removeSubcategory(i)}
                  className="flex size-10 shrink-0 items-center justify-center rounded-full text-espresso/40 transition-colors hover:text-error liquid-hover"
                >
                  <X className="liquid-icon size-4" aria-hidden="true" />
                </button>
              </div>

              {sub.types.length > 0 && (
                <ul className="mt-2 space-y-1.5 pl-4">
                  {sub.types.map((type, ti) => (
                    <li key={type.id ?? `new-${ti}`} className="flex items-center gap-2">
                      <input
                        value={type.name}
                        aria-label={`${sub.name} type ${ti + 1} name`}
                        onChange={(e) => renameType(i, ti, e.target.value)}
                        className="input h-9 flex-1 py-1.5 text-[13px]"
                      />
                      <button
                        type="button"
                        aria-label={`Remove ${type.name}`}
                        onClick={() => removeType(i, ti)}
                        className="flex size-9 shrink-0 items-center justify-center rounded-full text-espresso/40 transition-colors hover:text-error liquid-hover"
                      >
                        <X className="liquid-icon size-3.5" aria-hidden="true" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-2 flex gap-2 pl-4">
                <input
                  value={typeDrafts[i] ?? ""}
                  aria-label={`Add a type to ${sub.name}`}
                  placeholder="Add a type, such as Satin Dresses"
                  onChange={(e) => setTypeDrafts((d) => ({ ...d, [i]: e.target.value }))}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addType(i);
                    }
                  }}
                  className="input h-9 flex-1 py-1.5 text-[13px]"
                />
                <Button
                  type="button"
                  variant="secondary"
                  icon={Plus}
                  onClick={() => addType(i)}
                  disabled={!typeDrafts[i]?.trim()}
                  className="h-9"
                >
                  Add
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="flex gap-2">
        <input
          value={draft}
          aria-label="New subcategory name"
          placeholder="Add a subcategory, such as Shop by Occasion"
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addSubcategory();
            }
          }}
          className="input h-10 flex-1 py-2 text-[13px]"
        />
        <Button variant="secondary" icon={Plus} onClick={addSubcategory} disabled={!draft.trim()} className="h-10">
          Add
        </Button>
      </div>
    </div>
  );
}

/* Admin Dashboard: CategoryDetailValuesField */
import { useState } from "react";
import { Plus } from "lucide-react";

import Button from "@/components/ui/Button";

/**
 * What falls under each detail this category asks for — e.g. once "Occasion"
 * is ticked, the actual Birthday/Party/Cocktail… values a product can pick
 * from. Renaming or removing a value stays on the Details tab; this is only
 * for seeing what's there and adding a new one without leaving Categories.
 */
export default function CategoryDetailValuesField({ dimensions, taxonomy, onAddValue }) {
  const [drafts, setDrafts] = useState({});
  const [busy, setBusy] = useState(null);
  const [error, setError] = useState(null);

  if (!dimensions.length) return null;

  const add = async (dimension) => {
    const name = (drafts[dimension] ?? "").trim();
    if (!name) return;
    setBusy(dimension);
    setError(null);
    try {
      await onAddValue(dimension, name);
      setDrafts((d) => ({ ...d, [dimension]: "" }));
    } catch (err) {
      setError({ dimension, message: err.message ?? "Could not add that." });
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="space-y-4 border-t border-umber-50 pt-4">
      <p className="input-label">What falls under them</p>
      {dimensions.map((d) => {
        const values = taxonomy?.[d.id]?.values ?? [];
        return (
          <div key={d.id}>
            <p className="mb-1.5 text-[12px] font-medium tracking-wide text-espresso">{d.label}</p>
            {values.length > 0 && (
              <div className="mb-2 flex flex-wrap gap-1.5">
                {values.map((v) => (
                  <span
                    key={v.id}
                    className="inline-flex min-h-8 items-center border border-umber-50 bg-ivory-50 px-3 text-[12px] text-espresso-soft"
                  >
                    {v.name}
                  </span>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <input
                value={drafts[d.id] ?? ""}
                aria-label={`Add a ${d.label.toLowerCase()} value`}
                placeholder={`Add a ${d.label.toLowerCase()} value`}
                onChange={(e) => setDrafts((prev) => ({ ...prev, [d.id]: e.target.value }))}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    add(d.id);
                  }
                }}
                className="input h-9 flex-1 py-1.5 text-[13px]"
              />
              <Button
                type="button"
                variant="secondary"
                icon={Plus}
                loading={busy === d.id}
                disabled={!drafts[d.id]?.trim()}
                onClick={() => add(d.id)}
                className="h-9"
              >
                Add
              </Button>
            </div>
            {error?.dimension === d.id && <p className="mt-1 text-[12px] text-error">{error.message}</p>}
          </div>
        );
      })}
    </div>
  );
}

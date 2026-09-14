/* Admin Dashboard: CategoryTypesField */
import { useState } from "react";
import { Plus, X } from "lucide-react";

import Button from "@/components/ui/Button";

/** The types within a category: rename in place, remove, or add a new one. */
export default function CategoryTypesField({ types, onChange }) {
  const [draft, setDraft] = useState("");

  const add = () => {
    const name = draft.trim();
    if (!name) return;
    onChange([...types, { id: null, name }]);
    setDraft("");
  };

  return (
    <div>
      <p className="input-label">Types</p>
      <p className="mb-2.5 text-[12px] leading-relaxed text-espresso-soft">
        Optional kinds within the category, such as Heels or Handbags. A product can pick one, and the menu can
        link to it.
      </p>

      {types.length > 0 && (
        <ul className="mb-2 space-y-1.5">
          {types.map((type, i) => (
            <li key={type.id ?? `new-${i}`} className="flex items-center gap-2">
              <input
                value={type.name}
                aria-label={`Type ${i + 1} name`}
                onChange={(e) => onChange(types.map((t, j) => (j === i ? { ...t, name: e.target.value } : t)))}
                className="input h-10 flex-1 py-2 text-[13px]"
              />
              <button
                type="button"
                aria-label={`Remove ${type.name}`}
                onClick={() => onChange(types.filter((_, j) => j !== i))}
                className="flex size-10 shrink-0 items-center justify-center text-espresso/40 transition-colors hover:text-error"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="flex gap-2">
        <input
          value={draft}
          aria-label="New type name"
          placeholder="Add a type, such as Heels"
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          className="input h-10 flex-1 py-2 text-[13px]"
        />
        <Button variant="secondary" icon={Plus} onClick={add} disabled={!draft.trim()} className="h-10">
          Add
        </Button>
      </div>
    </div>
  );
}

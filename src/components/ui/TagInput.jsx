/* Ui Component: TagInput */
import { useId, useState } from "react";
import { Plus, X } from "lucide-react";

import { cn } from "../../utils/cn";

export default function TagInput({
  values = [],
  onChange,
  placeholder = "Type and press Enter",
  label,
  className,
}) {
  const [draft, setDraft] = useState("");
  const id = useId();

  const add = (raw) => {
    const value = raw.trim();
    if (!value) return;
    // Case-insensitive dedupe: "Black" and "black" are one colour.
    if (values.some((v) => v.toLowerCase() === value.toLowerCase())) {
      setDraft("");
      return;
    }
    onChange([...values, value]);
    setDraft("");
  };

  const removeAt = (i) => onChange(values.filter((_, idx) => idx !== i));

  const onKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      add(draft);
      return;
    }
    if (e.key === "Backspace" && !draft && values.length) {
      removeAt(values.length - 1);
    }
  };

  return (
    <div className={cn("flex flex-col", className)}>
      {label && (
        <label htmlFor={id} className="input-label">
          {label}
        </label>
      )}

      <div className="flex gap-2">
        <input
          id={id}
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKeyDown}
          onBlur={() => add(draft)}
          placeholder={placeholder}
          className="input flex-1"
        />
        <button
          type="button"
          onClick={() => add(draft)}
          disabled={!draft.trim()}
          aria-label={label ? `Add ${label.toLowerCase()}` : "Add"}
          className="btn btn-md btn-secondary shrink-0"
        >
          <Plus className="size-4" aria-hidden="true" />
        </button>
      </div>

      {values.length > 0 && (
        <ul className="mt-2.5 flex flex-wrap gap-1.5">
          {values.map((value, i) => (
            <li key={value}>
              <span className="inline-flex items-center gap-1.5 border border-umber-50 bg-brown-50/50 py-1 pl-2.5 pr-1.5 text-[12px] text-espresso">
                {value}
                <button
                  type="button"
                  onClick={() => removeAt(i)}
                  aria-label={`Remove ${value}`}
                  className="text-espresso/35 transition-colors hover:text-error"
                >
                  <X className="size-3.5" aria-hidden="true" />
                </button>
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

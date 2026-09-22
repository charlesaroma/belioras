/* Admin Dashboard Page: Newsletter - CampaignProductsField */
import { useState } from "react";
import { X } from "lucide-react";

const MAX = 4;

/** Up to four pieces to feature in a campaign, found by name. */
export default function CampaignProductsField({ products, selected, onChange }) {
  const [query, setQuery] = useState("");

  const chosen = selected.map((id) => products.find((p) => p.id === id)).filter(Boolean);
  const term = query.trim().toLowerCase();
  const results = term
    ? products.filter((p) => !selected.includes(p.id) && p.name.toLowerCase().includes(term)).slice(0, 6)
    : [];
  const full = selected.length >= MAX;

  return (
    <div>
      <p className="input-label">
        Featured pieces <span className="font-normal normal-case tracking-normal text-espresso-soft">(up to {MAX})</span>
      </p>

      {chosen.length > 0 && (
        <ul className="mb-2 flex flex-wrap gap-2">
          {chosen.map((p) => (
            <li key={p.id} className="flex items-center gap-2 border border-umber-100 bg-white py-1 pl-1 pr-2 text-[12px] text-espresso">
              {p.images?.[0] && <img src={p.images[0]} alt="" className="size-8 object-cover" />}
              <span className="max-w-40 truncate">{p.name}</span>
              <button
                type="button"
                aria-label={`Remove ${p.name}`}
                onClick={() => onChange(selected.filter((id) => id !== p.id))}
                className="text-espresso/40 transition-colors hover:text-error"
              >
                <X className="size-3.5" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <input
        type="search"
        value={query}
        disabled={full}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={full ? "Four pieces chosen" : "Search products to feature"}
        aria-label="Search products to feature"
        className="input w-full"
      />

      {results.length > 0 && (
        <ul className="mt-1 divide-y divide-umber-50 border border-umber-50 bg-white">
          {results.map((p) => (
            <li key={p.id}>
              <button
                type="button"
                onClick={() => {
                  onChange([...selected, p.id]);
                  setQuery("");
                }}
                className="flex w-full items-center gap-3 px-3 py-2 text-left text-[13px] text-espresso transition-colors hover:bg-brown-50/50"
              >
                {p.images?.[0] && <img src={p.images[0]} alt="" className="size-9 object-cover" />}
                {p.name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

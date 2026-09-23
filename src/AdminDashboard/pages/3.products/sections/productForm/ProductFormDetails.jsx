/* Admin Dashboard Page: Products - ProductFormDetails */
import ChoiceChips from "@/AdminDashboard/components/ChoiceChips";
import { detailOptionsFrom } from "@/AdminDashboard/lib/catalogOptions";

/** Optional, but open by default — these are the exact tags the storefront's "Shop by …" menu columns filter on. */
export default function ProductFormDetails({ category, taxonomy, tags, onChange }) {
  const dimensions = detailOptionsFrom(taxonomy).filter((d) => category?.details?.includes(d.id));
  if (!dimensions.length) return null;

  const prefixes = new Set(dimensions.map((d) => d.prefix));
  const chosen = tags.filter((t) => prefixes.has(t.split(":")[0])).length;

  const toggle = (token) =>
    onChange((prev) => (prev.includes(token) ? prev.filter((t) => t !== token) : [...prev, token]));

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

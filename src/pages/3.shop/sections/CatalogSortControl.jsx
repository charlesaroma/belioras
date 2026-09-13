/* Page: Shop - CatalogSortControl */
import { ChevronDown } from "lucide-react";

import { SORT_OPTIONS } from "./constants";

/**
 * The visible face is only the chosen order and a chevron, sized to its text.
 * A native select sizes itself to its longest option, which left "Newest"
 * floating in a box built for "Price: High to Low". The real select sits over
 * the face invisibly, so keyboards, screen readers and a phone's own picker
 * still get the native control.
 */
export default function CatalogSortControl({ value, onChange }) {
  const current = SORT_OPTIONS.find((option) => (option.value ?? option) === value);
  const label = current?.label ?? current ?? SORT_OPTIONS[0].label;

  return (
    <div className="relative inline-flex min-h-11 shrink-0 items-center gap-2 border border-espresso px-3 text-[11px] font-medium uppercase tracking-[0.18em] text-espresso transition-colors hover:bg-espresso hover:text-ivory-50 has-[:focus-visible]:bg-espresso has-[:focus-visible]:text-ivory-50 sm:px-4 lg:min-h-9">
      <span aria-hidden="true">{label}</span>
      <ChevronDown className="size-3.5" aria-hidden="true" />
      <select
        id="catalog-sort"
        aria-label="Sort by"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="absolute inset-0 w-full cursor-pointer appearance-none opacity-0 [&>option]:bg-ivory-50 [&>option]:text-espresso"
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value ?? option} value={option.value ?? option}>
            {option.label ?? option}
          </option>
        ))}
      </select>
    </div>
  );
}

/* Admin Dashboard: PageSizeSelect */
import { PAGE_SIZES } from "../lib/tablePaging";

/** "Show 20 ▾": how many rows a list shows per page. */
export default function PageSizeSelect({ value, onChange, options = PAGE_SIZES }) {
  return (
    <label className="flex h-12 shrink-0 items-center gap-2 text-[11px] uppercase tracking-[0.12em] text-espresso-soft">
      Show
      <select
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label="Rows per page"
        className="h-12 border border-umber-100 bg-ivory-50 pl-3 pr-8 text-[13px] tracking-normal text-espresso focus:border-espresso focus:outline-none"
      >
        {options.map((n) => (
          <option key={n} value={n}>{n}</option>
        ))}
      </select>
    </label>
  );
}

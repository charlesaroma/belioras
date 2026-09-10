/* Filter Checkbox */
import { Check } from "lucide-react";

export function ShopFilterCheckbox({ checked, label, onChange }) {
  return (
    <label className="flex min-h-11 min-w-0 cursor-pointer items-center gap-2.5 text-[13px] text-espresso-soft transition-colors hover:text-espresso lg:min-h-0">
      <NativeCheckbox checked={checked} onChange={onChange} />
      <span className="truncate">{label}</span>
    </label>
  );
}

export function NativeCheckbox({ checked, disabled, onChange }) {
  return (
    <span className="relative flex size-4 shrink-0 items-center justify-center">
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={onChange}
        className="peer absolute inset-0 appearance-none rounded-sm border border-umber-100 transition-colors checked:border-espresso checked:bg-espresso disabled:cursor-not-allowed"
      />
      <Check
        className="pointer-events-none relative size-3 text-ivory-50 opacity-0 transition-opacity peer-checked:opacity-100"
        aria-hidden="true"
      />
    </span>
  );
}

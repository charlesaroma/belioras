import { Minus, Plus } from "lucide-react";

export default function QuantitySelector({ value, onChange, min = 1, max = 99, disabled = false }) {
  function clamp(next) {
    return Math.min(Math.max(min, Math.floor(next)), max);
  }

  return (
    <div className="inline-flex items-stretch rounded-full border border-umber-100 bg-ivory-50">
      <button
        type="button"
        className="flex size-10 items-center justify-center rounded-l-full text-espresso transition-colors hover:text-gold-700 disabled:opacity-40"
        aria-label="Decrease quantity"
        disabled={disabled || value <= min}
        onClick={() => onChange(clamp(value - 1))}
      >
        <Minus className="size-4" aria-hidden="true" />
      </button>
      <output
        className="flex min-w-10 items-center justify-center text-sm font-medium tabular-nums text-espresso"
        aria-live="polite"
      >
        {value}
      </output>
      <button
        type="button"
        className="flex size-10 items-center justify-center rounded-r-full text-espresso transition-colors hover:text-gold-700 disabled:opacity-40"
        aria-label="Increase quantity"
        disabled={disabled || value >= max}
        onClick={() => onChange(clamp(value + 1))}
      >
        <Plus className="size-4" aria-hidden="true" />
      </button>
    </div>
  );
}
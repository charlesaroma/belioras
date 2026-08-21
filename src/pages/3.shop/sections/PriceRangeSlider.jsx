function PriceRangeSlider({ min, max, value, onChange }) {
  const [lo, hi] = value;
  return (
    <div className="px-1">
      <div className="flex justify-between text-xs text-espresso/60 mb-3">
        <span>€{lo}</span>
        <span>€{hi}</span>
      </div>
      <div className="relative h-1 bg-umber-50 rounded-full">
        <div
          className="absolute h-1 bg-espresso rounded-full"
          style={{ left: `${((lo - min) / (max - min)) * 100}%`, right: `${100 - ((hi - min) / (max - min)) * 100}%` }}
        />
        <input
          type="range" min={min} max={max} value={lo}
          onChange={(e) => { const v = Number(e.target.value); if (v < hi) onChange([v, hi]); }}
          className="absolute inset-0 w-full opacity-0 cursor-pointer h-1"
        />
        <input
          type="range" min={min} max={max} value={hi}
          onChange={(e) => { const v = Number(e.target.value); if (v > lo) onChange([lo, v]); }}
          className="absolute inset-0 w-full opacity-0 cursor-pointer h-1"
        />
      </div>
    </div>
  );
}

export default PriceRangeSlider;
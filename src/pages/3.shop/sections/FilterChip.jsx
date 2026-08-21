function FilterChip({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`cursor-pointer whitespace-nowrap rounded-full border px-4 py-1.5 text-[11px] font-semibold uppercase tracking-widest transition-all duration-200 ${
        active
          ? "border-espresso bg-espresso text-ivory-50"
          : "border-umber-50 bg-transparent text-espresso/70 hover:border-espresso hover:text-espresso"
      }`}
    >
      {label}
    </button>
  );
}

export default FilterChip;
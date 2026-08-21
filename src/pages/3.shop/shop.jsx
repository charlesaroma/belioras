import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAsyncData } from "../../hooks/useAsyncData";
import { getProducts } from "../../services/productsApi";
import ProductCard from "../../components/storefront/ProductCard";
import { X, ChevronDown, SlidersHorizontal } from "lucide-react";

// ─── Constants ────────────────────────────────────────────────────────────────
const COLOR_MAP = {
  Blush: "#f4bfb2", Burgundy: "#6b2d35", Caramel: "#c07f40", Champagne: "#f2d680",
  Chestnut: "#954535", "Dark Brown": "#3b1f0f", Ebony: "#2d2a26", Forest: "#2d4a35",
  Gold: "#c9a84c", "Honey Blonde": "#d4a847", Ivory: "#f8f5f0", "Jet Black": "#111111",
  "Natural Black": "#1c1a19", Rosewood: "#b05b6f", Sand: "#d4bc8f",
};

const CATEGORIES = ["All", "Dresses", "Hair", "Accessories"];
const STYLES = ["All", "Evening", "Everyday", "Midi", "Maxi", "Bags", "Jewelry", "Scarves", "Belts", "Straight", "Wavy"];
const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
  { value: "sale", label: "On Sale" },
];

// ─── FilterChip ───────────────────────────────────────────────────────────────
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

// ─── ColorDot ─────────────────────────────────────────────────────────────────
function ColorDot({ color, active, onClick }) {
  return (
    <button
      type="button"
      title={color}
      onClick={onClick}
      className={`cursor-pointer size-7 rounded-full border-2 transition-all duration-200 hover:scale-110 ${
        active ? "border-espresso scale-110 shadow-sm" : "border-transparent"
      }`}
      style={{ backgroundColor: COLOR_MAP[color] ?? "#ccc" }}
      aria-label={`Filter by ${color}${active ? " (active)" : ""}`}
      aria-pressed={active}
    />
  );
}

// ─── PriceRangeSlider ─────────────────────────────────────────────────────────
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

// ─── FilterPanel (slide-out drawer) ───────────────────────────────────────────
function FilterPanel({ open, onClose, filters, onChange, allColors, priceRange }) {
  const { colors, priceValue, style, onSale } = filters;

  const toggleColor = (c) => {
    const next = colors.includes(c) ? colors.filter((x) => x !== c) : [...colors, c];
    onChange({ colors: next });
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-espresso/30 backdrop-blur-sm"
            onClick={onClose}
          />
          {/* Panel */}
          <motion.aside
            initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-y-0 left-0 z-50 w-80 bg-ivory-50 shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-umber-50">
              <h2 className="text-sm font-bold uppercase tracking-widest text-espresso">Filters</h2>
              <button type="button" onClick={onClose} className="cursor-pointer text-espresso/50 hover:text-espresso transition-colors">
                <X className="size-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
              {/* Style / Category */}
              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-espresso/60 mb-4">Style</h3>
                <div className="flex flex-wrap gap-2">
                  {STYLES.map((s) => (
                    <FilterChip
                      key={s}
                      label={s}
                      active={style === s}
                      onClick={() => onChange({ style: style === s ? "All" : s })}
                    />
                  ))}
                </div>
              </div>

              {/* Price */}
              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-espresso/60 mb-4">Price Range</h3>
                <PriceRangeSlider
                  min={priceRange[0]} max={priceRange[1]}
                  value={priceValue}
                  onChange={(v) => onChange({ priceValue: v })}
                />
              </div>

              {/* Colors */}
              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-espresso/60 mb-4">Colour</h3>
                <div className="flex flex-wrap gap-3">
                  {allColors.map((c) => (
                    <div key={c} className="flex flex-col items-center gap-1">
                      <ColorDot color={c} active={colors.includes(c)} onClick={() => toggleColor(c)} />
                      <span className="text-[9px] text-espresso/50 leading-none">{c.split(" ")[0]}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* On Sale */}
              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-espresso/60 mb-4">Offers</h3>
                <FilterChip
                  label="On Sale"
                  active={onSale}
                  onClick={() => onChange({ onSale: !onSale })}
                />
              </div>
            </div>

            <div className="border-t border-umber-50 px-6 py-4">
              <button
                type="button"
                onClick={() => { onChange({ colors: [], priceValue: priceRange, style: "All", onSale: false }); onClose(); }}
                className="cursor-pointer w-full text-center text-xs font-semibold uppercase tracking-widest text-espresso/60 hover:text-espresso transition-colors"
              >
                Clear all filters
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Main ShopPage ─────────────────────────────────────────────────────────────
export default function ShopPage() {
  const { data: rawProductsRaw, loading, error } = useAsyncData(getProducts, []);
  // Guard against null during initial load — useAsyncData starts with data=null
  const rawProducts = rawProductsRaw ?? [];

  const priceRange = useMemo(() => {
    if (!rawProducts.length) return [0, 300];
    const prices = rawProducts.map((p) => p.price);
    return [Math.floor(Math.min(...prices)), Math.ceil(Math.max(...prices))];
  }, [rawProducts]);

  const allColors = useMemo(() => {
    const s = new Set();
    rawProducts.forEach((p) => (p.colors ?? []).forEach((c) => s.add(c)));
    return [...s].sort();
  }, [rawProducts]);

  const [sortOrder, setSortOrder] = useState("newest");
  const [activeCategory, setActiveCategory] = useState("All");
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  const [filters, setFilters] = useState({
    colors: [],
    priceValue: [0, 300],
    style: "All",
    onSale: false,
  });
  const [cols, setCols] = useState(4); // grid columns on desktop

  // Sync priceValue when products load
  const priceValue = filters.priceValue[1] === 300 && priceRange[1] !== 300
    ? priceRange
    : filters.priceValue;

  const updateFilters = (partial) => setFilters((prev) => ({ ...prev, ...partial }));

  // Active filter count badge
  const activeFilterCount = [
    filters.colors.length > 0,
    filters.style !== "All",
    filters.onSale,
    filters.priceValue[0] > priceRange[0] || filters.priceValue[1] < priceRange[1],
  ].filter(Boolean).length;

  // ── Apply filters & sort ──
  const filtered = useMemo(() => {
    let list = [...(rawProducts ?? [])];

    // Category tab
    if (activeCategory !== "All") {
      list = list.filter((p) => p.collectionId === activeCategory.toLowerCase());
    }

    // Style / sub-category
    if (filters.style !== "All") {
      list = list.filter((p) =>
        (p.categories ?? []).some((c) => c.toLowerCase() === filters.style.toLowerCase())
      );
    }

    // Colors
    if (filters.colors.length) {
      list = list.filter((p) =>
        (p.colors ?? []).some((c) => filters.colors.includes(c))
      );
    }

    // Price
    list = list.filter((p) => p.price >= priceValue[0] && p.price <= priceValue[1]);

    // On sale
    if (filters.onSale) {
      list = list.filter((p) => p.originalPrice && p.originalPrice > p.price);
    }

    // Sort
    if (sortOrder === "price-low") list.sort((a, b) => a.price - b.price);
    else if (sortOrder === "price-high") list.sort((a, b) => b.price - a.price);
    else if (sortOrder === "rating") list.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    else if (sortOrder === "sale") list.sort((a, b) => (b.originalPrice ? 1 : 0) - (a.originalPrice ? 1 : 0));

    return list;
  }, [rawProducts, activeCategory, filters, priceValue, sortOrder]);

  return (
    <div className="bg-ivory-50 min-h-screen">
      <FilterPanel
        open={filterPanelOpen}
        onClose={() => setFilterPanelOpen(false)}
        filters={{ ...filters, priceValue }}
        onChange={updateFilters}
        allColors={allColors}
        priceRange={priceRange}
      />

      {/* ── Editorial Header ── */}
      <section className="relative h-[420px] md:h-[480px] overflow-hidden" aria-labelledby="shop-title">
        <img
          src="https://ik.imagekit.io/sbgenu6wj/Belioras/Home/belioras-hero-2.jpeg"
          alt="Belioras Collection"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-espresso/90 via-espresso/50 to-espresso/10" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 pt-16">
          <motion.p
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="text-[10px] font-bold uppercase tracking-[0.25em] text-gold-400 mb-4"
          >
            The Belioras Edit
          </motion.p>
          <motion.h1
            id="shop-title"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-4xl md:text-5xl text-ivory-50 tracking-wide mb-4"
          >
            All Collections
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.25 }}
            className="text-sm text-ivory-50/70 max-w-md leading-relaxed"
          >
            Curated luxury fashion and premium hair, built around signature stories.
          </motion.p>
        </div>
      </section>

      {/* ── Category Tabs ── */}
      <div className="sticky top-0 z-40 bg-ivory-50/95 backdrop-blur border-b border-umber-50/30">
        <div className="container-main px-4 sm:px-6 md:px-8 flex items-center justify-between gap-4 py-3">
          <div className="flex items-center gap-1 overflow-x-auto hide-scrollbar">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`cursor-pointer whitespace-nowrap px-4 py-2 text-[11px] font-bold uppercase tracking-widest transition-all duration-200 rounded-full ${
                  activeCategory === cat
                    ? "bg-espresso text-ivory-50"
                    : "text-espresso/60 hover:text-espresso"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="hidden sm:block text-[11px] text-espresso/50 font-medium">
              {filtered.length} items
            </span>

            {/* Sort */}
            <div className="relative">
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="cursor-pointer appearance-none bg-transparent border border-umber-50 rounded-full pl-3 pr-7 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-espresso focus:outline-none focus:border-espresso"
              >
                {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 size-3 text-espresso/50" />
            </div>

            {/* Filter toggle */}
            <button
              type="button"
              onClick={() => setFilterPanelOpen(true)}
              className="cursor-pointer relative flex items-center gap-2 px-4 py-1.5 rounded-full border border-umber-50 text-[11px] font-bold uppercase tracking-widest text-espresso hover:border-espresso transition-colors"
            >
              <SlidersHorizontal className="size-3.5" />
              Filter
              {activeFilterCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 size-4 rounded-full bg-gold-500 text-espresso text-[9px] font-bold flex items-center justify-center leading-none">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Grid size toggle (desktop) */}
            <div className="hidden lg:flex items-center gap-1 border border-umber-50 rounded-full px-2 py-1">
              {[3, 4].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setCols(n)}
                  className={`cursor-pointer size-6 flex items-center justify-center rounded-full text-[11px] font-bold transition-all ${
                    cols === n ? "bg-espresso text-ivory-50" : "text-espresso/40 hover:text-espresso"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Active filter pills */}
        {(filters.colors.length > 0 || filters.style !== "All" || filters.onSale) && (
          <div className="container-main px-4 sm:px-6 md:px-8 pb-2 flex items-center gap-2 flex-wrap">
            {filters.colors.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => updateFilters({ colors: filters.colors.filter((x) => x !== c) })}
                className="cursor-pointer inline-flex items-center gap-1.5 rounded-full bg-espresso/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-espresso hover:bg-rose-50 hover:text-rose-700 transition-colors"
              >
                <span className="size-2.5 rounded-full inline-block shrink-0" style={{ backgroundColor: COLOR_MAP[c] }} />
                {c}
                <X className="size-3" />
              </button>
            ))}
            {filters.style !== "All" && (
              <button
                type="button"
                onClick={() => updateFilters({ style: "All" })}
                className="cursor-pointer inline-flex items-center gap-1.5 rounded-full bg-espresso/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-espresso hover:bg-rose-50 hover:text-rose-700 transition-colors"
              >
                {filters.style} <X className="size-3" />
              </button>
            )}
            {filters.onSale && (
              <button
                type="button"
                onClick={() => updateFilters({ onSale: false })}
                className="cursor-pointer inline-flex items-center gap-1.5 rounded-full bg-gold-500/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-gold-800 hover:bg-rose-50 hover:text-rose-700 transition-colors"
              >
                On Sale <X className="size-3" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* ── Product Grid ── */}
      <section className="container-main px-4 sm:px-6 md:px-8 pt-10 pb-24">
        {loading ? (
          <div className="flex justify-center py-32">
            <div className="size-8 animate-spin rounded-full border-2 border-gold-500 border-t-transparent" />
          </div>
        ) : error ? (
          <div className="py-32 text-center text-espresso/60">Failed to load products. Please try again.</div>
        ) : filtered.length === 0 ? (
          <div className="py-32 text-center">
            <p className="font-display text-2xl text-espresso mb-3">No results found</p>
            <p className="text-sm text-espresso/60 mb-6">Try adjusting your filters.</p>
            <button
              type="button"
              onClick={() => { setFilters({ colors: [], priceValue: priceRange, style: "All", onSale: false }); setActiveCategory("All"); }}
              className="cursor-pointer text-xs font-bold uppercase tracking-widest text-gold-700 hover:text-espresso transition-colors underline underline-offset-4"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <motion.div
            layout
            className={`grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-x-6 sm:gap-y-16 ${
              cols === 3
                ? "lg:grid-cols-3 lg:gap-x-8 lg:gap-y-20"
                : "lg:grid-cols-4 lg:gap-x-6 lg:gap-y-16"
            }`}
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.3 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </section>
    </div>
  );
}

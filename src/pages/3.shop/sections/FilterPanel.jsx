import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import FilterChip from "./FilterChip";
import ColorDot from "./ColorDot";
import PriceRangeSlider from "./PriceRangeSlider";
import { STYLES } from "./constants";

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

export default FilterPanel;
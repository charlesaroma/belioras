/* Page: Shop - ProductGrid */
import { motion, AnimatePresence } from "motion/react";
import ProductCard from "../../../components/storefront/ProductCard";
import { COLUMN_CLASSES, COLUMN_GAP_CLASSES } from "../../../utils/gridColumns";
import { cn } from "../../../utils/cn";

function ProductGrid({ filtered, cols, loading, error, onClearFilters, hasActiveFilters = false }) {
  return (
    <section className="pt-2">
      {loading ? (
        <div className="flex justify-center py-32">
          <div className="size-8 animate-spin rounded-full border-2 border-gold-500 border-t-transparent" />
        </div>
      ) : error ? (
        <div className="py-32 text-center text-espresso/60">Failed to load products. Please try again.</div>
      ) : filtered.length === 0 ? (
        <div className="py-32 text-center">
          {/* A dead end with no way out is the anti-pattern; always offer the
              next move rather than a bare "0 results". */}
          <p className="font-display text-2xl text-espresso mb-3">
            {hasActiveFilters ? "Nothing matches that combination" : "This edit is being curated"}
          </p>
          <p className="mx-auto mb-6 max-w-sm text-sm text-espresso-soft">
            {hasActiveFilters
              ? "Try removing a filter — colour and fabric together narrow things quickly."
              : "We're finishing this selection. The rest of the collection is ready for you."}
          </p>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onClearFilters}
              className="btn btn-md btn-primary"
            >
              Clear all filters
            </button>
          )}
        </div>
      ) : (
        <motion.div
          layout
          // Honours the selected density exactly. The previous version only
          // understood 3 and 4 and applied them at lg only, so any other choice
          // silently fell through to a 4-column grid.
          className={cn(
            "grid",
            COLUMN_CLASSES[cols] ?? COLUMN_CLASSES[4],
            COLUMN_GAP_CLASSES[cols] ?? COLUMN_GAP_CLASSES[4],
          )}
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
  );
}

export default ProductGrid;
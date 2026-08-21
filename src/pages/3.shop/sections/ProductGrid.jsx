import { motion, AnimatePresence } from "motion/react";
import ProductCard from "../../components/storefront/ProductCard";

function ProductGrid({ filtered, cols, loading, error, onClearFilters }) {
  return (
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
            onClick={onClearFilters}
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
  );
}

export default ProductGrid;
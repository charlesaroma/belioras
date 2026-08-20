import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";

import { NAV_LINKS, SALE_BADGE } from "../../../utils/constants";
import { useCurrency } from "../../../context/CurrencyContext";
import { formatCurrency } from "../../../utils/formatCurrency";

function lastSegment(slug) {
  return slug.split("/").filter(Boolean).at(-1);
}

export default function MegaMenu({ category, products, onMouseEnter, onMouseLeave }) {
  const { currency, convert } = useCurrency();

  const featured = (category?.featured ?? [])
    .map((id) => products?.find((p) => p.id === id))
    .filter(Boolean)
    .slice(0, 3);

  const categoryLink = NAV_LINKS.find((l) => l.id === category?.id);

  return (
    <AnimatePresence>
      {category && (
        <motion.div
          key={category.id}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 6 }}
          transition={{ duration: 0.2 }}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          className="absolute left-1/2 top-full mt-1 w-full max-w-5xl -translate-x-1/2 origin-top rounded-xl border border-umber-50 bg-ivory-50/98 shadow-large backdrop-blur"
        >
          <div className="grid grid-cols-12 gap-8 p-8">
            <div className="col-span-3 space-y-2.5">
              <p className="eyebrow">Categories</p>
              {category.children.map((child) => (
                <Link
                  key={child.slug}
                  to={`/shop/${category.id}?categories=${lastSegment(child.slug)}`}
                  className="block text-sm text-espresso/80 transition-colors hover:text-gold-700"
                >
                  {child.label}
                </Link>
              ))}
              <Link
                to={`/shop/${category.id}`}
                className="mt-3 block text-[13px] font-semibold uppercase tracking-[0.14em] text-gold-700 hover:underline"
              >
                View all {category.label.toLowerCase()}
              </Link>
            </div>

            <div className="col-span-9">
              <p className="eyebrow mb-4">Featured</p>
              {featured.length === 0 ? (
                <p className="text-sm text-espresso/50">Curating this season's picks…</p>
              ) : (
                <ul className="grid grid-cols-3 gap-6">
                  {featured.map((product) => {
                    const badge = SALE_BADGE.label(product);
                    return (
                      <li key={product.id}>
                        <Link to={`/product/${product.slug}`} className="group block">
                          <div className="relative overflow-hidden rounded-xl bg-brown-50">
                            <img
                              src={product.images?.[0]}
                              alt={product.name}
                              className="aspect-[3/4] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                              loading="lazy"
                            />
                            {badge && (
                              <span className="absolute left-3 top-3 rounded-full bg-gold-500 px-2.5 py-1 text-[11px] font-semibold text-espresso">
                                {badge}
                              </span>
                            )}
                          </div>
                          <p className="mt-3 truncate text-sm font-medium text-espresso">
                            {product.name}
                          </p>
                          <p className="mt-1 text-sm text-espresso/70">
                            {product.originalPrice ? (
                              <>
                                <span className="text-gold-700">
                                  {formatCurrency(convert(product.price), currency)}
                                </span>{" "}
                                <s className="text-espresso/40">
                                  {formatCurrency(convert(product.originalPrice), currency)}
                                </s>
                              </>
                            ) : (
                              <span>{formatCurrency(convert(product.price), currency)}</span>
                            )}
                          </p>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
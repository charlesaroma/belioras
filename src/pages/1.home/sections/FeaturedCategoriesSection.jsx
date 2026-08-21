import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

import { useAsyncData } from "../../../hooks/useAsyncData";
import { getCollections } from "../../../services/collectionsApi";

export default function FeaturedCategoriesSection() {
  const { data: collections = [], loading } = useAsyncData(getCollections, []);

  return (
    <section aria-labelledby="categories-title" className="container-main px-4 sm:px-6 md:px-8 py-section-mobile sm:py-section-tablet lg:py-section-desktop">
      <div className="mb-10 flex items-end justify-between gap-6">
        <div>
          <p className="eyebrow">The Collections</p>
          <h2
            id="categories-title"
            className="mt-3 font-display text-3xl tracking-wide text-espresso md:text-4xl"
          >
            Shop by category
          </h2>
        </div>
        <Link
          to="/shop"
          className="hidden items-center gap-1.5 text-sm font-semibold uppercase tracking-[0.12em] text-gold-700 transition hover:text-gold-800 sm:inline-flex"
        >
          View all
          <ArrowUpRight className="size-4" aria-hidden="true" />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {(loading ? Array.from({ length: 3 }).map(() => ({})) : collections).map((collection, i) =>
          collection.id ? (
            <Link
              key={collection.id}
              to={`/shop/${collection.slug}`}
              className="group relative overflow-hidden rounded-lg border border-umber-100"
            >
              <div className="aspect-[4/5] overflow-hidden bg-ivory-100">
                <img
                  src={collection.image}
                  alt={collection.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 bg-gradient-to-t from-espresso/70 to-transparent p-5">
                <div>
                  <h3 className="font-display text-xl tracking-wide text-ivory-50">
                    {collection.name}
                  </h3>
                  <p className="mt-1 text-xs text-ivory-50/80">{collection.tagline}</p>
                </div>
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-ivory-50 text-espresso transition group-hover:bg-gold-600 group-hover:text-ivory-50">
                  <ArrowUpRight className="size-4" aria-hidden="true" />
                </span>
              </div>
            </Link>
          ) : (
            <div key={i} className="skeleton aspect-[4/5] rounded-lg" aria-hidden="true" />
          )
        )}
      </div>
    </section>
  );
}
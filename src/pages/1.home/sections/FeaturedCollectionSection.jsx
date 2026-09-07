import { Link } from "react-router-dom";

import { useAsyncData } from "../../../hooks/useAsyncData";
import { useLanguage } from "../../../context/LanguageContext";
import { getFeaturedProducts } from "../../../services/productsApi";

/**
 * Featured Collection — confirmed in the design review to take the slot New
 * Arrivals previously held.
 *
 * A 2×2 image grid with a glass card floating at the centre. Fallback imagery
 * keeps the grid whole if fewer than four products are featured, since a
 * half-empty mosaic reads as a broken page rather than a short list.
 */
const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=900&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?q=80&w=900&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=900&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=900&auto=format&fit=crop",
];

export default function FeaturedCollectionSection() {
  const { data } = useAsyncData(getFeaturedProducts, []);
  const { t } = useLanguage();

  const products = (data ?? []).slice(0, 4);
  const cells = Array.from({ length: 4 }, (_, i) => ({
    key: products[i]?.id ?? `fallback-${i}`,
    image: products[i]?.images?.[0] ?? FALLBACK_IMAGES[i],
    to: products[i] ? `/product/${products[i].slug}` : "/shop",
    name: products[i]?.name ?? "",
  }));

  return (
    <section
      className="relative py-section-mobile md:py-section-tablet"
      aria-labelledby="featured-collection-heading"
    >
      <div className="container-main px-4 sm:px-6">
        <div className="relative grid grid-cols-2 gap-2 sm:gap-3">
          {cells.map((cell) => (
            <Link
              key={cell.key}
              to={cell.to}
              className="group relative block overflow-hidden rounded-md"
            >
              <img
                src={cell.image}
                alt={cell.name}
                loading="lazy"
                className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-105 sm:aspect-[3/2]"
              />
              <span className="absolute inset-0 bg-espresso/10 transition-colors group-hover:bg-espresso/25" />
            </Link>
          ))}

          {/* Centred over the seam of the four tiles. */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="glass pointer-events-auto rounded-md px-6 py-6 text-center shadow-large sm:px-10 sm:py-8">
              <p className="eyebrow">{t("home.featured.eyebrow", "Curated for you")}</p>
              <h2
                id="featured-collection-heading"
                className="mt-2 font-display text-2xl leading-tight text-espresso sm:text-3xl"
              >
                {t("home.featured.title", "Featured")}
                <br />
                {t("home.featured.titleLine2", "Collection")}
              </h2>
              <Link to="/shop" className="btn btn-sm btn-primary mt-5">
                {t("common.discover", "Discover")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import { Link } from "react-router-dom";

import { useAsyncData } from "../../../hooks/useAsyncData";
import { useLanguage } from "../../../context/LanguageContext";
import { getFeaturedProducts } from "../../../services/productsApi";

/**
 * Featured Collection — confirmed in the design review to take the slot New
 * Arrivals previously held.
 *
 * Layout and dimensions match the design prototype exactly: a 2×2 grid of
 * square tiles with a 1px gutter, no rounded corners, and a centred label
 * card floating over the seam.
 *
 * The label is deliberately `pointer-events-none` with no button — the tiles
 * themselves are the links. A CTA sitting on top of four clickable images
 * would compete with them rather than add anything.
 *
 * Data comes from the services layer rather than the prototype's admin context,
 * and the copy is translated where the prototype hardcoded English.
 */

/** Keeps the grid whole when fewer than four products are featured. */
const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=900&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1566206091558-7f218b696731?q=80&w=900&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=900&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=900&auto=format&fit=crop",
];

export default function FeaturedCollectionSection() {
  const { data } = useAsyncData(getFeaturedProducts, []);
  const { t } = useLanguage();

  const featured = (data ?? []).slice(0, 4);

  const tiles = Array.from({ length: 4 }, (_, i) => ({
    image: featured[i]?.images?.[0] ?? FALLBACK_IMAGES[i],
    to: featured[i]?.slug ? `/product/${featured[i].slug}` : "/shop",
    name: featured[i]?.name ?? "",
  }));

  return (
    <section
      className="mx-auto max-w-[1400px] px-6 py-10 md:px-10"
      aria-labelledby="featured-collection-heading"
    >
      <div className="relative grid grid-cols-2 gap-1">
        {tiles.map((tile, i) => (
          <Link
            key={tile.to + i}
            to={tile.to}
            className="group block overflow-hidden bg-ivory-300"
          >
            <img
              src={tile.image}
              alt={tile.name}
              loading="lazy"
              className="aspect-square w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            />
          </Link>
        ))}

        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="flex flex-col items-center bg-ivory-50/90 px-8 py-5 text-center shadow-sm backdrop-blur-[2px]">
            <p className="mb-2 font-sans text-[10px] uppercase tracking-[0.3em] text-espresso-300">
              {t("home.featuredKicker", "Curated for you")}
            </p>
            <p
              id="featured-collection-heading"
              className="font-display text-xl italic leading-tight text-espresso md:text-2xl"
            >
              {t("home.featuredLine1", "Featured")}
            </p>
            <p className="font-display text-xl italic leading-tight text-espresso md:text-2xl">
              {t("home.featuredLine2", "Collection")}
            </p>
            <span aria-hidden="true" className="mt-3 h-px w-12 bg-gold-500" />
          </div>
        </div>
      </div>
    </section>
  );
}

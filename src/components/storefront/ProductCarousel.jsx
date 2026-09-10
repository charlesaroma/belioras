/* Storefront Component: ProductCarousel */
import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

import ProductCard from "./ProductCard";
import { cn } from "../../utils/cn";

export default function ProductCarousel({ title, products, loading, ctaLabel, ctaTo, limit = 8 }) {

  const trackRef = useRef(null);
  const [overflows, setOverflows] = useState(false);

  const items = (products ?? []).slice(0, limit);

  // Arrows are noise when everything already fits.
  useEffect(() => {

    const track = trackRef.current;
    if (!track) return undefined;

    const measure = () => setOverflows(track.scrollWidth > track.clientWidth + 1);
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(track);
    return () => observer.disconnect();
  }, [items.length]);

  const scroll = useCallback((direction) => {

    const track = trackRef.current;
    if (!track) return;

    const cardWidth = track.firstChild?.offsetWidth ?? 300;
    track.scrollBy({ left: direction * (cardWidth + 20), behavior: "smooth" });
  }, []);

  const onKeyDown = (e) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      scroll(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      scroll(-1);
    }
  };

  if (!loading && items.length === 0) return null;

  const headingId = `${title.replace(/\s+/g, "-").toLowerCase()}-heading`;

  return (
    <section className="mx-auto max-w-[1400px] px-6 py-16 md:px-10" aria-labelledby={headingId}>
      <div className="mb-10 text-center">
        <h2 id={headingId} className="font-display text-3xl text-espresso">
          {title}
        </h2>
        <span aria-hidden="true" className="mx-auto mt-3 block h-px w-12 bg-gold-500" />
      </div>

      <div className="relative">
        {overflows && <Arrow direction="left" onClick={() => scroll(-1)} />}

        <div
          ref={trackRef}
          onKeyDown={onKeyDown}
          tabIndex={0}
          role="region"
          aria-label={`${title} — scroll for more`}
          className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto pb-1"
        >
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="w-[75%] shrink-0 snap-start sm:w-[48%] lg:w-[23%]"
                  aria-hidden="true"
                >
                  <div className="skeleton aspect-[3/4] w-full" />
                  <div className="skeleton mt-3 h-4 w-2/3" />
                  <div className="skeleton mt-2 h-4 w-1/3" />
                </div>
              ))
            : items.map((product) => (
                <div key={product.id} className="w-[75%] shrink-0 snap-start sm:w-[48%] lg:w-[23%]">
                  <ProductCard product={product} />
                </div>
              ))}
        </div>

        {overflows && <Arrow direction="right" onClick={() => scroll(1)} />}
      </div>

      {ctaTo && (
        <div className="mt-10 flex justify-center">
          <Link
            to={ctaTo}
            className="inline-block border border-espresso px-10 py-3 text-[11px] font-medium uppercase tracking-[0.22em] text-espresso transition-colors duration-200 hover:bg-espresso hover:text-ivory-50"
          >
            {ctaLabel}
          </Link>
        </div>
      )}
    </section>
  );
}

function Arrow({ direction, onClick }) {

  const isLeft = direction === "left";

  const Icon = isLeft ? ChevronLeft : ChevronRight;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={isLeft ? "Previous" : "Next"}
      className={cn(
        "absolute top-1/2 z-10 flex size-9 -translate-y-1/2 items-center justify-center rounded-full",
        "border border-umber-50 bg-ivory-50 text-espresso-soft shadow-sm",
        "transition-all duration-200 hover:border-espresso-300 hover:text-espresso",
        isLeft ? "-left-4 md:-left-6" : "-right-4 md:-right-6",
      )}
    >
      <Icon className="size-4 shrink-0" strokeWidth={1.5} aria-hidden="true" />
    </button>
  );
}

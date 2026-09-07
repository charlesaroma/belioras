import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

import ProductCard from "./ProductCard";
import { cn } from "../../utils/cn";

/**
 * Horizontally scrolling product rail — the presentation agreed for both New
 * Arrivals and Best Sellers.
 *
 * Uses native scroll-snap rather than a carousel library: it keeps touch and
 * trackpad momentum, stays keyboard- and screen-reader-navigable as a plain
 * scroll container, and costs no bundle weight.
 */
export default function ProductCarousel({
  title,
  eyebrow,
  products,
  loading,
  ctaLabel,
  ctaTo,
  limit = 8,
}) {
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

  const scrollBy = useCallback((direction) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: direction * track.clientWidth * 0.8, behavior: "smooth" });
  }, []);

  const onKeyDown = (e) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      scrollBy(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      scrollBy(-1);
    }
  };

  if (!loading && items.length === 0) return null;

  return (
    <section className="py-section-mobile md:py-section-tablet" aria-labelledby={`${title}-heading`}>
      <div className="container-main px-4 sm:px-6">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            {eyebrow && <p className="eyebrow">{eyebrow}</p>}
            <h2 id={`${title}-heading`} className="mt-2 font-display text-3xl text-espresso">
              {title}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {ctaTo && (
              <Link
                to={ctaTo}
                className="hidden items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-espresso-soft transition-colors hover:text-gold-700 sm:inline-flex"
              >
                {ctaLabel}
                <ArrowRight className="size-3.5" aria-hidden="true" />
              </Link>
            )}

            {overflows && (
              <div className="hidden items-center gap-1 md:flex">
                <CarouselArrow direction="left" onClick={() => scrollBy(-1)} />
                <CarouselArrow direction="right" onClick={() => scrollBy(1)} />
              </div>
            )}
          </div>
        </div>
      </div>

      <div
        ref={trackRef}
        onKeyDown={onKeyDown}
        tabIndex={0}
        role="region"
        aria-label={`${title} — scroll for more`}
        className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-4 pb-2 sm:px-6"
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
              <div
                key={product.id}
                className="w-[75%] shrink-0 snap-start sm:w-[48%] lg:w-[23%]"
              >
                <ProductCard product={product} />
              </div>
            ))}
      </div>

      {ctaTo && (
        <div className="container-main mt-8 px-4 text-center sm:hidden">
          <Link to={ctaTo} className="btn btn-md btn-primary">
            {ctaLabel}
          </Link>
        </div>
      )}
    </section>
  );
}

function CarouselArrow({ direction, onClick }) {
  const Icon = direction === "left" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === "left" ? "Scroll left" : "Scroll right"}
      className={cn(
        "flex size-9 items-center justify-center rounded-full border border-umber-50",
        "text-espresso transition-colors hover:border-gold-500 hover:text-gold-700",
      )}
    >
      <Icon className="size-4" aria-hidden="true" />
    </button>
  );
}

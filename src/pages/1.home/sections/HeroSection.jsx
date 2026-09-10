/* Page: Home - HeroSection */
import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { useAsyncData } from "../../../hooks/useAsyncData";
import { useContentVersion } from "../../../context/ContentContext";
import { getHeroSlides } from "../../../services/contentApi";
import { cn } from "../../../utils/cn";

/* AUTOPLAY MS */
const AUTOPLAY_MS = 6000;

export default function HeroSection() {

  const version = useContentVersion();
  const { data } = useAsyncData(getHeroSlides, [version]);

  const reduceMotion = useReducedMotion();

  const slides = data?.slides ?? [];

  const autoplayMs = data?.autoplayMs ?? AUTOPLAY_MS;

  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const timerRef = useRef(null);

  const count = slides.length;

  const goTo = useCallback((i) => setIndex(count ? ((i % count) + count) % count : 0), [count]);

  // Autoplay is suppressed under prefers-reduced-motion: an unattended slide
  // change is exactly the vestibular trigger that setting exists for.
  useEffect(() => {
    if (paused || reduceMotion || count < 2) return undefined;
    timerRef.current = setInterval(() => setIndex((i) => (i + 1) % count), autoplayMs);
    return () => clearInterval(timerRef.current);
  }, [paused, reduceMotion, count, autoplayMs]);

  // A content edit can shorten the deck while a later slide is showing; clamp
  // during render so the stale index never reaches the DOM.
  const safeIndex = count ? Math.min(index, count - 1) : 0;

  const slide = slides[safeIndex];

  if (!slide) return <section className="h-[100svh] min-h-[600px] w-full bg-espresso" />;

  return (
    <section
      className="relative h-[100svh] min-h-[600px] w-full overflow-hidden bg-espresso"
      aria-labelledby="hero-title"
      aria-roledescription="carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <AnimatePresence mode="sync">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          // Slower than a UI transition on purpose: at this size the change
          // should register as a dissolve, not a swap.
          transition={{ duration: 1.4, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <img
            src={slide.image}
            alt=""
            fetchPriority="high"
            className="h-full w-full object-cover"
            style={{ objectPosition: slide.objectPosition }}
          />
          {/*
            Weighted to the bottom, where the type sits, and kept light across
            the top so the navbar still reads against the photograph rather
            than against a wash.
          */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-b from-espresso/45 via-espresso/10 to-espresso/75"
          />
        </motion.div>
      </AnimatePresence>

      <div className="relative flex h-full flex-col items-center justify-end px-6 pb-24 text-center sm:pb-28">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="max-w-3xl text-ivory-50"
          >
            {slide.seasonLabel && (
              <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.28em] text-champagne-400">
                {slide.seasonLabel}
              </p>
            )}

            <h1
              id="hero-title"
              className="font-display text-[38px] leading-[1.06] tracking-[0.01em] sm:text-[48px] md:text-[58px] lg:text-[66px]"
            >
              {slide.title.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h1>

            {slide.subtitle && (
              <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-ivory-50/70">
                {slide.subtitle}
              </p>
            )}

            {/* One destination, stated as a line of type. A pair of filled
                buttons made the fold read like a landing page. */}
            {slide.primaryCta && (
              <Link
                to={slide.primaryCta.to}
                className="mt-8 inline-block border-b border-gold-500 pb-1.5 text-[11px] font-medium uppercase tracking-[0.22em] text-ivory-50 transition-colors hover:text-champagne-300"
              >
                {slide.primaryCta.label}
              </Link>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {count > 1 && (
        <div
          className="absolute inset-x-0 bottom-9 z-10 flex items-center justify-center gap-2"
          role="tablist"
          aria-label="Hero slides"
        >
          {slides.map((s, i) => (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={i === safeIndex}
              aria-label={
                s.seasonLabel
                  ? `${s.seasonLabel} — slide ${i + 1} of ${count}`
                  : `Slide ${i + 1} of ${count}`
              }
              onClick={() => goTo(i)}
              // Generous hit area around a hairline mark: the rule is 1.5px
              // tall but the target is a comfortable 44px wide and 24 tall.
              className="group flex h-6 w-11 items-center"
            >
              <span
                className={cn(
                  "block h-[1.5px] w-full transition-colors duration-500",
                  i === safeIndex
                    ? "bg-gold-500"
                    : "bg-ivory-50/30 group-hover:bg-ivory-50/60",
                )}
              />
            </button>
          ))}
        </div>
      )}
    </section>
  );
}

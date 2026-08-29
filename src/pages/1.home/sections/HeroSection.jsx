import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "../../../utils/cn";

const AUTOPLAY_MS = 6000;

const SLIDES = [
  {
    id: "style",
    image: "https://ik.imagekit.io/sbgenu6wj/Belioras/Home/hero-image-belioras.PNG",
    objectPosition: "70% 20%",
    title: ["Your Style.", "Your Crown."],
    subtitle: "Luxury Fashion & Hair Curated for Confident Women",
    primaryCta: { label: "Shop Collection", to: "/shop" },
    secondaryCta: { label: "Explore Hair", to: "/shop/hair" },
  },
  {
    id: "new-season",
    image: "https://ik.imagekit.io/sbgenu6wj/Belioras/Home/belioras-hero-2.jpeg",
    objectPosition: "50% 20%",
    title: ["New Season,", "New Statement."],
    subtitle: "Considered pieces for every occasion — the Winter Edit is here.",
    primaryCta: { label: "Shop New In", to: "/whats-new" },
    secondaryCta: { label: "Shop All", to: "/shop" },
  },
  {
    id: "hair",
    image: "https://ik.imagekit.io/sbgenu6wj/Belioras/Home/model-belioras123.jpeg",
    objectPosition: "60% 15%",
    title: ["Crowned in", "Confidence."],
    subtitle: "From sleek wigs to bold curls — hair crafted for every mood.",
    primaryCta: { label: "Shop Hair", to: "/shop/hair" },
    secondaryCta: { label: "Shop Collection", to: "/shop" },
  },
];

export default function HeroSection() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);

  const goTo = useCallback((i) => setIndex((i + SLIDES.length) % SLIDES.length), []);
  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  useEffect(() => {
    if (paused) return undefined;
    timerRef.current = setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), AUTOPLAY_MS);
    return () => clearInterval(timerRef.current);
  }, [paused]);

  const slide = SLIDES[index];

  return (
    <section
      className={cn('relative', 'h-[100svh]', 'min-h-[600px]', 'w-full', 'overflow-hidden', 'bg-espresso')}
      aria-labelledby="hero-title"
      aria-roledescription="carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Background Image */}
      <AnimatePresence mode="sync">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={cn('absolute', 'inset-0')}
        >
          <img
            src={slide.image}
            alt=""
            className={cn('h-full', 'w-full', 'object-cover', 'opacity-80')}
            style={{ objectPosition: slide.objectPosition }}
          />
          {/*
            Mobile: darken bottom (where text sits) leaving top/right bright so the model shows clearly.
            Desktop: darken left side (where text sits) fading to transparent on the right.
          */}
          <div
            className={cn('absolute', 'inset-0', 'bg-gradient-to-t', 'from-espresso/80', 'via-espresso/30', 'to-espresso/10', 'lg:bg-gradient-to-r', 'lg:from-espresso/80', 'lg:via-espresso/40', 'lg:to-transparent')}
            aria-hidden="true"
          />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className={cn('relative', 'flex', 'h-full', 'flex-col', 'justify-end', 'pb-16', 'px-5', 'sm:justify-center', 'sm:pb-0', 'sm:px-8', 'lg:px-12', 'pt-20')}>
        <div className={cn('w-full', 'sm:max-w-[60%]', 'md:max-w-[55%]', 'lg:max-w-[45%]', 'text-ivory-50')}>
          <AnimatePresence mode="wait">
            <motion.div key={slide.id} initial="hidden" animate="visible" exit="hidden">
              {/* Headline */}
              <motion.h1
                id="hero-title"
                variants={{ hidden: { y: 24, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className={cn('mb-4', 'font-display', 'leading-[1.1]', 'tracking-[0.02em]', 'text-[36px]', 'sm:text-[44px]', 'md:text-[52px]', 'lg:text-[60px]', 'xl:text-[68px]')}
              >
                {slide.title.map((line, i) => (
                  <span key={i}>
                    {line}
                    {i < slide.title.length - 1 && <br />}
                  </span>
                ))}
              </motion.h1>

              {/* Subheadline */}
              <motion.p
                variants={{ hidden: { y: 24, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
                transition={{ duration: 0.6, delay: 0.25 }}
                className={cn('mb-8', 'font-sans', 'leading-[1.6]', 'text-ivory-50/90', 'text-[14px]', 'sm:text-[15px]', 'md:text-[16px]', 'lg:text-[17px]', 'max-w-[420px]')}
              >
                {slide.subtitle}
              </motion.p>

              {/* CTA Group */}
              <motion.div
                variants={{ hidden: { y: 24, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
                transition={{ duration: 0.6, delay: 0.35 }}
                className={cn('flex', 'flex-wrap', 'items-center', 'gap-3')}
              >
                <Link
                  to={slide.primaryCta.to}
                  className={cn('btn', 'btn-primary', 'bg-ivory-50/20', 'backdrop-blur-sm', 'border-transparent', 'text-ivory-50', 'hover:bg-ivory-50', 'hover:text-espresso', 'shadow-subtle', 'hover:-translate-y-0.5', 'transition-all', 'text-sm', 'px-5', 'py-3', 'sm:text-sm', 'sm:px-6', 'sm:py-3', 'lg:btn-lg')}
                >
                  {slide.primaryCta.label} <ArrowRight className={cn('ml-2', 'size-4')} />
                </Link>
                <Link
                  to={slide.secondaryCta.to}
                  className={cn('btn', 'btn-secondary', 'text-ivory-50', 'border-ivory-50/70', 'hover:bg-ivory-50', 'hover:text-espresso', 'shadow-subtle', 'hover:-translate-y-0.5', 'transition-all', 'text-sm', 'px-5', 'py-3', 'sm:text-sm', 'sm:px-6', 'sm:py-3', 'lg:btn-lg')}
                >
                  {slide.secondaryCta.label} <ArrowRight className={cn('ml-2', 'size-4')} />
                </Link>
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* Membership Card — persistent brand element, not tied to a slide */}
          <motion.div
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className={cn('mt-10', 'hidden', 'sm:inline-flex', 'items-center', 'gap-4', 'rounded-xl', 'border', 'border-gold-500/20', 'bg-[#1a1a1a]/80', 'p-4', 'backdrop-blur', 'shadow-medium')}
          >
            <div className={cn('flex', 'size-9', 'shrink-0', 'items-center', 'justify-center', 'rounded-full', 'bg-gold-500/10')}>
              <CrownIcon className={cn('size-4', 'text-gold-500')} />
            </div>
            <div>
              <h3 className={cn('font-sans', 'text-sm', 'font-semibold', 'text-ivory-50')}>Join the Belioras Tribe</h3>
              <p className={cn('font-sans', 'text-xs', 'text-ivory-200')}>
                10% off your first order · use code{" "}
                <span className="text-gold-400">WELCOME</span>
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Prev / Next arrows */}
      <button
        type="button"
        onClick={prev}
        aria-label="Previous slide"
        className={cn('absolute', 'left-3', 'top-1/2', '-translate-y-1/2', 'z-10', 'flex', 'size-9', 'items-center', 'justify-center', 'rounded-full', 'bg-ivory-50/10', 'text-ivory-50', 'backdrop-blur-sm', 'transition-colors', 'hover:bg-ivory-50/20', 'sm:left-5', 'sm:size-10')}
      >
        <ChevronLeft className="size-5" />
      </button>
      <button
        type="button"
        onClick={next}
        aria-label="Next slide"
        className={cn('absolute', 'right-3', 'top-1/2', '-translate-y-1/2', 'z-10', 'flex', 'size-9', 'items-center', 'justify-center', 'rounded-full', 'bg-ivory-50/10', 'text-ivory-50', 'backdrop-blur-sm', 'transition-colors', 'hover:bg-ivory-50/20', 'sm:right-5', 'sm:size-10')}
      >
        <ChevronRight className="size-5" />
      </button>

      {/* Dot indicators */}
      <div className={cn('absolute', 'bottom-5', 'left-1/2', '-translate-x-1/2', 'z-10', 'flex', 'items-center', 'gap-2', 'sm:bottom-7')}>
        {SLIDES.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            aria-current={i === index}
            className={cn(
              'h-1.5', 'rounded-full', 'transition-all', 'duration-300',
              i === index ? 'w-6 bg-gold-500' : 'w-1.5 bg-ivory-50/50 hover:bg-ivory-50/80',
            )}
          />
        ))}
      </div>
    </section>
  );
}

function CrownIcon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14" />
    </svg>
  );
}

import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { cn } from "../../../utils/cn";

export default function HeroSection() {
  return (
    <section className={cn('relative', 'h-[100svh]', 'min-h-[600px]', 'w-full', 'overflow-hidden', 'bg-espresso')} aria-labelledby="hero-title">
      {/* Background Image */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className={cn('absolute', 'inset-0')}
      >
        <img
          src="https://ik.imagekit.io/sbgenu6wj/Belioras/Home/hero-image-belioras.PNG"
          alt="Belioras Hero"
          className={cn('h-full', 'w-full', 'object-cover', 'opacity-80')}
          style={{ objectPosition: "70% 20%" }}
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

      {/* Content */}
      <div className={cn('relative', 'flex', 'h-full', 'flex-col', 'justify-end', 'pb-16', 'px-5', 'sm:justify-center', 'sm:pb-0', 'sm:px-8', 'lg:px-12', 'pt-20')}>
        <div className={cn('w-full', 'sm:max-w-[60%]', 'md:max-w-[55%]', 'lg:max-w-[45%]', 'text-ivory-50')}>
          {/* Headline */}
          <motion.h1
            id="hero-title"
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className={cn('mb-4', 'font-display', 'leading-[1.1]', 'tracking-[0.02em]', 'text-[36px]', 'sm:text-[44px]', 'md:text-[52px]', 'lg:text-[60px]', 'xl:text-[68px]')}
          >
            Your Style.<br />Your Crown.
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className={cn('mb-8', 'font-sans', 'leading-[1.6]', 'text-ivory-50/90', 'text-[14px]', 'sm:text-[15px]', 'md:text-[16px]', 'lg:text-[17px]', 'max-w-[420px]')}
          >
            Luxury Fashion &amp; Hair Curated for Confident Women
          </motion.p>

          {/* CTA Group */}
          <motion.div
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className={cn('flex', 'flex-wrap', 'items-center', 'gap-3')}
          >
            <Link
              to="/shop"
              className={cn('btn', 'btn-primary', 'bg-ivory-50/20', 'backdrop-blur-sm', 'border-transparent', 'text-ivory-50', 'hover:bg-ivory-50', 'hover:text-espresso', 'shadow-subtle', 'hover:-translate-y-0.5', 'transition-all', 'text-sm', 'px-5', 'py-3', 'sm:text-sm', 'sm:px-6', 'sm:py-3', 'lg:btn-lg')}
            >
              Shop Collection <ArrowRight className={cn('ml-2', 'size-4')} />
            </Link>
            <Link
              to="/shop/hair"
              className={cn('btn', 'btn-secondary', 'text-ivory-50', 'border-ivory-50/70', 'hover:bg-ivory-50', 'hover:text-espresso', 'shadow-subtle', 'hover:-translate-y-0.5', 'transition-all', 'text-sm', 'px-5', 'py-3', 'sm:text-sm', 'sm:px-6', 'sm:py-3', 'lg:btn-lg')}
            >
              Explore Hair <ArrowRight className={cn('ml-2', 'size-4')} />
            </Link>
          </motion.div>

          {/* Membership Card — hidden on smallest phones, shows sm+ */}
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
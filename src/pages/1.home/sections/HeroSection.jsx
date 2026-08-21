import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";

export default function HeroSection() {

  return (
    <section className="relative h-screen w-full overflow-hidden bg-espresso" aria-labelledby="hero-title">
      {/* Editorial Background Image */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="absolute inset-0"
      >
        <img
          src="https://ik.imagekit.io/sbgenu6wj/Belioras/Home/hero-image-belioras.PNG"
          alt="Belioras Hero"
          className="h-full w-full object-cover opacity-80"
          style={{ objectPosition: 'center 20%' }}
        />
        {/* Scrim for text legibility - dark to transparent */}
        <div 
          className="absolute inset-0 bg-gradient-to-r from-espresso/80 via-espresso/40 to-transparent" 
          aria-hidden="true" 
        />
      </motion.div>

      <div className="container-main px-6 lg:px-12 relative flex h-full flex-col justify-center pt-20">
        <div className="max-w-[40%] text-ivory-50 md:max-w-[50%] sm:max-w-full">
          {/* Headline */}
          <motion.h1
            id="hero-title"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-4 font-display text-4xl leading-[1.15] tracking-[0.03em] md:text-[48px] lg:text-[64px] max-w-3xl"
          >
            Your Style. Your Crown.
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-10 max-w-lg font-sans text-[16px] leading-[1.6] md:text-[18px]"
          >
            Luxury Fashion & Hair Curated for Confident Women
          </motion.p>

          {/* CTA Group */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-wrap items-center gap-4"
          >
            <Link to="/shop" className="btn btn-lg btn-primary text-ivory-50 border-ivory-50 hover:bg-ivory-50 hover:text-espresso shadow-subtle hover:-translate-y-0.5 transition-all">
              Shop Collection <ArrowRight className="ml-2 size-4" />
            </Link>
            <Link to="/shop/hair" className="btn btn-lg btn-secondary text-ivory-50 border-ivory-50 hover:bg-ivory-50 hover:text-espresso shadow-subtle hover:-translate-y-0.5 transition-all">
              Explore Hair <ArrowRight className="ml-2 size-4" />
            </Link>
          </motion.div>

          {/* Promotional Membership Card */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-12 inline-flex items-center gap-4 rounded-xl border border-gold-500/20 bg-[#1a1a1a]/80 p-4 backdrop-blur shadow-medium"
          >
            <div className="flex size-10 items-center justify-center rounded-full bg-gold-500/10">
              <CrownIcon className="size-5 text-gold-500" />
            </div>
            <div>
              <h3 className="font-sans text-sm font-semibold text-ivory-50">Join the Maison</h3>
              <p className="font-sans text-xs text-ivory-200">
                10% off your first order · use code <span className="text-gold-400">WELCOME</span>
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
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"/>
    </svg>
  );
}
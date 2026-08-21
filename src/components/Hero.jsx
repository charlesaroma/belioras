import { motion } from "motion/react";

export default function Hero() {
  return (
    <section className="relative h-screen w-full overflow-hidden bg-espresso">
      {/* Editorial Background Image */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="absolute inset-0"
      >
        <img
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop"
          alt="Editorial fashion photography"
          className="h-full w-full object-cover opacity-80"
          style={{ objectPosition: 'center 20%' }}
        />
        {/* Scrim for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-espresso/70 via-espresso/30 to-transparent" />
      </motion.div>

      <div className="container-main px-4 sm:px-6 md:px-8 relative flex h-full flex-col justify-center pt-20">
        <div className="max-w-full text-ivory-50 md:max-w-[50%]">
          {/* Eyebrow */}
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-gold-500"
          >
            New Season
          </motion.p>
          
          {/* Headline */}
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-6 font-display text-4xl leading-[1.15] tracking-[0.03em] md:text-[48px] lg:text-[64px]"
          >
            Quiet pieces, made to be kept
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mb-8 max-w-lg font-sans text-lg leading-relaxed text-ivory-100"
          >
            European-made dresses, ethically sourced hair and leather goods that only get better with age.
          </motion.p>

          {/* CTA Group */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-wrap items-center gap-4"
          >
            <a href="#dresses" className="btn btn-lg btn-primary shadow-medium hover:-translate-y-0.5">
              Shop Dresses <span className="ml-2">→</span>
            </a>
            <a href="#hair" className="btn btn-lg bg-transparent text-ivory-50 border border-ivory-50 hover:bg-ivory-50/10 shadow-subtle hover:-translate-y-0.5">
              Explore Hair <span className="ml-2">→</span>
            </a>
          </motion.div>

          {/* Promotional Membership Card */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-12 inline-flex items-center gap-4 rounded-xl border border-gold-500/20 bg-[#1a1a1a]/80 p-4 backdrop-blur shadow-medium"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-500/10">
              <span className="text-xl">👑</span>
            </div>
            <div>
              <h3 className="font-sans text-sm font-semibold text-ivory-50">Join the Maison</h3>
              <p className="font-sans text-xs text-ivory-200">10% off your first order · use code <span className="text-gold-400">WELCOME</span></p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

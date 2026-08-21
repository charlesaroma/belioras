import { motion } from "motion/react";

function ShopHeader() {
  return (
    <section className="relative h-[420px] md:h-[480px] overflow-hidden" aria-labelledby="shop-title">
      <img
        src="https://ik.imagekit.io/sbgenu6wj/Belioras/Home/belioras-hero-2.jpeg"
        alt="Belioras Collection"
        className="absolute inset-0 h-full w-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-espresso/90 via-espresso/50 to-espresso/10" />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 pt-16">
        <motion.p
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="text-[10px] font-bold uppercase tracking-[0.25em] text-gold-400 mb-4"
        >
          The Belioras Edit
        </motion.p>
        <motion.h1
          id="shop-title"
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
          className="font-display text-4xl md:text-5xl text-ivory-50 tracking-wide mb-4"
        >
          All Collections
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.25 }}
          className="text-sm text-ivory-50/70 max-w-md leading-relaxed"
        >
          Curated luxury fashion and premium hair, built around signature stories.
        </motion.p>
      </div>
    </section>
  );
}

export default ShopHeader;
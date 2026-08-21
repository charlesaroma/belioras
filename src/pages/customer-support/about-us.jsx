import { motion } from "motion/react";

export default function AboutUsPage() {
  return (
    <section aria-labelledby="about-title" className="overflow-hidden">
      {/* Hero Section */}
      <div className="relative h-[80svh] w-full bg-brown-100 flex items-center justify-center">
        <motion.img
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          src="https://ik.imagekit.io/sbgenu6wj/Belioras/Home/model-belioras123.jpeg"
          alt="Belioras fashion model"
          className="absolute inset-0 h-full w-full object-cover object-top opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-espresso/80 via-espresso/30 to-transparent" />
        
        <div className="relative z-10 text-center px-4 pt-32">
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-gold-500 mb-6"
          >
            The Maison
          </motion.p>
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            id="about-title" 
            className="font-display text-5xl md:text-7xl lg:text-8xl text-ivory-50 tracking-wide"
          >
            Our Heritage
          </motion.h1>
        </div>
      </div>

      {/* Narrative Content */}
      <div className="container-main py-section-mobile md:py-section-desktop">
        <div className="mx-auto max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-espresso leading-tight mb-8">
                Quiet luxury, <br />
                <span className="text-gold-700 italic">loudly crafted.</span>
              </h2>
              <p className="text-espresso/70 leading-relaxed mb-6">
                Belioras was born from a desire to return to the fundamentals of true luxury: exceptional materials, meticulous craftsmanship, and timeless silhouettes. We believe that clothing should whisper, not shout, allowing the wearer's inherent confidence to take center stage.
              </p>
              <p className="text-espresso/70 leading-relaxed">
                Every piece in our collection is thoughtfully designed to transcend seasonal trends, becoming a beloved staple in your wardrobe for years to come.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative aspect-[3/4] w-full bg-brown-50 overflow-hidden"
            >
              <div className="absolute inset-4 border border-gold-500/30 z-10" />
              <img 
                src="https://ik.imagekit.io/sbgenu6wj/Belioras/Home/model-belioras123.jpeg" 
                alt="Detail of craftsmanship"
                className="w-full h-full object-cover object-[50%_30%] filter grayscale contrast-125 mix-blend-multiply opacity-80 transition-transform duration-1000 hover:scale-105 hover:grayscale-0 hover:mix-blend-normal"
              />
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Footer Banner */}
      <div className="bg-espresso py-24 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h3 className="font-display text-3xl text-ivory-50 mb-6">Discover the Collection</h3>
          <p className="text-ivory-50/70 mb-10 leading-relaxed">
            Experience the unparalleled quality of our latest arrivals, available exclusively online.
          </p>
          <a href="/shop" className="inline-block btn bg-gold-500 text-espresso hover:bg-ivory-50 transition-colors uppercase tracking-widest text-xs font-bold px-10 py-4">
            Shop Now
          </a>
        </div>
      </div>
    </section>
  );
}
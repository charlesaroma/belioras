import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function FlashSalePopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    // Only show once per session
    if (sessionStorage.getItem("belioras_flash_shown")) return;

    const timer = setTimeout(() => {
      setIsOpen(true);
      setHasShown(true);
      sessionStorage.setItem("belioras_flash_shown", "true");
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 sm:p-6" role="dialog" aria-modal="true">
          {/* Backdrop */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-espresso/60 backdrop-blur-sm w-full h-full cursor-default border-none"
            aria-label="Close modal"
          />

          {/* Modal content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-sm overflow-hidden rounded-2xl bg-ivory-50 shadow-2xl"
          >
            {/* Image header */}
            <div className="relative h-48 w-full bg-brown-100 overflow-hidden">
              <img
                src="https://ik.imagekit.io/sbgenu6wj/Belioras/Home/hero-image-belioras.PNG"
                alt="Flash Sale"
                className="h-full w-full object-cover opacity-90 object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-espresso/80 to-transparent" />
              <div className="absolute bottom-4 left-6">
                <span className="inline-block rounded-full bg-gold-500 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-espresso mb-2">
                  Limited Time
                </span>
                <h2 className="font-display text-2xl text-ivory-50 tracking-wide">
                  Private Sale
                </h2>
              </div>
            </div>

            {/* Close button */}
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-full bg-espresso/20 text-ivory-50 backdrop-blur-md transition-colors hover:bg-espresso/40"
              aria-label="Close"
            >
              <X className="size-4" />
            </button>

            {/* Body */}
            <div className="p-6 text-center">
              <p className="mb-6 text-sm leading-relaxed text-espresso/70">
                Enjoy early access to our seasonal archives. Take an extra{" "}
                <strong className="font-semibold text-espresso">20% off</strong> all marked items.
              </p>
              
              <Link
                to="/shop"
                onClick={() => setIsOpen(false)}
                className="btn w-full bg-espresso text-ivory-50 hover:bg-gold-700 hover:text-espresso shadow-medium transition-all py-3.5 rounded-xl text-sm font-semibold uppercase tracking-widest flex items-center justify-center group"
              >
                Shop the Edit
                <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
              </Link>
              
              <button 
                type="button"
                onClick={() => setIsOpen(false)}
                className="mt-4 text-[11px] font-medium uppercase tracking-[0.1em] text-espresso/40 hover:text-espresso transition-colors"
              >
                No thanks, I'll pay full price
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

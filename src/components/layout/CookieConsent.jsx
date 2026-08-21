import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

import { useLocalStorage } from "../../hooks/useLocalStorage";
import { useAsyncData } from "../../hooks/useAsyncData";
import { getSettings } from "../../services/settingsApi";

const ACCEPTED = "accepted";
const REJECTED = "rejected";

export default function CookieConsent() {
  const { data: settings } = useAsyncData(getSettings, []);
  const [choice, setChoice] = useLocalStorage("belioras:cookies", null);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape" && choice === null) setChoice(REJECTED);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [choice, setChoice]);

  const isVisible = choice === null && !!settings;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          role="dialog"
          aria-live="polite"
          aria-label="Cookie notice"
          className="fixed bottom-6 inset-x-0 z-[70] p-4 sm:p-6 flex justify-center pointer-events-none"
        >
          <div className="pointer-events-auto flex w-full max-w-3xl flex-col md:flex-row items-center justify-between gap-6 bg-espresso/90 backdrop-blur-xl border border-ivory-50/10 shadow-2xl rounded-2xl p-6 sm:px-8">
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-sm font-semibold text-ivory-50 tracking-wide mb-1">
                Your Privacy Matters
              </h3>
              <p className="text-xs text-ivory-50/70 leading-relaxed max-w-xl">
                {settings?.cookieBanner?.text ??
                  "We use cookies to tailor your luxury shopping experience and analyze site traffic. By continuing, you agree to our privacy policy."}
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button 
                type="button" 
                className="text-[11px] font-medium uppercase tracking-widest text-ivory-50/60 hover:text-ivory-50 transition-colors px-4 py-2"
                onClick={() => setChoice(REJECTED)}
              >
                Decline
              </button>
              <button
                type="button"
                className="btn btn-sm bg-gold-500 text-espresso hover:bg-gold-400 border-transparent shadow-subtle hover:-translate-y-0.5 transition-all text-[11px] h-10 px-6 rounded-xl font-bold uppercase tracking-widest"
                onClick={() => setChoice(ACCEPTED)}
              >
                Accept
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
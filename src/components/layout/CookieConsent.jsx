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
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          role="dialog"
          aria-live="polite"
          aria-label="Cookie notice"
          className="fixed bottom-0 inset-x-0 z-[70] p-4 sm:p-6 pointer-events-none flex justify-center"
        >
          <div className="pointer-events-auto flex w-full max-w-4xl flex-col md:flex-row items-center justify-between gap-4 bg-ivory-50/95 backdrop-blur-md px-6 py-4 sm:px-8 border border-umber-50/50 shadow-large rounded-none sm:rounded-sm">
            <p className="text-xs uppercase tracking-widest text-espresso/80 text-center md:text-left leading-relaxed">
              {settings?.cookieBanner?.text ??
                "We use cookies to elevate your experience. By continuing, you agree to our privacy policy."}
            </p>
            <div className="flex items-center gap-6 shrink-0 mt-2 md:mt-0">
              <button 
                type="button" 
                className="text-[11px] font-medium uppercase tracking-[0.1em] text-umber-400 hover:text-espresso transition-colors border-b border-transparent hover:border-espresso pb-0.5" 
                onClick={() => setChoice(REJECTED)}
              >
                Decline
              </button>
              <button
                type="button"
                className="btn btn-sm bg-transparent border border-espresso text-espresso hover:bg-espresso hover:text-ivory-50 text-[11px] h-9 px-6 rounded-none"
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
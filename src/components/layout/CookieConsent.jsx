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
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (choice === null && settings) setVisible(true);
  }, [choice, settings]);

  useEffect(() => {
    if (!visible) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") setChoice(REJECTED);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [visible, setChoice]);

  if (!visible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 24 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        role="dialog"
        aria-live="polite"
        aria-label="Cookie notice"
        className="fixed inset-x-4 bottom-4 z-[70] mx-auto max-w-xl"
      >
        <div className="card p-6 shadow-large">
          <p className="text-sm leading-relaxed text-espresso/80">
            {settings?.cookieBanner?.text ??
              "We use cookies to improve your shopping experience. By continuing, you agree to our cookie policy."}
          </p>
          <div className="mt-5 flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setChoice(ACCEPTED)}
            >
              I understand
            </button>
            <button type="button" className="btn btn-ghost" onClick={() => setChoice(REJECTED)}>
              Decline
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
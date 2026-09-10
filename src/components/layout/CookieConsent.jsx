/* Layout Component: CookieConsent */
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";

import { useLocalStorage } from "../../hooks/useLocalStorage";
import { useAsyncData } from "../../hooks/useAsyncData";
import { useContentVersion } from "../../context/ContentContext";
import { useLanguage } from "../../context/LanguageContext";
import { getSettings } from "../../services/settingsApi";

const ACCEPTED = "accepted";
const REJECTED = "rejected";

export default function CookieConsent() {
  const version = useContentVersion();
  const { data: settings } = useAsyncData(getSettings, [version]);
  const { t } = useLanguage();

  // Stored as an object so consent can be re-requested when the policy version
  // changes, rather than a bare string that can never be invalidated.
  const [consent, setConsent] = useLocalStorage("belioras:cookies", null);

  const policyVersion = settings?.cookieBanner?.policyVersion ?? 1;
  const recorded = consent && typeof consent === "object" ? consent : null;
  const needsChoice = !recorded || recorded.policyVersion !== policyVersion;

  const decide = (choice) =>
    setConsent({ choice, at: new Date().toISOString(), policyVersion });

  const isVisible = needsChoice && !!settings;
  const barRef = useRef(null);

  useEffect(() => {
    const root = document.documentElement;

    if (!isVisible) {
      root.style.setProperty("--consent-bar-height", "0px");
      return undefined;
    }

    const measure = () => {
      const height = barRef.current?.offsetHeight ?? 0;
      root.style.setProperty("--consent-bar-height", `${height}px`);
    };

    measure();
    const observer = new ResizeObserver(measure);
    if (barRef.current) observer.observe(barRef.current);

    return () => {
      observer.disconnect();
      root.style.setProperty("--consent-bar-height", "0px");
    };
  }, [isVisible]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          ref={barRef}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          role="region"
          aria-live="polite"
          aria-label={t("cookies.label", "Cookie notice")}
          // Below the modal layer (50+), above ordinary page content. At
          // z-[70] this bottom-anchored bar sat over every open drawer — on a
          // phone it covered the mobile menu's whole footer, so a first-time
          // visitor could not reach Sign in until they dismissed cookies.
          className="fixed inset-x-0 bottom-0 z-[45] border-t border-gold-500/20 bg-espresso/95 backdrop-blur"
        >
          <div className="container-main flex flex-col items-center gap-5 py-5 md:flex-row md:justify-between md:gap-8">
            <div className="text-center md:text-left">
              <h2 className="mb-1 text-sm font-semibold tracking-wide text-ivory-50">
                {t("cookies.title", "Your privacy matters")}
              </h2>
              <p className="max-w-2xl text-xs leading-relaxed text-ivory-50/70">
                {settings?.cookieBanner?.text ??
                  t(
                    "cookies.text",
                    "We use cookies to keep the experience smooth and to understand how visitors use the site.",
                  )}{" "}
                <Link
                  to="/cookie-policy"
                  className="underline decoration-gold-500 underline-offset-2 hover:text-ivory-50"
                >
                  {t("cookies.readPolicy", "Read our cookie policy")}
                </Link>
                .
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-3">
              <button
                type="button"
                className="h-10 rounded-xl border border-ivory-50/40 px-6 text-[11px] font-bold uppercase tracking-widest text-ivory-50 transition-colors hover:bg-ivory-50/10"
                onClick={() => decide(REJECTED)}
              >
                {t("cookies.reject", "Reject")}
              </button>
              <button
                type="button"
                className="h-10 rounded-xl bg-gold-500 px-6 text-[11px] font-bold uppercase tracking-widest text-espresso transition-colors hover:bg-gold-400"
                onClick={() => decide(ACCEPTED)}
              >
                {t("cookies.accept", "Accept")}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

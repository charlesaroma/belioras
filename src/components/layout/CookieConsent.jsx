import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";

import { useLocalStorage } from "../../hooks/useLocalStorage";
import { useAsyncData } from "../../hooks/useAsyncData";
import { useLanguage } from "../../context/LanguageContext";
import { getSettings } from "../../services/settingsApi";

const ACCEPTED = "accepted";
const REJECTED = "rejected";

/**
 * Cookie notice.
 *
 * The only uninvited element left on the site — everything else the review
 * classed as a popup has been removed. It stays because Belioras Maison Lda
 * trades from Lisbon, so GDPR and ePrivacy apply and consent has to be
 * collected before non-essential cookies are set.
 *
 * Consequently it is a bar, not a modal: role="region" rather than "dialog",
 * no focus trap, and the page stays fully usable behind it.
 *
 * Two deliberate compliance choices:
 *  - Escape no longer records a rejection. Consent captured from a stray
 *    keypress is not consent, and silently storing one is worse than asking again.
 *  - Reject carries the same visual weight as Accept. Nudging toward Accept
 *    with a low-contrast decline link is the pattern EDPB guidance calls out.
 */
export default function CookieConsent() {
  const { data: settings } = useAsyncData(getSettings, []);
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

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          role="region"
          aria-live="polite"
          aria-label={t("cookies.label", "Cookie notice")}
          className="fixed inset-x-0 bottom-0 z-[70] border-t border-gold-500/20 bg-espresso/95 backdrop-blur"
        >
          <div className="container-main flex flex-col items-center gap-5 px-4 py-5 sm:px-6 md:flex-row md:justify-between md:gap-8">
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

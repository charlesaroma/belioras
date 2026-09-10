/* Layout Component: BackToTop */
import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

import { cn } from "../../utils/cn";

/* REVEAL AT */
const REVEAL_AT = 600;

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  /* Scroll Handler */
  useEffect(() => {

    const onScroll = () => setVisible(window.scrollY > REVEAL_AT);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

/* scroll To Top */
  const scrollToTop = () => {

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Back to top"
      title="Back to top"
      // Kept mounted and faded rather than unmounted, so it animates out
      // instead of vanishing. inert while hidden keeps it off the tab order.
      inert={!visible || undefined}
      className={cn(
        "fixed right-4 z-[60] flex size-11 items-center justify-center rounded-full sm:right-6",
        "border border-gold-500/30 bg-espresso/90 text-gold-400 shadow-large backdrop-blur",
        "transition-all duration-300 hover:bg-espresso hover:text-gold-300",
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0",
      )}
      style={{ bottom: "calc(1.5rem + var(--consent-bar-height, 0px))" }}
    >
      <ArrowUp className="size-5" aria-hidden="true" />
    </button>
  );
}

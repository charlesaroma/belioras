/* Navbar Chrome */
import { useEffect, useLayoutEffect, useRef, useState } from "react";

const SCROLL_THRESHOLD = 10;

/**
 * Publishes the header's measured height as --header-height and tracks scroll.
 *
 * The height was guessed before (pt-32 against an actual 138px), which is the
 * failure mode: it is a function of the announcement bar, the logo size and
 * the breakpoint, so any hardcoded value is wrong as soon as one changes.
 * useLayoutEffect so it is set before paint and content never jumps.
 */
export function useNavbarChrome() {
  const headerRef = useRef(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useLayoutEffect(() => {
    const el = headerRef.current;
    if (!el) return undefined;

    const publish = () =>
      document.documentElement.style.setProperty("--header-height", `${el.offsetHeight}px`);

    publish();
    const observer = new ResizeObserver(publish);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > SCROLL_THRESHOLD);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return { headerRef, isScrolled };
}

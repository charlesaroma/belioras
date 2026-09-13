/* Carousel Autoplay */
import { useEffect } from "react";

const CARD_GAP = 20;

/** Moves a rail one card in either direction. */
export function scrollTrack(track, direction) {
  if (!track) return;
  const cardWidth = track.firstChild?.offsetWidth ?? 300;
  track.scrollBy({ left: direction * (cardWidth + CARD_GAP), behavior: "smooth" });
}

/**
 * Advances a product rail one card at a time, back to the start after the last.
 *
 * It holds still whenever the shopper is engaged with the rail or cannot see
 * it: pointer over it, keyboard focus inside it, a finger on it, the rail out
 * of view, or the tab in the background. Content sliding away while someone
 * reads or reaches for it is what makes autoplay hated, and WCAG 2.2.2 asks
 * that it pause. Visitors who ask for reduced motion get none at all.
 */
export function useCarouselAutoplay({ containerRef, trackRef, interval = 4000, enabled = true }) {
  useEffect(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    if (!enabled || !container || !track) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    let hovered = false;
    let focused = false;
    let touching = false;
    let visible = true;

    const tick = () => {
      if (hovered || focused || touching || !visible || document.hidden) return;
      if (track.scrollWidth <= track.clientWidth + 1) return;

      const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;
      if (atEnd) track.scrollTo({ left: 0, behavior: "smooth" });
      else scrollTrack(track, 1);
    };

    let timer = setInterval(tick, interval);
    // A manual move restarts the count, so autoplay never steps straight after one.
    const restart = () => {
      clearInterval(timer);
      timer = setInterval(tick, interval);
    };

    const listen = (el, type, fn) => {
      el.addEventListener(type, fn, { passive: true });
      return () => el.removeEventListener(type, fn);
    };

    const unlisten = [
      listen(container, "pointerenter", (e) => {
        if (e.pointerType === "mouse") hovered = true;
      }),
      listen(container, "pointerleave", () => {
        hovered = false;
        restart();
      }),
      // Only keyboard focus pauses. A mouse click also focuses the arrow button
      // in Chrome, and pausing on that would stop the rail for good.
      listen(container, "focusin", (e) => {
        focused = Boolean(e.target.matches?.(":focus-visible"));
      }),
      listen(container, "focusout", (e) => {
        if (container.contains(e.relatedTarget)) return;
        focused = false;
        restart();
      }),
      listen(track, "touchstart", () => {
        touching = true;
      }),
      listen(track, "touchend", () => {
        touching = false;
        restart();
      }),
      listen(track, "touchcancel", () => {
        touching = false;
        restart();
      }),
      listen(container, "click", restart),
    ];

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    observer.observe(container);

    return () => {
      clearInterval(timer);
      unlisten.forEach((off) => off());
      observer.disconnect();
    };
  }, [containerRef, trackRef, interval, enabled]);
}

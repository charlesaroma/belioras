/* Ui Component: LiquidPress */
import { useEffect } from "react";

/**
 * Plays the liquid press on whichever `.liquid-hover` button is pressed, by
 * mouse, finger or keyboard. CSS alone can't: `:active` lasts only as long as
 * the press, which on a phone is too short for the animation to be seen. One
 * listener for the whole app; renders nothing.
 */
export default function LiquidPress() {
  useEffect(() => {
    const press = (target) => {
      const el = target instanceof Element ? target.closest(".liquid-hover") : null;
      if (!el || el.disabled) return;
      el.classList.remove("is-pressed");
      // Reading layout restarts the animation when the same button is pressed again.
      void el.offsetWidth;
      el.classList.add("is-pressed");
      const done = () => el.classList.remove("is-pressed");
      el.addEventListener("animationend", done, { once: true });
      setTimeout(done, 700);
    };
    const onPointer = (e) => press(e.target);
    const onKey = (e) => (e.key === "Enter" || e.key === " ") && press(e.target);
    document.addEventListener("pointerdown", onPointer, { passive: true });
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, []);
  return null;
}

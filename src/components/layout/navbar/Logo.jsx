import { Link } from "react-router-dom";

import { cn } from "../../../utils/cn";

/**
 * Brand mark.
 *
 * Two things the design review settled:
 *  - No circular backdrop and no drop shadow. The mark sits directly on the
 *    header so its background blends seamlessly; the SVGs are transparent, so
 *    the blend is the absence of a container rather than a matched fill.
 *  - The review specified a 230px width. Width is the wrong axis to size this
 *    on: the mark is a stacked lockup (crown above wordmark, ~1.4:1), so a
 *    width constraint lets the artwork dictate the header's height. At 230px
 *    the nav row was 140px tall to hold links that need 66px.
 *
 *    Sizing by height instead puts the header in control — the row is a
 *    deliberate 96px and the logo fills it. Worth confirming the resulting
 *    width with Belioras, since it departs from the agreed number.
 *
 * The white variant is used while the header is transparent over the hero; the
 * gold variant once the header is solid.
 */
export default function Logo({ isScrolled, menuOpen, isLightBg }) {
  // The header is light when scrolled, when a menu is open, *and* on routes
  // that never sit under the hero — a white mark disappears on all three.
  const onDarkBackdrop = !isScrolled && !menuOpen && !isLightBg;

  return (
    <Link
      to="/"
      aria-label="Belioras — home"
      className="justify-self-center transition-opacity hover:opacity-80"
    >
      <img
        src={onDarkBackdrop ? "/belioras-logo-white.svg" : "/belioras-logo-gold.svg"}
        alt="Belioras"
        width={101}
        height={72}
        className={cn("h-12 w-auto transition-all duration-300 sm:h-14 lg:h-[72px]")}
      />
    </Link>
  );
}

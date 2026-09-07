import { Link } from "react-router-dom";

import { cn } from "../../../utils/cn";

/**
 * Brand mark.
 *
 * Two things the design review settled:
 *  - No circular backdrop and no drop shadow. The mark sits directly on the
 *    header so its background blends seamlessly; the SVGs are transparent, so
 *    the blend is the absence of a container rather than a matched fill.
 *  - 230px is the desktop width. On a 375px phone that would fill the entire
 *    bar, so it ramps up rather than being applied flat.
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
        width={230}
        height={153}
        className={cn(
          "h-auto w-[150px] transition-all duration-300 sm:w-[180px] lg:w-[230px]",
        )}
      />
    </Link>
  );
}

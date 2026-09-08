import { Link } from "react-router-dom";

import { cn } from "../../../utils/cn";

/** The brand mark, used in one form everywhere. */
const LOGO_SRC = "/belioras-boutique-primary-logo-rgb-belioras-original.svg";

/**
 * Brand mark.
 *
 * One asset in every context, per the brand direction — no light/dark variant
 * swap. It sits directly on the header with no container, so the background
 * blends seamlessly; the drop shadow and circular backdrop the design review
 * rejected are both gone.
 *
 * The review specified a 230px width, but width is the wrong axis to size
 * this on — see the note on the img below. It is sized by height instead, at
 * 67px on desktop, a deliberate departure worth confirming with Belioras.
 */
export default function Logo() {
  return (
    <Link
      to="/"
      aria-label="Belioras — home"
      className="justify-self-center transition-opacity hover:opacity-80"
    >
      <img
        src={LOGO_SRC}
        alt="Belioras"
        width={91}
        height={67}
        // Sized by HEIGHT, not width. The mark is a stacked lockup (~1.36:1),
        // so constraining its width lets the artwork dictate the header's
        // height — which is what made the navbar 182px tall. Height-based puts
        // the header in control; 67px is the 72px that worked, less 7%.
        className={cn("w-auto transition-all duration-300 h-[45px] sm:h-[52px] lg:h-[67px]")}
      />
    </Link>
  );
}

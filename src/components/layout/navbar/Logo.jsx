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
 * The review specified 230px. In the built navbar that reads oversized and
 * forces the header taller than the nav row needs, so it sits at 170px on
 * desktop and ramps down from there.
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
        width={170}
        height={125}
        className={cn("h-auto w-[110px] transition-all duration-300 sm:w-[130px] lg:w-[170px]")}
      />
    </Link>
  );
}

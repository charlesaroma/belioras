/* Shared Component: BrandMark */
import { Link } from "react-router-dom";

import { cn } from "../../utils/cn";

/* LOGO SRC */
const LOGO_SRC = "/belioras-boutique-primary-logo-rgb-belioras-original.svg";

const SIZES = {
  sm: "h-10",
  md: "h-14",
  lg: "h-[45px] sm:h-[52px] lg:h-[67px]",
};

export default function BrandMark({
  size = "md",
  to = "/",
  className,
  // Applied to the link, not the image — the link is what a parent grid or
  // flex row positions, so alignment classes belong there.
  wrapperClassName,
  label = "Belioras — home",
}) {

  const image = (
    <img
      src={LOGO_SRC}
      alt="Belioras"
      width={91}
      height={67}
      className={cn("w-auto transition-all duration-300", SIZES[size] ?? SIZES.md, className)}
    />
  );

  // `to={null}` renders the mark without a link, for the one place it is
  // already inside a link of its own.
  if (!to) return image;

  return (
    <Link
      to={to}
      aria-label={label}
      className={cn("inline-block transition-opacity hover:opacity-80", wrapperClassName)}
    >
      {image}
    </Link>
  );
}

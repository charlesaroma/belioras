/* Brand Blurb Socials And GPSR */
import { Link } from "react-router-dom";

import { InstagramIcon } from "./FooterIcons";

export default function FooterBrand({ social }) {
  const networks = [
    { label: "Pinterest", href: social?.pinterest },
    { label: "TikTok", href: social?.tiktok },
  ].filter((n) => n.href);

  return (
    <div className="border-b border-espresso/10 pb-8 md:border-none md:pb-0">
      {/* Set rather than drawn: the logo asset is a 587KB raster, and the
          wordmark in the display serif is the same mark for no weight. */}
      <Link
        to="/"
        className="font-display text-[26px] leading-none tracking-[0.24em] text-espresso transition-colors hover:text-gold-700"
      >
        BELIORAS
      </Link>

      <p className="mt-6 max-w-[30ch] text-[13px] leading-[1.8] text-espresso/60">
        Quiet pieces, made to be kept. European-made dresses, ethically sourced hair and leather
        goods that only get better with age.
      </p>

      <div className="mt-7 flex items-center gap-5">
        <a
          href={social?.instagram ?? "https://instagram.com"}
          target="_blank"
          rel="noopener noreferrer"
          className="-ml-2.5 flex size-11 items-center justify-center text-espresso/50 transition-colors hover:text-gold-700 md:ml-0 md:size-auto"
          aria-label="Belioras on Instagram"
        >
          <InstagramIcon className="size-[18px]" />
        </a>
        {networks.map((net) => (
          <a
            key={net.label}
            href={net.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-11 items-center text-[10px] uppercase tracking-[0.2em] text-espresso/50 transition-colors hover:text-gold-700 md:min-h-0"
          >
            {net.label}
          </a>
        ))}
      </div>
    </div>
  );
}

// EU General Product Safety Regulation requires a reachable responsible
// person. It is a legal line, not a selling one, so it sits at the quietest
// weight the palette allows rather than in caps competing with the columns.
export function FooterCompliance({ gpsr }) {
  if (!gpsr) return null;

  return (
    <p className="text-[11px] leading-[1.9] text-espresso/35">
      {gpsr.manufacturer}, {gpsr.address}
      <span className="mx-2 hidden text-espresso/20 sm:inline">·</span>
      <br className="sm:hidden" />
      Product safety: {gpsr.email}
    </p>
  );
}

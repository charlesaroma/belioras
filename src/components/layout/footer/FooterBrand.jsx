/* Brand Blurb Socials And GPSR */
import { InstagramIcon } from "./FooterIcons";

export default function FooterBrand({ social, gpsr }) {
  const networks = [
    { label: "Pinterest", href: social?.pinterest },
    { label: "TikTok", href: social?.tiktok },
  ].filter((n) => n.href);

  return (
    <div className="border-b border-espresso/10 pb-6 md:border-none md:pb-0">
      <p className="max-w-xs text-sm leading-relaxed text-espresso/70">
        Quiet pieces, made to be kept. European-made dresses, ethically sourced hair and leather
        goods that only get better with age.
      </p>

      <div className="mt-6 flex items-center gap-4 md:mt-8">
        <a
          href={social?.instagram ?? "https://instagram.com"}
          target="_blank"
          rel="noopener noreferrer"
          className="flex size-11 items-center justify-center text-espresso/80 transition-colors hover:text-gold-700 md:size-auto"
          aria-label="Belioras on Instagram"
        >
          <InstagramIcon className="size-5" />
        </a>
        {networks.map((net) => (
          <a
            key={net.label}
            href={net.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-11 items-center text-[11px] font-semibold uppercase tracking-[0.18em] text-espresso/80 transition-colors hover:text-gold-700 md:min-h-0"
          >
            {net.label}
          </a>
        ))}
      </div>

      {/* EU General Product Safety Regulation requires a reachable
          responsible person on every storefront. */}
      <p className="mt-6 text-[11px] uppercase leading-relaxed tracking-widest text-espresso/60 md:mt-8">
        {gpsr?.manufacturer}, {gpsr?.address}
        <br />
        Product safety: {gpsr?.email}
      </p>
    </div>
  );
}

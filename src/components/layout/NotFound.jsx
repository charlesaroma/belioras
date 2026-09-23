/* Layout Component: NotFound */
import { Link } from "react-router-dom";
import { Compass } from "lucide-react";

const QUICK_LINKS = [
  { label: "New Arrivals", url: "/new-arrivals" },
  { label: "Dresses", url: "/dresses" },
  { label: "Hair", url: "/hair" },
  { label: "Accessories", url: "/accessories" },
];

export default function NotFound() {
  return (
    <section className="container-main py-20 md:py-28">
      <div className="mx-auto max-w-lg text-center">
        <span className="mx-auto mb-6 flex size-12 items-center justify-center border border-umber-50 text-gold-700">
          <Compass className="size-5" strokeWidth={1.5} aria-hidden="true" />
        </span>

        <p className="eyebrow">Error 404</p>
        <h1 className="mt-3 font-display text-4xl text-espresso sm:text-5xl">
          We can&rsquo;t find that page
        </h1>
        <p className="mx-auto mt-4 max-w-sm text-[15px] leading-relaxed text-espresso-soft">
          It may have moved, or the address may no longer be current. Head back to the shop, or
          pick up from one of our collections below.
        </p>

        <Link to="/shop" className="btn btn-primary btn-lg mt-8">
          Back to shop
        </Link>

        <div className="mt-12 border-t border-umber-50 pt-8">
          <p className="eyebrow">Or start here</p>
          <nav aria-label="Popular collections" className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
            {QUICK_LINKS.map((link) => (
              <Link
                key={link.url}
                to={link.url}
                className="text-[13px] font-medium uppercase tracking-[0.08em] text-espresso-soft transition-colors hover:text-gold-700"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </section>
  );
}

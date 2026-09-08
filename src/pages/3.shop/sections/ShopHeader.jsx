import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

/**
 * Catalog page header — /shop and every category route.
 *
 * No image. The previous version was a 420-480px full-bleed banner reusing
 * the same stock photograph on every category — Dresses, Hair, Accessories
 * and every faceted URL beneath them all showed the identical image, which
 * reads as filler rather than as anything specific to what's being browsed,
 * and pushes the actual product a full screen down before a shopper sees any.
 *
 * Replaced with the typographic language already used everywhere else on the
 * site — New Arrivals, Best Sellers and Featured Collection all render a
 * centred serif heading over a short gold rule. Using it here too means the
 * catalog page finally looks like part of the same site instead of a
 * different template, and it collapses roughly 450px of banner into about 90.
 */
function ShopHeader({ title = "All Collections", breadcrumb = [] }) {
  return (
    <header
      className="border-b border-umber-50 bg-ivory-50 pb-10 text-center md:pb-14"
      // The navbar is fixed, so page content needs to clear it explicitly.
      // Offsetting by the measured --header-height (see navbar/index.jsx)
      // rather than a guessed value — the same fix the product page needed
      // after pt-32 fell short of the navbar's actual 138px. This header is no
      // longer tall enough on its own to fall below the navbar by accident.
      style={{ paddingTop: "calc(var(--header-height, 138px) + 2.5rem)" }}
    >
      {/* A single-item trail just repeats the h1 below it — Dresses > Dresses
          tells a shopper nothing a root category page's own title doesn't.
          Only worth showing once there's an actual hierarchy to trace. */}
      {breadcrumb.length > 1 && (
        <nav aria-label="Breadcrumb" className="mb-4">
          <ol className="flex items-center justify-center gap-1.5 text-[11px] uppercase tracking-[0.18em] text-espresso/40">
            {breadcrumb.map((crumb, i) => (
              <li key={crumb.url} className="flex items-center gap-1.5">
                {i > 0 && <ChevronRight className="size-3" aria-hidden="true" />}
                {i === breadcrumb.length - 1 ? (
                  <span aria-current="page" className="text-gold-700">
                    {crumb.label}
                  </span>
                ) : (
                  <Link to={crumb.url} className="transition-colors hover:text-espresso">
                    {crumb.label}
                  </Link>
                )}
              </li>
            ))}
          </ol>
        </nav>
      )}

      <h1 id="shop-title" className="font-display text-3xl text-espresso md:text-4xl">
        {title}
      </h1>
      <span aria-hidden="true" className="mx-auto mt-4 block h-px w-12 bg-gold-500" />
    </header>
  );
}

export default ShopHeader;

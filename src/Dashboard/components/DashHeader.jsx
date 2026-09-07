import { Link } from "react-router-dom";
import { ArrowUpRight, Menu } from "lucide-react";

/**
 * Admin page header.
 *
 * Sticky, with the page name set in the display serif and a hairline rule —
 * the same typographic voice as the storefront, rather than the bold sans a
 * generic admin template would use.
 */
export default function DashHeader({ title, onMenuToggle, showMenuButton = true }) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-umber-50 bg-ivory-50/95 px-5 py-5 backdrop-blur sm:px-8 lg:px-10">
      <div className="flex min-w-0 items-center gap-3">
        {showMenuButton && (
          <button
            type="button"
            onClick={onMenuToggle}
            className="flex size-10 shrink-0 items-center justify-center rounded-full text-espresso transition-colors hover:bg-umber-50 lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="size-5" aria-hidden="true" />
          </button>
        )}
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gold-700">
            Belioras Atelier
          </p>
          <h1 className="truncate font-display text-2xl leading-tight text-espresso">{title}</h1>
        </div>
      </div>

      {/* Opens in a new tab: an admin checking the storefront mid-edit should
          not lose their place in the dashboard. */}
      <Link
        to="/"
        target="_blank"
        rel="noreferrer"
        className="inline-flex shrink-0 items-center gap-1.5 border border-espresso px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-espresso transition-colors hover:bg-espresso hover:text-ivory-50"
      >
        View store
        <ArrowUpRight className="size-3.5" aria-hidden="true" />
      </Link>
    </header>
  );
}

/* Admin Dashboard: DashHeader */
import { Link } from "react-router-dom";
import { ArrowUpRight, Menu } from "lucide-react";

export default function DashHeader({ title, onMenuToggle, showMenuButton = true, actionsRef }) {
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

      <div className="flex shrink-0 items-center gap-2">
        {/* Opens in a new tab: an admin checking the storefront mid-edit should
            not lose their place in the dashboard. Icon-only on a phone, so a
            page's own action still fits beside it. */}
        <Link
          to="/"
          target="_blank"
          rel="noreferrer"
          aria-label="View store"
          className="inline-flex h-10 items-center gap-1.5 border border-espresso px-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-espresso transition-colors hover:bg-espresso hover:text-ivory-50 sm:px-4"
        >
          <span className="hidden sm:inline">View store</span>
          <ArrowUpRight className="size-3.5" aria-hidden="true" />
        </Link>
        {/* A page's main action lands here (DashHeaderActions). */}
        <div ref={actionsRef} className="flex items-center gap-2 empty:hidden" />
      </div>
    </header>
  );
}

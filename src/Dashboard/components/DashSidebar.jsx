import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  LayoutGrid,
  LogOut,
  Package,
  Settings,
  ShoppingCart,
  Users,
  X,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { cn } from "../../utils/cn";
import { DASHBOARD_NAV_ITEMS } from "../lib/constants";

const iconMap = { LayoutDashboard, Package, LayoutGrid, ShoppingCart, Users, Settings };

/**
 * Admin navigation.
 *
 * On brand espresso rather than the near-black #1a1a1a it used to hardcode —
 * a shade off the brand's own black reads as a different product.
 *
 * The active state is a gold hairline and a lift in text colour instead of a
 * filled gold pill with a coloured shadow. On a dark ground a solid accent
 * block is the loudest thing on the page, which is the wrong emphasis for
 * something a user sees on every screen.
 */
export default function DashSidebar({ isOpen, onClose }) {
  const { pathname } = useLocation();
  const { user, logout, can } = useAuth();
  const navigate = useNavigate();

  // Only the sections this person can actually use.
  const navItems = DASHBOARD_NAV_ITEMS.filter(
    (item) => !item.capability || can(item.capability),
  );

  return (
    <>
      {isOpen && (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-40 bg-espresso/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-espresso text-ivory-50",
          "transition-transform duration-300 ease-in-out lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-ivory-50/10 px-6 py-6">
          <Link to="/" aria-label="Belioras — storefront">
            <img src="/belioras-boutique-primary-logo-rgb-belioras-original.svg" alt="Belioras" className="h-14 w-auto" />
          </Link>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="text-ivory-50/50 transition-colors hover:text-ivory-50 lg:hidden"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-6" aria-label="Dashboard">
          <ul className="space-y-0.5">
            {navItems.map((item) => {
              const Icon = iconMap[item.icon];
              const to = item.id === "overview" ? "/dashboard" : `/dashboard/${item.id}`;
              const isActive =
                item.id === "overview" ? pathname === "/dashboard" : pathname.startsWith(to);

              return (
                <li key={item.id}>
                  <Link
                    to={to}
                    onClick={onClose}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "relative flex items-center gap-3 px-4 py-3 text-[13px] tracking-[0.04em] transition-colors",
                      isActive
                        ? "text-gold-400"
                        : "text-ivory-50/55 hover:bg-ivory-50/5 hover:text-ivory-50",
                    )}
                  >
                    {isActive && (
                      <span
                        aria-hidden="true"
                        className="absolute inset-y-2 left-0 w-px bg-gold-500"
                      />
                    )}
                    <Icon className="size-[18px]" strokeWidth={1.5} aria-hidden="true" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="shrink-0 border-t border-ivory-50/10 p-4">
          <div className="mb-3 flex items-center gap-3 px-1">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gold-500 text-sm font-semibold text-espresso">
              {(user?.name ?? user?.email ?? "A").slice(0, 1).toUpperCase()}
            </span>
            <div className="min-w-0">
              {/* Reads the signed-in account rather than the hardcoded
                  "Admin User" it previously always showed. */}
              <p className="truncate text-[13px] text-ivory-50">{user?.name ?? "Signed out"}</p>
              <p className="truncate text-[11px] text-ivory-50/45">{user?.email ?? "—"}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={async () => {
              // Same ordering as the account area: leave the guarded route
              // before the session disappears, or the guard redirects first.
              navigate("/atelier", { replace: true });
              if (typeof logout === "function") await logout();
            }}
            className="flex w-full items-center gap-2.5 px-4 py-2.5 text-[12px] uppercase tracking-[0.14em] text-ivory-50/55 transition-colors hover:bg-ivory-50/5 hover:text-ivory-50"
          >
            <LogOut className="size-4" strokeWidth={1.5} aria-hidden="true" />
            Sign out
          </button>
        </div>
      </aside>
    </>
  );
}

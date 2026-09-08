import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  ShieldCheck,
  ShoppingCart,
  Tags,
  Users,
  X,
} from "lucide-react";

import Avatar from "../../components/account/Avatar";
import BrandMark from "../../components/shared/BrandMark";
import { useAuth } from "../../context/AuthContext";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { cn } from "../../utils/cn";
import { DASHBOARD_NAV_GROUPS } from "../lib/constants";

const iconMap = { LayoutDashboard, Package, Tags, Menu, ShoppingCart, Users, ShieldCheck, Settings };

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
 *
 * Grouped, because eight flat items is a list you scan and a structure is
 * something you learn. A group disappears entirely when the signed-in person
 * holds none of its capabilities, so staff never see a heading over nothing.
 *
 * Collapsing is desktop only and remembered. On a phone the sidebar is already
 * a drawer that closes on navigation, so a second collapsed state there would
 * be a control with nothing to do.
 */
export default function DashSidebar({ isOpen, onClose }) {
  const { pathname } = useLocation();
  const { user, logout, can } = useAuth();
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useLocalStorage("belioras:dash:collapsed", false);

  const groups = DASHBOARD_NAV_GROUPS.map((group) => ({
    ...group,
    items: group.items.filter((item) => !item.capability || can(item.capability)),
  })).filter((group) => group.items.length > 0);

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
          "fixed inset-y-0 left-0 z-50 flex flex-col bg-espresso text-ivory-50",
          "transition-[transform,width] duration-300 ease-in-out lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
          // The drawer keeps its full width on a phone whatever the desktop
          // preference is; only the lg width responds to it.
          collapsed ? "w-64 lg:w-[72px]" : "w-64",
        )}
      >
        <div
          className={cn(
            "flex shrink-0 items-center border-b border-ivory-50/10 py-6",
            collapsed ? "justify-between px-4 lg:justify-center lg:px-0" : "justify-between px-6",
          )}
        >
          <BrandMark
            label="Belioras — storefront"
            size={collapsed ? "sm" : "md"}
            className={collapsed ? "lg:h-8" : undefined}
          />

          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="text-ivory-50/50 transition-colors hover:text-ivory-50 lg:hidden"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-5" aria-label="Dashboard">
          {groups.map((group) => (
            <div key={group.id} className="mb-5 last:mb-0">
              {group.label && (
                <p
                  className={cn(
                    "mb-1.5 px-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-ivory-50/30",
                    // Hidden rather than removed when collapsed: a screen
                    // reader still benefits from the grouping.
                    collapsed && "lg:sr-only",
                  )}
                >
                  {group.label}
                </p>
              )}

              <ul className="space-y-0.5">
                {group.items.map((item) => {
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
                        // The label is the accessible name when it is visible;
                        // collapsed, the title carries it instead.
                        title={collapsed ? item.label : undefined}
                        className={cn(
                          "relative flex items-center gap-3 py-3 text-[13px] tracking-[0.04em] transition-colors",
                          collapsed ? "px-4 lg:justify-center lg:px-0" : "px-4",
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
                        <Icon className="size-[18px] shrink-0" strokeWidth={1.5} aria-hidden="true" />
                        <span className={cn(collapsed && "lg:hidden")}>{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="shrink-0 border-t border-ivory-50/10 p-3">
          <button
            type="button"
            onClick={() => setCollapsed((v) => !v)}
            aria-pressed={collapsed}
            className={cn(
              "mb-2 hidden w-full items-center gap-2.5 px-4 py-2.5 text-[11px] uppercase tracking-[0.14em] text-ivory-50/40 transition-colors hover:bg-ivory-50/5 hover:text-ivory-50 lg:flex",
              collapsed && "lg:justify-center lg:px-0",
            )}
          >
            {collapsed ? (
              <PanelLeftOpen className="size-4 shrink-0" strokeWidth={1.5} aria-hidden="true" />
            ) : (
              <PanelLeftClose className="size-4 shrink-0" strokeWidth={1.5} aria-hidden="true" />
            )}
            <span className={cn(collapsed && "lg:hidden")}>Collapse</span>
          </button>

          <div
            className={cn(
              "mb-2 flex items-center gap-3 px-1",
              collapsed && "lg:justify-center lg:px-0",
            )}
          >
            <Avatar user={user} size="sm" />
            <div className={cn("min-w-0", collapsed && "lg:hidden")}>
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
            title={collapsed ? "Sign out" : undefined}
            className={cn(
              "flex w-full items-center gap-2.5 py-2.5 text-[12px] uppercase tracking-[0.14em] text-ivory-50/55 transition-colors hover:bg-ivory-50/5 hover:text-ivory-50",
              collapsed ? "px-4 lg:justify-center lg:px-0" : "px-4",
            )}
          >
            <LogOut className="size-4 shrink-0" strokeWidth={1.5} aria-hidden="true" />
            <span className={cn(collapsed && "lg:hidden")}>Sign out</span>
          </button>
        </div>
      </aside>
    </>
  );
}

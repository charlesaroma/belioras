import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Menu, Package, Settings, ShieldCheck, ShoppingCart, Tags, Users,
} from "lucide-react";

import { cn } from "../../../utils/cn";

const iconMap = { LayoutDashboard, Package, Tags, Menu, ShoppingCart, Users, ShieldCheck, Settings };

/** The grouped destination list, filtered to what this role may open. */
export default function SidebarNav({ groups, collapsed, onNavigate }) {
  const { pathname } = useLocation();

  return (
    <nav className="flex-1 overflow-y-auto px-3 py-5" aria-label="Dashboard">
      {groups.map((group) => (
        <div key={group.id} className="mb-5 last:mb-0">
          {group.label && (
            <p
              className={cn(
                "mb-1.5 px-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-ivory-50/30",
                // Hidden rather than removed when collapsed: a screen reader
                // still benefits from the grouping.
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
                    onClick={onNavigate}
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
                      <span aria-hidden="true" className="absolute inset-y-2 left-0 w-px bg-gold-500" />
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
  );
}

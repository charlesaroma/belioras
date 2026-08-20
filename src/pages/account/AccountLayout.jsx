import { Link, NavLink, Outlet } from "react-router-dom";
import { LayoutDashboard, LogOut, MapPin, Package, ShoppingBag, UserRound } from "lucide-react";

import { useAuth } from "../../context/AuthContext";

const NAV = [
  { to: "/account", end: true, label: "Overview", icon: UserRound },
  { to: "/account/orders", label: "Orders", icon: Package },
  { to: "/account/addresses", label: "Addresses", icon: MapPin },
  { to: "/account/wishlist", label: "Wishlist", icon: ShoppingBag },
];

export default function AccountLayout() {
  const { user, logout } = useAuth();
  const isAdmin = user?.role === "super-admin" || user?.role === "staff";

  return (
    <div className="min-h-dvh bg-ivory-50 text-espresso">
      <header className="border-b border-umber-50 bg-white/60">
        <div className="container-main flex h-16 items-center justify-between">
          <Link to="/" className="font-display text-lg font-medium tracking-wide">
            Belioras
          </Link>
          <span className="text-sm text-espresso-soft">Your Account</span>
        </div>
      </header>

      <div className="container-main grid gap-8 py-10 lg:grid-cols-[240px_1fr] lg:py-14">
        <aside>
          <div className="flex items-center gap-3 rounded-2xl border border-umber-50 bg-white p-4">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gold-500 font-semibold text-espresso">
              {(user?.name ?? user?.email ?? "U").slice(0, 1).toUpperCase()}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{user?.name}</p>
              <p className="truncate text-xs text-espresso-soft">{user?.email}</p>
            </div>
          </div>

          <nav className="mt-4 flex flex-col gap-1" aria-label="Account">
            {NAV.map(({ to, end, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                    isActive
                      ? "bg-brown-50 font-medium text-gold-700"
                      : "text-espresso hover:bg-brown-50"
                  }`
                }
              >
                <Icon className="size-4" aria-hidden="true" />
                {label}
              </NavLink>
            ))}
            <button
              type="button"
              onClick={logout}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-espresso-soft transition-colors hover:bg-brown-50"
            >
              <LogOut className="size-4" aria-hidden="true" />
              Sign out
            </button>
          </nav>

          <p className="mt-6 hidden text-xs text-espresso-soft lg:block">
            {isAdmin ? (
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 underline underline-offset-4 hover:text-gold-700"
              >
                <LayoutDashboard className="size-3.5" aria-hidden="true" />
                Admin dashboard
              </Link>
            ) : (
              "Need help? Reach out via the contact page."
            )}
          </p>
        </aside>

        <main className="min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
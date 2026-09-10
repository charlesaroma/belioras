/* Customer Dashboard: AccountLayout */
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Heart, LayoutDashboard, LogOut, MapPin, Package, Settings, UserRound } from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { cn } from "../utils/cn";

const NAV = [
  { to: "/account", end: true, label: "Overview", icon: UserRound },
  { to: "/account/orders", label: "Orders", icon: Package },
  { to: "/account/wishlist", label: "Saved pieces", icon: Heart },
  { to: "/account/addresses", label: "Addresses", icon: MapPin },
  { to: "/account/settings", label: "Settings", icon: Settings },
];

export default function AccountLayout() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <div
      className="px-6 pb-24 md:px-10"
      style={{ paddingTop: "calc(var(--header-height, 138px) + 2.5rem)" }}
    >
      <div className="mx-auto max-w-[1400px]">
        <header className="border-b border-umber-50 pb-6">
          <p className="eyebrow">Your account</p>
          <h1 className="mt-2 font-display text-4xl leading-tight text-espresso md:text-5xl">
            {user?.name?.split(" ")[0] ?? "Welcome"}
          </h1>
        </header>

        <div className="grid gap-10 pt-8 lg:grid-cols-[220px_1fr]">
          <aside>
            <nav aria-label="Account" className="flex flex-col">
              {NAV.map(({ to, end, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 border-b border-umber-50 py-3 text-[13px] tracking-[0.02em] transition-colors",
                      isActive ? "text-gold-700" : "text-espresso-soft hover:text-espresso",
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        className={cn("size-4", isActive && "text-gold-700")}
                        strokeWidth={1.5}
                        aria-hidden="true"
                      />
                      {label}
                    </>
                  )}
                </NavLink>
              ))}

              <button
                type="button"
                onClick={async () => {
                  // Leave the guarded route first. Clearing the session while
                  // still on /account re-renders RequireAuth, which redirects
                  // to the sign-in page before this navigate can run — so a
                  // shopper signing out landed on a login form they had just
                  // walked away from.
                  navigate("/", { replace: true });
                  await logout();
                }}
                className="flex items-center gap-3 py-3 text-left text-[13px] text-espresso-soft transition-colors hover:text-error"
              >
                <LogOut className="size-4" strokeWidth={1.5} aria-hidden="true" />
                Sign out
              </button>
            </nav>

            {isAdmin && (
              <Link
                to="/dashboard"
                className="mt-6 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-espresso-soft underline underline-offset-4 transition-colors hover:text-gold-700"
              >
                <LayoutDashboard className="size-3.5" aria-hidden="true" />
                Atelier dashboard
              </Link>
            )}
          </aside>

          {/* Keyed on the path so each page mounts fresh, rather than carrying
              the previous page's form state into the next one. */}
          <main key={pathname} className="min-w-0">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

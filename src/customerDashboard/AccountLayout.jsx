/* Customer Dashboard: AccountLayout */
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { accountMenuItems } from "../components/account/accountMenuItems";
import { cn } from "../utils/cn";

export default function AccountLayout() {
  const { user, isAdmin, logout } = useAuth();
  const { t } = useLanguage();

  // The same list the header dropdown and the mobile drawer render. This rail
  // kept its own copy, so adding Wardrobe reached both of those and not this.
  const nav = accountMenuItems({ t, isAdmin });

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
              {nav.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  // Overview would otherwise match every nested account route.
                  end={to === "/account"}
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

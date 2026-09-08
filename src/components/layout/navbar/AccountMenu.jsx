import { useEffect, useId, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Heart, LayoutDashboard, LogOut, MapPin, Package, Settings, UserRound } from "lucide-react";

import { useAuth } from "../../../context/AuthContext";
import { useLanguage } from "../../../context/LanguageContext";
import { cn } from "../../../utils/cn";

const ADMIN_ROLES = new Set(["super-admin", "staff"]);

/**
 * The signed-in account menu.
 *
 * The previous version was CSS hover-only — `group-hover:visible`, with
 * `aria-haspopup="menu"` sitting on a button that did nothing. It could not be
 * opened by keyboard at all, and on a touch screen there is no hover, so the
 * only way in was to guess that tapping and holding might work. Its one link
 * also pointed at /account, which was a 404.
 *
 * Click to open, Escape to close, click-away scrim, arrow keys through the
 * items, focus returned to the trigger on close.
 */
export default function AccountMenu() {
  const { user, role, logout } = useAuth();
  const { t } = useLanguage();
  const { pathname } = useLocation();

  const [open, setOpen] = useState(false);
  // Close on navigation without a setState-in-effect: following a link should
  // not leave the menu hanging open over the new page, and comparing the path
  // during render does that without a second render pass.
  const [openedAt, setOpenedAt] = useState(pathname);
  const isOpen = open && openedAt === pathname;

  const menuId = useId();
  const triggerRef = useRef(null);
  const itemsRef = useRef([]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  if (!user) return null;

  const items = [
    { to: "/account", label: t("nav.myAccount", "My account"), icon: UserRound },
    { to: "/account/orders", label: t("nav.orders", "Orders"), icon: Package },
    { to: "/account/wishlist", label: t("nav.savedPieces", "Saved pieces"), icon: Heart },
    { to: "/account/addresses", label: t("nav.addresses", "Addresses"), icon: MapPin },
    { to: "/account/settings", label: t("nav.settings", "Settings"), icon: Settings },
    ...(ADMIN_ROLES.has(role)
      ? [{ to: "/dashboard", label: t("nav.dashboard", "Atelier dashboard"), icon: LayoutDashboard }]
      : []),
  ];

  const onMenuKeyDown = (e) => {
    const delta = { ArrowDown: 1, ArrowUp: -1 }[e.key];
    if (!delta) return;
    e.preventDefault();
    const focusable = itemsRef.current.filter(Boolean);
    const current = focusable.indexOf(document.activeElement);
    const next = (current + delta + focusable.length) % focusable.length;
    focusable[next]?.focus();
  };

  const initial = (user.name ?? user.email ?? "U").slice(0, 1).toUpperCase();

  return (
    <div className="relative flex items-center">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => {
          setOpen(!isOpen);
          setOpenedAt(pathname);
        }}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls={isOpen ? menuId : undefined}
        aria-label={t("nav.account", "Account")}
        className="flex size-10 items-center justify-center overflow-hidden rounded-full bg-gold-500 text-sm font-semibold text-espresso transition-opacity hover:opacity-80"
      >
        {user.avatar ? (
          <img src={user.avatar} alt="" className="size-full object-cover" />
        ) : (
          initial
        )}
      </button>

      {isOpen && (
        <>
          <button
            type="button"
            aria-hidden="true"
            tabIndex={-1}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 cursor-default"
          />

          <div
            id={menuId}
            role="menu"
            aria-label={t("nav.account", "Account")}
            onKeyDown={onMenuKeyDown}
            className="surface-header absolute right-0 top-full z-50 mt-2 w-56 border border-umber-50 py-1 shadow-large"
          >
            <div className="border-b border-umber-50 px-4 py-3">
              <p className="truncate text-[13px] font-medium text-espresso">{user.name}</p>
              <p className="truncate text-[11px] text-espresso-soft">{user.email}</p>
            </div>

            {items.map((item, i) => (
              <Link
                key={item.to}
                to={item.to}
                role="menuitem"
                ref={(el) => {
                  itemsRef.current[i] = el;
                }}
                className={cn(
                  "flex items-center gap-3 px-4 py-2.5 text-[13px] text-espresso transition-colors",
                  "hover:bg-brown-50 hover:text-gold-700 focus-visible:bg-brown-50",
                )}
              >
                <item.icon className="size-4 shrink-0" strokeWidth={1.5} aria-hidden="true" />
                {item.label}
              </Link>
            ))}

            <button
              type="button"
              role="menuitem"
              ref={(el) => {
                itemsRef.current[items.length] = el;
              }}
              onClick={() => {
                setOpen(false);
                logout?.();
              }}
              className="flex w-full items-center gap-3 border-t border-umber-50 px-4 py-2.5 text-left text-[13px] text-espresso-soft transition-colors hover:bg-brown-50 hover:text-error"
            >
              <LogOut className="size-4 shrink-0" strokeWidth={1.5} aria-hidden="true" />
              {t("auth.signOut", "Sign out")}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

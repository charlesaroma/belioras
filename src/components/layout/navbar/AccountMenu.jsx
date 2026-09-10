/* Layout Component: AccountMenu */
import { useEffect, useId, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { LogOut } from "lucide-react";

import Avatar from "../../account/Avatar";
import { accountMenuItems } from "../../account/accountMenuItems";
import { useAuth } from "../../../context/AuthContext";
import { useLanguage } from "../../../context/LanguageContext";
import { cn } from "../../../utils/cn";

export default function AccountMenu() {
  const { user, isAdmin, logout } = useAuth();
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

  const items = accountMenuItems({ t, isAdmin });

  const onMenuKeyDown = (e) => {
    const delta = { ArrowDown: 1, ArrowUp: -1 }[e.key];
    if (!delta) return;
    e.preventDefault();
    const focusable = itemsRef.current.filter(Boolean);
    const current = focusable.indexOf(document.activeElement);
    const next = (current + delta + focusable.length) % focusable.length;
    focusable[next]?.focus();
  };

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
        className="transition-opacity hover:opacity-80"
      >
        <Avatar user={user} />
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

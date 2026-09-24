/* Identity And Sign Out */
import { Link } from "react-router-dom";
import { ChevronRight, LogOut } from "lucide-react";

import Avatar from "../../../account/Avatar";
import { useCustomerSignOut } from "@/context/auth/useSignOut";

// Who you are, and the one way out. Everything else scrolls above this.
export default function MobileMenuFooter({ user, t, onClose }) {
  const signOut = useCustomerSignOut();

  if (!user) {
    return (
      // One primary action, with the secondary as a quiet line beneath. Side
      // by side, "Create account" wrapped to two lines at 390px and neither
      // button read as the main one.
      <div className="shrink-0 border-t border-umber-50 px-6 py-4">
        <div className="flex flex-col items-center gap-3">
          <Link
            to="/login"
            onClick={onClose}
            className="flex min-h-11 w-full items-center justify-center bg-espresso px-4 text-[11px] uppercase tracking-[0.18em] text-ivory-50 transition-colors hover:bg-espresso/90"
          >
            {t("nav.signIn", "Sign in")}
          </Link>
          <Link
            to="/signup"
            onClick={onClose}
            className="text-xs text-espresso/50 underline underline-offset-4 transition-colors hover:text-espresso"
          >
            {t("nav.createAccount", "Create account")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="shrink-0 border-t border-umber-50 px-6 py-3">
      <div className="flex items-center gap-1">
        {/* The whole identity is one tap to the account page, which lists
            orders, wardrobe, addresses and settings. */}
        <Link
          to="/account"
          onClick={onClose}
          className="-ml-2 flex min-h-12 min-w-0 flex-1 items-center gap-3 px-2 transition-colors hover:bg-brown-50/60"
        >
          <Avatar user={user} size="sm" />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm text-espresso">{user.name ?? user.email}</span>
            <span className="block text-[11px] uppercase tracking-[0.14em] text-gold-700">
              {t("nav.myAccount", "My account")}
            </span>
          </span>
          <ChevronRight className="size-4 shrink-0 text-espresso/35" aria-hidden="true" />
        </Link>
        <button
          type="button"
          onClick={() => {
            onClose();
            signOut();
          }}
          aria-label="Sign out"
          className="flex size-11 shrink-0 items-center justify-center text-espresso/40 transition-colors hover:text-error liquid-hover rounded-full"
        >
          <LogOut className="size-4" strokeWidth={1.5} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

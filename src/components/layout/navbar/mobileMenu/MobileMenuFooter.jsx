/* Identity And Sign Out */
import { Link, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

import Avatar from "../../../account/Avatar";

// Who you are, and the one way out. Everything else scrolls above this.
export default function MobileMenuFooter({ user, logout, t, onClose }) {
  const navigate = useNavigate();

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
    <div className="shrink-0 border-t border-umber-50 px-6 py-4">
      <div className="flex items-center gap-3">
        <Avatar user={user} size="sm" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm text-espresso">{user.name ?? user.email}</p>
          <p className="truncate text-[11px] text-espresso/40">{user.email}</p>
        </div>
        <button
          type="button"
          onClick={() => {
            onClose();
            // Leave the guarded route before the session clears, or
            // RequireAuth redirects to the sign-in page first.
            navigate("/", { replace: true });
            logout();
          }}
          aria-label="Sign out"
          className="flex size-11 shrink-0 items-center justify-center text-espresso/40 transition-colors hover:text-error"
        >
          <LogOut className="size-4" strokeWidth={1.5} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

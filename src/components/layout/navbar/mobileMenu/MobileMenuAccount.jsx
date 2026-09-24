/* Help And Saved Links */
import { Heart, LayoutDashboard, Mail, Package } from "lucide-react";

import MobileMenuQuietRow from "./MobileMenuQuietRow";

// The account's own destinations (orders, wardrobe, addresses…) are not
// repeated here: the footer's identity row opens /account, whose page carries
// the full list. This keeps to what a shopper reaches for mid-browse. Sits
// below the categories and scrolls with them.
export default function MobileMenuAccount({ user, isAdmin, t, wishlistCount, onClose }) {
  return (
    <div className="px-6 pb-8 pt-7">
      <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-espresso/35">
        {t("nav.help", "Help")}
      </p>

      {/* Signed out, only once something is saved: the route is behind the
          auth wall, so offering it empty sends a shopper to a sign-in form
          for nothing. */}
      {(user || wishlistCount > 0) && (
        <MobileMenuQuietRow
          to="/account/wishlist"
          onClose={onClose}
          icon={Heart}
          label={t("nav.savedPieces", "Saved pieces")}
          meta={wishlistCount > 0 ? wishlistCount : null}
        />
      )}
      <MobileMenuQuietRow to="/order-tracking" onClose={onClose} icon={Package} label="Track an order" />
      <MobileMenuQuietRow to="/contact-us" onClose={onClose} icon={Mail} label="Contact" />
      {isAdmin && (
        <MobileMenuQuietRow
          to="/dashboard"
          onClose={onClose}
          icon={LayoutDashboard}
          label={t("nav.dashboard", "Atelier dashboard")}
        />
      )}
    </div>
  );
}

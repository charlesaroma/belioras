/* Account And Help Links */
import { Heart, Mail, Package } from "lucide-react";

import { accountMenuItems } from "../../../account/accountMenuItems";
import MobileMenuQuietRow from "./MobileMenuQuietRow";

// Sits below the categories and scrolls with them. Pinned to the bottom it
// reserved nine fixed rows and left the categories — the reason the drawer
// exists — about a third of the panel.
export default function MobileMenuAccount({ user, isAdmin, t, wishlistCount, onClose }) {
  return (
    <div className="px-6 pb-8 pt-7">
      <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-espresso/35">
        {user ? "Account" : "Help"}
      </p>

      {user ? (
        accountMenuItems({ t, isAdmin }).map((item) => (
          <MobileMenuQuietRow
            key={item.to}
            to={item.to}
            onClose={onClose}
            icon={item.icon}
            label={item.label}
            meta={item.to === "/account/wishlist" && wishlistCount > 0 ? wishlistCount : null}
          />
        ))
      ) : (
        <>
          {/* Only once something is saved: the route is behind the auth wall,
              so offering it empty sends a signed-out shopper to a sign-in
              form for nothing. */}
          {wishlistCount > 0 && (
            <MobileMenuQuietRow
              to="/account/wishlist"
              onClose={onClose}
              icon={Heart}
              label={t("nav.savedPieces", "Saved pieces")}
              meta={wishlistCount}
            />
          )}
          <MobileMenuQuietRow
            to="/order-tracking"
            onClose={onClose}
            icon={Package}
            label="Track an order"
          />
          <MobileMenuQuietRow to="/contact-us" onClose={onClose} icon={Mail} label="Contact" />
        </>
      )}
    </div>
  );
}

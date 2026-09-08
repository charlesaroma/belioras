import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Heart, ShoppingBag, User } from "lucide-react";

import { useCart } from "../../../context/CartContext";
import { useWishlist } from "../../../context/WishlistContext";
import { useAuth } from "../../../context/AuthContext";
import { useLanguage } from "../../../context/LanguageContext";
import CurrencySelector from "../../common/CurrencySelector";
import LanguageSelector from "../../common/LanguageSelector";
import { cn } from "../../../utils/cn";

const ICON_BUTTON =
  "relative flex size-10 items-center justify-center rounded-full text-current transition-all hover:scale-110 hover:text-gold-700 cursor-pointer";

const BADGE =
  "absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-gold-500 text-[10px] font-semibold text-espresso";

export default function NavActions({ onCartOpen }) {
  const { count } = useCart();
  const { count: wishlistCount } = useWishlist();
  const { user, logout } = useAuth();
  const { t } = useLanguage();

  return (
    <div className={cn("flex", "items-center", "justify-end", "gap-1")}>
      {/* Language and currency sit in the header, not the footer, so shoppers
          can find them without hunting — agreed in the design review. Shown as
          codes (EN, EUR) rather than icons, so the current setting is legible
          without opening either menu. */}
      <LanguageSelector />
      <CurrencySelector />

      <Link
        to="/wishlist"
        className={ICON_BUTTON}
        aria-label={t("wishlist.count", `Wishlist, ${wishlistCount} items`, {
          count: wishlistCount,
        })}
        title={t("nav.wishlist", "Wishlist")}
      >
        <Heart
          className={cn("size-5", wishlistCount > 0 && "fill-gold-500 text-gold-500")}
          aria-hidden="true"
        />
        {wishlistCount > 0 && <span className={BADGE}>{wishlistCount}</span>}
      </Link>

      {user ? (
        <div className="relative group flex items-center justify-center">
          <button
            type="button"
            className="flex size-10 items-center justify-center rounded-full bg-gold-500 text-sm font-semibold text-espresso transition-opacity hover:opacity-80 cursor-pointer"
            aria-haspopup="menu"
          >
            {(user.name ?? user.email ?? "U").slice(0, 1).toUpperCase()}
          </button>

          <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
            <div className="w-48 bg-ivory-50 rounded-2xl shadow-large border border-umber-50 overflow-hidden py-2">
              <div className="px-4 py-2 border-b border-umber-50/60">
                <p className="text-sm font-semibold text-espresso truncate">{user.name}</p>
                <p className="text-[10px] text-espresso-soft truncate">{user.email}</p>
              </div>
              <Link
                to="/account"
                className="block px-4 py-2 text-sm text-espresso hover:bg-brown-50 hover:text-gold-700 transition-colors"
              >
                {t("nav.myAccount", "My Account")}
              </Link>
              <button
                type="button"
                className="w-full text-left px-4 py-2 text-sm text-espresso hover:bg-brown-50 hover:text-gold-700 transition-colors"
                onClick={() => {
                  if (typeof logout === "function") logout();
                }}
              >
                {t("auth.signOut", "Sign Out")}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <Link
          to="/login"
          className="flex size-10 items-center justify-center rounded-full text-current transition-opacity hover:opacity-70 cursor-pointer"
          aria-label={t("auth.signIn", "Sign in")}
        >
          <User className="size-5" aria-hidden="true" />
        </Link>
      )}

      <button
        type="button"
        className={ICON_BUTTON}
        aria-label={t("cart.open", `Open cart, ${count} items`, { count })}
        onClick={onCartOpen}
      >
        <ShoppingBag className="size-5" aria-hidden="true" />
        {count > 0 && (
          <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} key={count} className={BADGE}>
            {count}
          </motion.span>
        )}
      </button>
    </div>
  );
}

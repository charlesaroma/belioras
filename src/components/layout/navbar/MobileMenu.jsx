import { useState } from "react";
import { Link } from "react-router-dom";

import BrandMark from "../../shared/BrandMark";
import { AnimatePresence, motion } from "motion/react";
import { Plus, Search, X } from "lucide-react";

import { NAV_LINKS } from "../../../utils/constants";
import { useAuth } from "../../../context/AuthContext";
import { useCart } from "../../../context/CartContext";
import { useCurrency } from "../../../context/CurrencyContext";
import { useWishlist } from "../../../context/WishlistContext";
import { cn } from "../../../utils/cn";
import LanguageSelector from "../../common/LanguageSelector";
import MegaMenuPanel from "./MegaMenuPanel";

/**
 * Mobile navigation drawer.
 *
 * The previous version read as a utility menu rather than a boutique one:
 * category names set in heavy uppercase sans, a pill-shaped search field and
 * pill currency buttons against a site that is square-cornered everywhere
 * else, circular icon chips with a filled black cart button, and four stacked
 * utility bars competing at the bottom. The brand's display serif appeared
 * nowhere in it.
 *
 * Now the categories carry the page in the display serif at a size that lets
 * it breathe, dividers are hairlines, corners are square, and the utility
 * area is one quiet list. A plus mark rotates to a cross on open rather than
 * a chevron flipping — the same motif as the product page accordions.
 */
export default function MobileMenu({ open, onClose, categories, onCartOpen, onSearchOpen }) {
  const { user, logout } = useAuth();
  const { count: cartCount } = useCart();
  const { count: wishlistCount } = useWishlist();
  const { currency, setCurrency, currencies, symbol } = useCurrency();

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            aria-label="Close menu"
            onClick={onClose}
            className="fixed inset-0 z-50 cursor-default bg-espresso/40 backdrop-blur-sm lg:hidden"
          />

          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 260 }}
            className="surface-header fixed inset-y-0 left-0 z-50 flex w-[88vw] max-w-sm flex-col shadow-large lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
          >
            <div className="flex shrink-0 items-center justify-between border-b border-umber-50 px-6 py-5">
              <Link to="/" onClick={onClose} aria-label="Belioras — home">
                <BrandMark to={null} size="sm" className="h-12" />
              </Link>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close menu"
                className="text-espresso/40 transition-colors hover:text-espresso"
              >
                <X className="size-5" aria-hidden="true" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {/* Hands off to the one search surface rather than carrying a
                  second input of its own. */}
              <button
                type="button"
                onClick={onSearchOpen}
                className="flex w-full items-center gap-3 border-b border-umber-50 px-6 py-4 text-left text-sm text-espresso-soft transition-colors hover:text-espresso"
              >
                <Search className="size-4" aria-hidden="true" />
                Search the collection
              </button>

              <nav aria-label="Categories" className="px-6">
                {NAV_LINKS.map((link) => {
                  const category = categories?.find((c) => c.id === link.id);
                  return category ? (
                    <CategoryAccordion key={link.id} category={category} onClose={onClose} />
                  ) : (
                    <Link
                      key={link.id}
                      to={link.to}
                      onClick={onClose}
                      className="block border-b border-umber-50 py-5 font-display text-[22px] leading-none text-espresso transition-colors hover:text-gold-700"
                    >
                      {titleCase(link.label)}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* One quiet list, not four stacked bars. */}
            <div className="shrink-0 border-t border-umber-50">
              <div className="px-6">
                {user ? (
                  <div className="flex items-center justify-between border-b border-umber-50 py-3.5">
                    <Link to="/account" onClick={onClose} className="min-w-0">
                      <p className="truncate text-sm text-espresso">{user.name ?? user.email}</p>
                      <p className="text-[11px] uppercase tracking-[0.14em] text-espresso/40">
                        View account
                      </p>
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        onClose();
                      }}
                      className="shrink-0 text-[11px] uppercase tracking-[0.14em] text-espresso/40 transition-colors hover:text-gold-700"
                    >
                      Sign out
                    </button>
                  </div>
                ) : (
                  <UtilityRow to="/login" onClose={onClose} label="Sign in" />
                )}

                <UtilityRow
                  to="/wishlist"
                  onClose={onClose}
                  label="Wishlist"
                  meta={wishlistCount || null}
                />

                <button
                  type="button"
                  onClick={() => {
                    onCartOpen?.();
                    onClose();
                  }}
                  className="flex w-full items-center justify-between border-b border-umber-50 py-3.5 text-left text-sm text-espresso transition-colors hover:text-gold-700"
                >
                  Cart
                  {cartCount > 0 && (
                    <span className="text-[11px] tabular-nums text-espresso/40">{cartCount}</span>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between gap-4 px-6 py-4">
                <div className="flex items-center gap-1">
                  {currencies.map((code) => (
                    <button
                      key={code}
                      type="button"
                      onClick={() => setCurrency(code)}
                      aria-pressed={code === currency}
                      className={cn(
                        "px-2 py-1 text-[11px] uppercase tracking-[0.14em] transition-colors",
                        code === currency
                          ? "text-espresso underline underline-offset-4 decoration-gold-500"
                          : "text-espresso/35 hover:text-espresso",
                      )}
                    >
                      {code === currency ? `${symbol} ${code}` : code}
                    </button>
                  ))}
                </div>
                <LanguageSelector />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function UtilityRow({ to, onClose, label, meta }) {
  return (
    <Link
      to={to}
      onClick={onClose}
      className="flex items-center justify-between border-b border-umber-50 py-3.5 text-sm text-espresso transition-colors hover:text-gold-700"
    >
      {label}
      {meta ? <span className="text-[11px] tabular-nums text-espresso/40">{meta}</span> : null}
    </Link>
  );
}

function CategoryAccordion({ category, onClose }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-umber-50">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 py-5 text-left"
      >
        <span
          className={cn(
            "font-display text-[22px] leading-none transition-colors",
            open ? "text-gold-700" : "text-espresso",
          )}
        >
          {titleCase(category.label)}
        </span>
        {/* A plus rotating into a cross — the motif already used by the
            product page accordions, rather than a third chevron style. */}
        <Plus
          className={cn(
            "size-4 shrink-0 text-espresso/35 transition-transform duration-300",
            open && "rotate-45",
          )}
          aria-hidden="true"
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="pb-5">
              <MegaMenuPanel item={category} variant="mobile" onNavigate={onClose} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Nav labels are stored uppercase; the serif wants sentence case. */
function titleCase(label) {
  return label
    .toLowerCase()
    .replace(/(^|\s|&\s)([a-z])/g, (m) => m.toUpperCase());
}

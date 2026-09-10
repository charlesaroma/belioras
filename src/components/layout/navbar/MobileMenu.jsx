import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Avatar from "../../account/Avatar";
import { accountMenuItems } from "../../account/accountMenuItems";
import BrandMark from "../../shared/BrandMark";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Heart, LogOut, Mail, Package, Plus, Search, X } from "lucide-react";

import { NAV_LINKS } from "../../../utils/constants";
import { useAuth } from "../../../context/AuthContext";
import { useLanguage } from "../../../context/LanguageContext";
import { useWishlist } from "../../../context/WishlistContext";
import { cn } from "../../../utils/cn";
import MegaMenuPanel from "./MegaMenuPanel";

/**
 * Mobile navigation drawer.
 *
 * Categories carry the page in the brand's display serif, dividers are
 * hairlines, corners are square, and a plus mark rotates to a cross on open —
 * the same motif as the product page accordions.
 *
 * Every destination appears in exactly one place. Language, currency and the
 * cart now live in the persistent header, so their duplicate rows are gone
 * from this drawer's footer; search lives here, so the header no longer
 * carries its own icon for it. Three separate controls for currency
 * (dropdown in the header, three text toggles here) had also drifted into
 * two different visual languages for one setting.
 *
 * The remaining hierarchy is deliberate: search reads as a control rather
 * than a label, categories are the loudest thing on the panel, and account
 * links sit quietly beneath them in a smaller, softer weight.
 */
export default function MobileMenu({ open, onClose, categories, onSearchOpen }) {
  const { user, isAdmin, logout } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { count: wishlistCount } = useWishlist();

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
                className="-mr-3 flex size-11 items-center justify-center text-espresso/40 transition-colors hover:text-espresso"
              >
                <X className="size-5" aria-hidden="true" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto overscroll-contain">
              {/* Reads as a field, not a menu row: this is the one control on
                  the panel, and the only search surface on a phone. It hands
                  off to SearchPanel rather than carrying a second input. */}
              <div className="px-6 pb-6 pt-5">
                <button
                  type="button"
                  onClick={onSearchOpen}
                  className="flex min-h-11 w-full items-center gap-3 border border-umber-100 px-4 text-left text-sm text-espresso/45 transition-colors hover:border-espresso/40 hover:text-espresso"
                >
                  <Search className="size-4 shrink-0" strokeWidth={1.5} aria-hidden="true" />
                  {t("common.searchPlaceholder", "Search the collection…")}
                </button>
              </div>

              <nav aria-label="Categories" className="border-t border-umber-50 px-6">
                {NAV_LINKS.map((link) => {
                  const category = categories?.find((c) => c.id === link.id);
                  return category ? (
                    <CategoryAccordion key={link.id} category={category} onClose={onClose} />
                  ) : (
                    <Link
                      key={link.id}
                      to={link.to}
                      onClick={onClose}
                      className="block border-b border-umber-50 py-5 font-display text-[26px] leading-none tracking-[-0.01em] text-espresso transition-colors hover:text-gold-700"
                    >
                      {titleCase(t(link.key, link.label))}
                    </Link>
                  );
                })}
              </nav>

              {/* Account sits below the categories and scrolls with them.
                  Pinned to the bottom it needed nine rows of fixed height,
                  which left the categories — the reason the drawer exists —
                  about a third of the panel. */}
              <div className="px-6 pb-8 pt-7">
                <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-espresso/35">
                  {user ? "Account" : "Help"}
                </p>

                {user ? (
                  accountMenuItems({ t, isAdmin }).map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={onClose}
                      className="flex min-h-11 items-center gap-3 text-sm text-espresso-soft transition-colors hover:text-gold-700"
                    >
                      <item.icon
                        className="size-4 shrink-0 text-espresso/35"
                        strokeWidth={1.5}
                        aria-hidden="true"
                      />
                      {item.label}
                      {item.to === "/account/wishlist" && wishlistCount > 0 && (
                        <span className="ml-auto text-[11px] tabular-nums text-espresso/35">
                          {wishlistCount}
                        </span>
                      )}
                    </Link>
                  ))
                ) : (
                  <>
                    {/* Only once something is saved: the route is behind the
                        auth wall, so offering it empty sends a signed-out
                        shopper to a sign-in form for nothing. */}
                    {wishlistCount > 0 && (
                      <QuietRow
                        to="/account/wishlist"
                        onClose={onClose}
                        icon={Heart}
                        label={t("nav.savedPieces", "Saved pieces")}
                        meta={wishlistCount}
                      />
                    )}
                    <QuietRow
                      to="/order-tracking"
                      onClose={onClose}
                      icon={Package}
                      label="Track an order"
                    />
                    <QuietRow to="/contact-us" onClose={onClose} icon={Mail} label="Contact" />
                  </>
                )}
              </div>
            </div>

            {/* Who you are, and the one way out. Everything else scrolls. */}
            <div className="shrink-0 border-t border-umber-50 px-6 py-4">
              {user ? (
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
              ) : (
                // One primary action, with the secondary as a quiet line
                // beneath it. Side by side, "Create account" wrapped to two
                // lines at 390px and neither button read as the main one.
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
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function QuietRow({ to, onClose, icon: Icon, label, meta }) {
  return (
    <Link
      to={to}
      onClick={onClose}
      className="flex min-h-11 items-center gap-3 text-sm text-espresso-soft transition-colors hover:text-gold-700"
    >
      <Icon className="size-4 shrink-0 text-espresso/35" strokeWidth={1.5} aria-hidden="true" />
      {label}
      {meta ? (
        <span className="ml-auto text-[11px] tabular-nums text-espresso/35">{meta}</span>
      ) : null}
    </Link>
  );
}

function CategoryAccordion({ category, onClose }) {
  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotion();

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
            "font-display text-[26px] leading-none tracking-[-0.01em] transition-colors",
            open ? "text-gold-700" : "text-espresso",
          )}
        >
          {titleCase(category.label)}
        </span>
        {/* A plus rotating into a cross — the motif already used by the
            product page accordions, rather than a third chevron style. */}
        <Plus
          className={cn(
            "size-4 shrink-0 text-espresso/35 transition-transform duration-[380ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
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
            // Same curve and timing as the sections nested inside this panel
            // (see MegaMenuPanel), so opening a category and opening one of
            // its sections feel like one mechanism rather than two.
            transition={{
              height: { duration: reduceMotion ? 0 : 0.38, ease: [0.22, 1, 0.36, 1] },
              opacity: { duration: reduceMotion ? 0 : 0.24, ease: "easeOut" },
            }}
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

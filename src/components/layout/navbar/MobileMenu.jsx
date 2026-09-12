/* Layout Component: MobileMenu */
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { Search, X } from "lucide-react";

import BrandMark from "../../shared/BrandMark";
import { NAV_LINKS } from "../../../utils/constants";
import { useCustomerAuth, useStaffAuth } from "@/context/auth/useAuthRealm";
import { useLanguage } from "../../../context/LanguageContext";
import { useWishlist } from "../../../context/WishlistContext";

import MobileMenuCategory from "./mobileMenu/MobileMenuCategory";
import MobileMenuAccount from "./mobileMenu/MobileMenuAccount";
import MobileMenuFooter from "./mobileMenu/MobileMenuFooter";
import { titleCase } from "./mobileMenu/mobileMenuText";

// Every destination appears in exactly one place. Language, currency and the
// cart live in the header; search lives here, so the header carries no icon
// for it.
export default function MobileMenu({ open, onClose, categories, onSearchOpen }) {
  // The menu belongs to the shopper and renders only for one. The staff realm
  // answers a separate question — whether to add the dashboard row — so it is
  // read separately, and someone signed into both gets the shortcut without
  // either session standing in for the other.
  const { user, logout } = useCustomerAuth();
  const { isAdmin } = useStaffAuth();
  const { t } = useLanguage();
  const { count: wishlistCount } = useWishlist();

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
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

          {/* Panel */}
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
            {/* Header */}
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

            {/* Menu list */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
              {/* Reads as a field, not a menu row — this is the only search
                  surface on a phone, and it hands off to SearchPanel rather
                  than carrying a second input. */}
              {/* Search */}
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
                    <MobileMenuCategory key={link.id} category={category} onClose={onClose} />
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

              <MobileMenuAccount
                user={user}
                isAdmin={isAdmin}
                t={t}
                wishlistCount={wishlistCount}
                onClose={onClose}
              />
            </div>

            <MobileMenuFooter user={user} logout={logout} t={t} onClose={onClose} />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

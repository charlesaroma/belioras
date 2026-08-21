import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown, Search, X, LogIn, Heart, ShoppingBag } from "lucide-react";

import { NAV_LINKS } from "../../../utils/constants";
import { useCurrency } from "../../../context/CurrencyContext";
import { useAuth } from "../../../context/AuthContext";
import { useWishlist } from "../../../context/WishlistContext";
import { useCart } from "../../../context/CartContext";

const CURRENCIES = [
  { code: "EUR", symbol: "€", flag: "🇪🇺" },
  { code: "USD", symbol: "$", flag: "🇺🇸" },
  { code: "GBP", symbol: "£", flag: "🇬🇧" },
];

function CategoryAccordion({ category, onClose }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-umber-50">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between py-3.5 text-sm font-semibold uppercase tracking-[0.14em] text-espresso"
      >
        {category.label}
        <ChevronDown
          className={`size-4 text-espresso/50 transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="py-2 pl-4 space-y-6 mb-4">
              {category.sections?.map((section, idx) => (
                <div key={idx}>
                  <p className="text-xs font-semibold uppercase tracking-wider text-brown-500 mb-2">
                    {section.title}
                  </p>
                  <ul className="space-y-2">
                    {section.items.map((item) => (
                      <li key={item.slug}>
                        <Link
                          to={`/${item.slug}`}
                          onClick={onClose}
                          className="block text-sm text-espresso/70 hover:text-gold-700"
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function MobileMenu({ open, onClose, categories, onCartOpen }) {
  const { currency, setCurrency } = useCurrency();
  const { user, logout } = useAuth();
  const { count: wishlistCount } = useWishlist();
  const { count: cartCount } = useCart();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  function onSubmit(e) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    onClose();
    navigate(`/search?q=${encodeURIComponent(q)}`);
  }

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[60] lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          {/* Backdrop */}
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 cursor-default bg-espresso/40 backdrop-blur-sm"
            aria-label="Close menu"
            onClick={onClose}
          />

          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
            className="absolute inset-y-0 left-0 flex w-[min(88vw,380px)] flex-col bg-ivory-50 shadow-large"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-umber-50 px-5 py-4 shrink-0">
              <Link to="/" onClick={onClose} className="shrink-0" aria-label="Belioras — home">
                <img
                  src="/belioras-logo.png"
                  alt="Belioras"
                  width={600}
                  height={400}
                  className="h-9 w-auto"
                />
              </Link>
              <button
                type="button"
                className="flex size-10 items-center justify-center rounded-full text-espresso hover:bg-brown-50"
                aria-label="Close menu"
                onClick={onClose}
              >
                <X className="size-5" aria-hidden="true" />
              </button>
            </div>

            {/* Search */}
            <form onSubmit={onSubmit} role="search" aria-label="Search products" className="px-5 py-4 shrink-0">
              <div className="relative">
                <Search
                  className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-espresso/40"
                  aria-hidden="true"
                />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search Belioras..."
                  className="h-11 w-full rounded-full border border-umber-50 bg-white/60 pl-11 pr-4 text-sm text-espresso placeholder-espresso/40 focus:outline-none focus:border-gold-500 transition-colors"
                />
              </div>
            </form>

            {/* Nav Categories — scrollable */}
            <div className="flex-1 overflow-y-auto px-5">
              {NAV_LINKS.filter((l) => !["new-arrivals"].includes(l.id)).map((link) => {
                const category = categories?.find((c) => c.id === link.id);
                if (!category) return null;
                return <CategoryAccordion key={category.id} category={category} onClose={onClose} />;
              })}

              <Link
                to="/whats-new"
                onClick={onClose}
                className="block border-b border-umber-50 py-3.5 text-sm font-semibold uppercase tracking-[0.14em] text-espresso"
              >
                New Arrivals
              </Link>
            </div>

            {/* ── Footer strip: Account + Currency ── */}
            <div className="shrink-0 border-t border-umber-50 bg-white/40">
              {/* Account row */}
              <div className="px-5 py-3 border-b border-umber-50/60">
                {user ? (
                  <div className="flex items-center justify-between">
                    <Link
                      to="/account"
                      onClick={onClose}
                      className="flex items-center gap-3"
                    >
                      <span className="flex size-8 items-center justify-center rounded-full bg-gold-500 text-sm font-semibold text-espresso shrink-0">
                        {(user.name ?? user.email ?? "U").slice(0, 1).toUpperCase()}
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-espresso truncate">{user.name ?? user.email}</p>
                        <p className="text-xs text-espresso/50 hover:text-gold-700 transition-colors">View account</p>
                      </div>
                    </Link>
                    
                    {/* Logout Button */}
                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        onClose();
                      }}
                      className="text-[10px] uppercase tracking-widest font-semibold text-espresso/40 hover:text-gold-700 transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    onClick={onClose}
                    className="flex items-center gap-3 group"
                  >
                    <span className="flex size-8 items-center justify-center rounded-full border border-umber-50 text-espresso/60 group-hover:border-gold-500 group-hover:text-gold-600 transition-colors shrink-0">
                      <LogIn className="size-4" aria-hidden="true" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-espresso group-hover:text-gold-700 transition-colors">Sign in</p>
                      <p className="text-xs text-espresso/50">Access your account</p>
                    </div>
                  </Link>
                )}
              </div>

              {/* Wishlist & Cart row */}
              <div className="px-5 py-3 border-b border-umber-50/60 flex items-center gap-4">
                <Link
                  to="/wishlist"
                  onClick={onClose}
                  className="flex items-center gap-3 group flex-1"
                >
                  <span className="flex size-8 items-center justify-center rounded-full border border-umber-50 text-espresso/60 group-hover:border-gold-500 group-hover:text-gold-600 transition-colors shrink-0 relative">
                    <Heart className="size-4" aria-hidden="true" />
                    {wishlistCount > 0 && (
                      <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-gold-500 text-[10px] font-semibold text-espresso">
                        {wishlistCount}
                      </span>
                    )}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-espresso group-hover:text-gold-700 transition-colors">Wishlist</p>
                    <p className="text-xs text-espresso/50">{wishlistCount} items</p>
                  </div>
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    if (typeof onCartOpen === 'function') onCartOpen();
                    onClose();
                  }}
                  className="flex items-center gap-3 group flex-1"
                >
                  <span className="flex size-10 items-center justify-center rounded-full bg-espresso text-ivory-50 relative shadow-sm hover:bg-gold-700 transition-colors">
                    <ShoppingBag className="size-5" aria-hidden="true" />
                    {cartCount > 0 && (
                      <span className="absolute -top-1 -right-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-gold-500 text-[11px] font-bold text-espresso px-1.5">
                        {cartCount}
                      </span>
                    )}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-espresso group-hover:text-gold-700 transition-colors">Cart</p>
                    <p className="text-xs text-espresso/50">{cartCount} items</p>
                  </div>
                </button>
              </div>

              {/* Currency row */}
              <div className="px-5 py-3 flex items-center justify-between">
                <p className="text-[11px] uppercase tracking-widest font-bold text-espresso/40">Currency</p>
                <div className="flex items-center gap-1.5">
                  {CURRENCIES.map((c) => (
                    <button
                      key={c.code}
                      type="button"
                      aria-pressed={currency === c.code}
                      onClick={() => setCurrency(c.code)}
                      className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
                        currency === c.code
                          ? "bg-espresso text-ivory-50"
                          : "bg-transparent text-espresso/60 hover:text-espresso hover:bg-umber-50"
                      }`}
                    >
                      {c.symbol} {c.code}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
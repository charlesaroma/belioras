import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, Heart, ShoppingBag, User } from "lucide-react";

import { useCurrency } from "../../../context/CurrencyContext";
import { useCart } from "../../../context/CartContext";
import { useWishlist } from "../../../context/WishlistContext";
import { useAuth } from "../../../context/AuthContext";

const CURRENCIES = [
  { code: "EUR", symbol: "€" },
  { code: "USD", symbol: "$" },
  { code: "GBP", symbol: "£" },
];

export default function NavActions({ onCartOpen }) {
  const { currency, setCurrency } = useCurrency();
  const { count } = useCart();
  const { has, count: wishlistCount } = useWishlist();
  const { user } = useAuth();
  const [currencyOpen, setCurrencyOpen] = useState(false);

  const active = CURRENCIES.find((c) => c.code === currency) ?? CURRENCIES[0];

  return (
    <div className="flex items-center justify-end gap-1">
      <div className="relative">
        <button
          type="button"
          className="flex h-10 items-center gap-1.5 rounded-full px-3 text-sm font-medium text-current transition-opacity hover:opacity-70"
          aria-haspopup="listbox"
          aria-expanded={currencyOpen}
          aria-label={`Currency: ${active.code}`}
          onClick={() => setCurrencyOpen((v) => !v)}
        >
          <span className="tabular-nums">{active.symbol}</span>
          <span className="hidden sm:inline">{active.code}</span>
          <ChevronDown
            className={`size-3.5 opacity-50 transition-transform ${currencyOpen ? "rotate-180" : ""}`}
            aria-hidden="true"
          />
        </button>

        {currencyOpen && (
          <>
            <button
              type="button"
              className="fixed inset-0 z-10 cursor-default"
              aria-label="Close currency menu"
              tabIndex={-1}
              onClick={() => setCurrencyOpen(false)}
            />
            <ul
              role="listbox"
              aria-label="Select currency"
              className="absolute right-0 z-20 mt-2 w-36 overflow-hidden rounded-2xl border border-umber-50 bg-ivory-50 py-1 shadow-large"
            >
              {CURRENCIES.map((c) => (
                <li key={c.code}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={c.code === currency}
                    className={`flex w-full items-center justify-between px-4 py-2.5 text-sm transition-colors hover:bg-brown-50 ${
                      c.code === currency ? "text-gold-700" : "text-espresso"
                    }`}
                    onClick={() => {
                      setCurrency(c.code);
                      setCurrencyOpen(false);
                    }}
                  >
                    <span>{c.code}</span>
                    <span className="tabular-nums">{c.symbol}</span>
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      <button
        type="button"
        className="relative flex size-10 items-center justify-center rounded-full text-current transition-opacity hover:opacity-70"
        aria-label={`Wishlist, ${wishlistCount} items`}
        title="Wishlist"
      >
        <Heart
          className={`size-5 ${has("__none") ? "fill-gold-500 text-gold-500" : ""}`}
          aria-hidden="true"
        />
        {wishlistCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-gold-500 text-[10px] font-semibold text-espresso">
            {wishlistCount}
          </span>
        )}
      </button>

      {user ? (
        <span
          className="flex size-10 items-center justify-center rounded-full bg-gold-500 text-sm font-semibold text-espresso"
          title={user.name ?? user.email}
          aria-label={`Signed in as ${user.name ?? user.email}`}
        >
          {(user.name ?? user.email ?? "U").slice(0, 1).toUpperCase()}
        </span>
      ) : (
        <Link
          to="/login"
          className="flex size-10 items-center justify-center rounded-full text-current transition-opacity hover:opacity-70"
          aria-label="Sign in"
        >
          <User className="size-5" aria-hidden="true" />
        </Link>
      )}

      <button
        type="button"
        className="relative flex size-10 items-center justify-center rounded-full text-current transition-opacity hover:opacity-70"
        aria-label={`Open cart, ${count} items`}
        onClick={onCartOpen}
      >
        <ShoppingBag className="size-5" aria-hidden="true" />
        {count > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-espresso text-[10px] font-semibold text-champagne-500">
            {count}
          </span>
        )}
      </button>
    </div>
  );
}
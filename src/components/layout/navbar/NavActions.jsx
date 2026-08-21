import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, Heart, ShoppingBag, User } from "lucide-react";

import { useCurrency } from "../../../context/CurrencyContext";
import { useCart } from "../../../context/CartContext";
import { useWishlist } from "../../../context/WishlistContext";
import { useAuth } from "../../../context/AuthContext";
import { cn } from "../../../utils/cn";

const CURRENCIES = [
  { code: "EUR", symbol: "€" },
  { code: "USD", symbol: "$" },
  { code: "GBP", symbol: "£" },
];

export default function NavActions({ onCartOpen }) {
  const { currency, setCurrency } = useCurrency();
  const { count } = useCart();
  const { has, count: wishlistCount } = useWishlist();
  const { user, logout } = useAuth();
  const [currencyOpen, setCurrencyOpen] = useState(false);

  const active = CURRENCIES.find((c) => c.code === currency) ?? CURRENCIES[0];

  return (
    <div className={cn('flex', 'items-center', 'justify-end', 'gap-1')}>
      <div className="relative">
        <button
          type="button"
          className={cn('flex', 'h-10', 'items-center', 'gap-1.5', 'rounded-full', 'px-3', 'text-sm', 'font-medium', 'text-current', 'transition-opacity', 'hover:opacity-70')}
          aria-haspopup="listbox"
          aria-expanded={currencyOpen}
          aria-label={`Currency: ${active.code}`}
          onClick={() => setCurrencyOpen((v) => !v)}
        >
          <span className="tabular-nums">{active.symbol}</span>
          <span className={cn('hidden', 'sm:inline')}>{active.code}</span>
          <ChevronDown
            className={`size-3.5 opacity-50 transition-transform ${currencyOpen ? "rotate-180" : ""}`}
            aria-hidden="true"
          />
        </button>

        {currencyOpen && (
          <>
            <button
              type="button"
              className={cn('fixed', 'inset-0', 'z-10', 'cursor-default')}
              aria-label="Close currency menu"
              tabIndex={-1}
              onClick={() => setCurrencyOpen(false)}
            />
            <ul
              role="listbox"
              aria-label="Select currency"
              className={cn('absolute', 'right-0', 'z-20', 'mt-2', 'w-36', 'overflow-hidden', 'rounded-2xl', 'border', 'border-umber-50', 'bg-ivory-50', 'py-1', 'shadow-large')}
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
        className={cn('relative', 'flex', 'size-10', 'items-center', 'justify-center', 'rounded-full', 'text-current', 'transition-opacity', 'hover:opacity-70')}
        aria-label={`Wishlist, ${wishlistCount} items`}
        title="Wishlist"
      >
        <Heart
          className={`size-5 ${has("__none") ? "fill-gold-500 text-gold-500" : ""}`}
          aria-hidden="true"
        />
        {wishlistCount > 0 && (
          <span className={cn('absolute', '-right-0.5', '-top-0.5', 'flex', 'size-4', 'items-center', 'justify-center', 'rounded-full', 'bg-gold-500', 'text-[10px]', 'font-semibold', 'text-espresso')}>
            {wishlistCount}
          </span>
        )}
      </button>

      {user ? (
        <div className="relative group flex items-center justify-center">
          <button
            type="button"
            className={cn('flex', 'size-10', 'items-center', 'justify-center', 'rounded-full', 'bg-gold-500', 'text-sm', 'font-semibold', 'text-espresso', 'transition-opacity', 'hover:opacity-80')}
            aria-haspopup="menu"
          >
            {(user.name ?? user.email ?? "U").slice(0, 1).toUpperCase()}
          </button>
          
          <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
            <div className="w-48 bg-ivory-50 rounded-2xl shadow-large border border-umber-50 overflow-hidden py-2">
              <div className="px-4 py-2 border-b border-umber-50/60">
                <p className="text-sm font-semibold text-espresso truncate">{user.name}</p>
                <p className="text-[10px] text-espresso/60 truncate">{user.email}</p>
              </div>
              <Link to="/account" className="block px-4 py-2 text-sm text-espresso hover:bg-brown-50 hover:text-gold-700 transition-colors">
                My Account
              </Link>
              <button 
                type="button"
                className="w-full text-left px-4 py-2 text-sm text-espresso hover:bg-brown-50 hover:text-gold-700 transition-colors"
                onClick={() => {
                  if (typeof logout === 'function') logout();
                }}
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      ) : (
        <Link
          to="/login"
          className={cn('flex', 'size-10', 'items-center', 'justify-center', 'rounded-full', 'text-current', 'transition-opacity', 'hover:opacity-70')}
          aria-label="Sign in"
        >
          <User className="size-5" aria-hidden="true" />
        </Link>
      )}

      <button
        type="button"
        className={cn('relative', 'flex', 'size-10', 'items-center', 'justify-center', 'rounded-full', 'text-current', 'transition-opacity', 'hover:opacity-70')}
        aria-label={`Open cart, ${count} items`}
        onClick={onCartOpen}
      >
        <ShoppingBag className="size-5" aria-hidden="true" />
        {count > 0 && (
          <span className={cn('absolute', '-right-0.5', '-top-0.5', 'flex', 'size-4', 'items-center', 'justify-center', 'rounded-full', 'bg-espresso', 'text-[10px]', 'font-semibold', 'text-champagne-500')}>
            {count}
          </span>
        )}
      </button>
    </div>
  );
}
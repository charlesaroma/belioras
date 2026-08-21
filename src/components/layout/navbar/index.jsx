import { useEffect, useRef, useState } from "react";

import { useAsyncData } from "../../../hooks/useAsyncData";
import { getCategories } from "../../../services/categoriesApi";
import { getProducts } from "../../../services/productsApi";

import AnnouncementBar from "./AnnouncementBar";
import SearchBar from "./SearchBar";
import Logo from "./Logo";
import NavActions from "./NavActions";
import NavLinks from "./NavLinks";
import MegaMenu from "./MegaMenu";
import MobileMenu from "./MobileMenu";
import CartDrawer from "./CartDrawer";
import { Menu, ShoppingBag, ChevronDown } from "lucide-react";
import { cn } from "../../../utils/cn";
import { useCart } from "../../../context/CartContext";
import { useCurrency } from "../../../context/CurrencyContext";

export default function Navbar() {
  const { data: categories } = useAsyncData(getCategories, []);
  const { data: products } = useAsyncData(getProducts, []);
  const { count } = useCart();
  const { currency, setCurrency } = useCurrency();
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuId, setMenuId] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const closeTimer = useRef(null);

  const CURRENCIES = [
    { code: "EUR", symbol: "€" },
    { code: "USD", symbol: "$" },
    { code: "GBP", symbol: "£" },
  ];
  const activeCurrency = CURRENCIES.find((c) => c.code === currency) ?? CURRENCIES[0];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const openMenu = (id, toggle = true) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setMenuId((prev) => (toggle && prev === id ? null : id));
  };

  const scheduleCloseMenu = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setMenuId(null), 160);
  };

  const cancelCloseMenu = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key !== "Escape") return;
      setMenuId(null);
      setCartOpen(false);
      setMobileOpen(false);
      setCurrencyOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = cartOpen || mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [cartOpen, mobileOpen]);

  const activeCategory = categories?.find((c) => c.id === menuId);

  return (
    <header className={cn('fixed', 'inset-x-0', 'top-0', 'z-50', 'w-full')}>
      <AnnouncementBar />

      <div
        className={`transition-all duration-300 ${
          isScrolled || menuId || mobileOpen || cartOpen
            ? "bg-ivory-50/95 backdrop-blur text-espresso shadow-sm"
            : "bg-gradient-to-b from-black/60 via-black/30 to-transparent text-ivory-50"
        }`}
      >
        {/* ── Desktop navbar ── */}
        <div className="hidden lg:grid w-full px-8 xl:px-16 2xl:px-24 grid-cols-[1fr_auto_1fr] items-center gap-8 xl:gap-12 py-3">
          <div className="flex items-center gap-3">
            <NavLinks
              links={categories}
              menuId={menuId}
              onOpen={openMenu}
              onScheduleClose={scheduleCloseMenu}
              onCancelClose={cancelCloseMenu}
            />
          </div>

          <Logo isScrolled={isScrolled} />

          <div className="flex items-center justify-end gap-4">
            <SearchBar />
            <NavActions onCartOpen={() => setCartOpen(true)} />
          </div>
        </div>

        {/* ── Mobile / Tablet navbar ── */}
        <div className="lg:hidden w-full px-4 sm:px-6 grid grid-cols-[auto_1fr_auto] items-center py-3 gap-2">
          {/* Left: Burger */}
          <button
            type="button"
            className="flex size-10 items-center justify-center rounded-full text-current transition-opacity hover:opacity-70"
            aria-label="Open menu"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="size-5" aria-hidden="true" />
          </button>

          {/* Center: Logo */}
          <div className="flex justify-center">
            <Logo isScrolled={isScrolled} />
          </div>

          {/* Right: Currency + Cart */}
          <div className="flex items-center gap-1">
            {/* Compact Currency Switcher */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setCurrencyOpen((v) => !v)}
                className="flex items-center gap-1 h-10 px-2 rounded-full text-current text-sm font-medium transition-opacity hover:opacity-70"
                aria-label={`Currency: ${activeCurrency.code}`}
              >
                <span>{activeCurrency.symbol}</span>
                <ChevronDown className={`size-3 opacity-60 transition-transform ${currencyOpen ? "rotate-180" : ""}`} aria-hidden="true" />
              </button>
              {currencyOpen && (
                <>
                  <button
                    type="button"
                    className="fixed inset-0 z-10 cursor-default"
                    tabIndex={-1}
                    onClick={() => setCurrencyOpen(false)}
                    aria-label="Close currency menu"
                  />
                  <ul
                    role="listbox"
                    className="absolute right-0 z-20 mt-1 w-28 overflow-hidden rounded-xl border border-umber-50 bg-ivory-50 py-1 shadow-large text-espresso"
                  >
                    {CURRENCIES.map((c) => (
                      <li key={c.code}>
                        <button
                          type="button"
                          role="option"
                          aria-selected={c.code === currency}
                          className={`flex w-full items-center justify-between px-3 py-2 text-sm transition-colors hover:bg-brown-50 ${
                            c.code === currency ? "text-gold-700" : "text-espresso"
                          }`}
                          onClick={() => { setCurrency(c.code); setCurrencyOpen(false); }}
                        >
                          <span>{c.code}</span>
                          <span>{c.symbol}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>

            {/* Cart */}
            <button
              type="button"
              className="relative flex size-10 items-center justify-center rounded-full text-current transition-opacity hover:opacity-70"
              aria-label={`Open cart, ${count} items`}
              onClick={() => setCartOpen(true)}
            >
              <ShoppingBag className="size-5" aria-hidden="true" />
              {count > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-gold-500 text-[10px] font-semibold text-espresso">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* ── Mega Menu (desktop only, flush against navbar) ── */}
        <MegaMenu
          category={activeCategory}
          products={products}
          onMouseEnter={cancelCloseMenu}
          onMouseLeave={scheduleCloseMenu}
        />
      </div>

      {/* ── Mobile Drawer ── */}
      <MobileMenu
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        categories={categories}
      />

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </header>
  );
}
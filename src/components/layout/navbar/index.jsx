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
import { Menu, Search, ShoppingBag } from "lucide-react";
import { cn } from "../../../utils/cn";
import { useCart } from "../../../context/CartContext";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const { data: categories } = useAsyncData(getCategories, []);
  const { data: products } = useAsyncData(getProducts, []);
  const { count } = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuId, setMenuId] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [mobileQuery, setMobileQuery] = useState("");
  const closeTimer = useRef(null);
  const navigate = useNavigate();

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
      setMobileSearchOpen(false);
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

  function onMobileSearchSubmit(e) {
    e.preventDefault();
    const q = mobileQuery.trim();
    if (!q) return;
    setMobileSearchOpen(false);
    setMobileQuery("");
    navigate(`/search?q=${encodeURIComponent(q)}`);
  }

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

          <Logo isScrolled={isScrolled} menuOpen={!!menuId} />

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
            <Logo isScrolled={isScrolled} menuOpen={!!menuId} />
          </div>

          {/* Right: Search + Cart */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              className="flex size-10 items-center justify-center rounded-full text-current transition-opacity hover:opacity-70"
              aria-label="Search"
              onClick={() => setMobileSearchOpen((v) => !v)}
            >
              <Search className="size-5" aria-hidden="true" />
            </button>
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

        {/* ── Mobile Search Bar (slide-down) ── */}
        {mobileSearchOpen && (
          <form
            onSubmit={onMobileSearchSubmit}
            className="lg:hidden px-4 sm:px-6 pb-3 border-t border-current/10"
          >
            <div className="relative mt-2">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-current opacity-50" aria-hidden="true" />
              <input
                type="search"
                value={mobileQuery}
                onChange={(e) => setMobileQuery(e.target.value)}
                placeholder="Search Belioras..."
                autoFocus
                className="h-10 w-full rounded-full border border-current/20 bg-current/5 pl-10 pr-4 text-sm text-current placeholder-current/50 focus:outline-none focus:border-current/40"
              />
            </div>
          </form>
        )}

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
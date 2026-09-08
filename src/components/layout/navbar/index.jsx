import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { useAsyncData } from "../../../hooks/useAsyncData";
import { getNavigation } from "../../../services/navigationApi";
import { getProducts } from "../../../services/productsApi";

import AnnouncementBar from "./AnnouncementBar";
import SearchPanel from "./SearchPanel";
import Logo from "./Logo";
import NavActions from "./NavActions";
import NavLinks from "./NavLinks";
import MegaMenu from "./MegaMenu";
import MobileMenu from "./MobileMenu";
import CartDrawer from "./CartDrawer";
import { Menu, Search, ShoppingBag } from "lucide-react";
import { cn } from "../../../utils/cn";
import { useCart } from "../../../context/CartContext";
import { useLocation } from "react-router-dom";

/**
 * Paths whose page opens on a plain light background rather than a full-bleed
 * photo, so the navbar should render solid from the first frame instead of
 * transparent-over-dark.
 *
 * /dresses, /hair, /accessories and /new-arrivals were missing here — they
 * went through the splat-route rework after this list was written, so the
 * navbar still treated them as hero pages. It went unnoticed while
 * ShopHeader had its own dark banner image to sit over; once that banner was
 * replaced with a plain header (see ShopHeader.jsx), the gap became a visible
 * dark-to-transparent gradient smudge over blank ivory.
 */
const LIGHT_BG_PATHS = [
  "/product",
  "/shop",
  "/dresses",
  "/hair",
  "/accessories",
  "/new-arrivals",
  "/account",
  "/contact",
  "/about",
  "/login",
  "/signup",
  "/forgot-password",
  "/search",
  "/wishlist",
];

export default function Navbar() {
  const { data: categories } = useAsyncData(getNavigation, []);
  const { data: products } = useAsyncData(getProducts, []);
  const { count } = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuId, setMenuId] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const closeTimer = useRef(null);
  const { pathname } = useLocation();
  const isLightBgPage = LIGHT_BG_PATHS.some((p) => pathname.startsWith(p));

  const headerRef = useRef(null);

  /**
   * Publishes the header's measured height as --header-height, so pages that
   * start below it can offset by the real value instead of guessing.
   *
   * It was guessed before (pt-32 = 128px against an actual 138px), which is
   * exactly the failure mode: the number is a function of the announcement
   * bar, the logo size and the breakpoint, so any hardcoded value is wrong as
   * soon as one of those changes. useLayoutEffect so it is set before paint
   * and the content never starts too high and jumps.
   */
  useLayoutEffect(() => {
    const el = headerRef.current;
    if (!el) return undefined;

    const publish = () =>
      document.documentElement.style.setProperty("--header-height", `${el.offsetHeight}px`);

    publish();
    const observer = new ResizeObserver(publish);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

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
      setSearchOpen(false);
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
    <header ref={headerRef} className={cn('fixed', 'inset-x-0', 'top-0', 'z-50', 'w-full')}>
      <AnnouncementBar />

      <div
        className={cn(
          "transition-all duration-300",
          isScrolled || menuId || mobileOpen || cartOpen || searchOpen || isLightBgPage
            ? // No shadow while a panel is open: the panel hangs directly
              // below and would catch the navbar's shadow as a grey seam.
                cn("surface-header", !menuId && !searchOpen && "shadow-subtle")
            : "bg-gradient-to-b from-black/60 via-black/30 to-transparent text-ivory-50",
        )}
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

          <Logo isScrolled={isScrolled} menuOpen={!!menuId || searchOpen} isLightBg={isLightBgPage} />

          <div className="flex items-center justify-end gap-4">
            <button
              type="button"
              onClick={() => setSearchOpen((v) => !v)}
              aria-label="Search"
              aria-expanded={searchOpen}
              aria-haspopup="dialog"
              className="flex size-10 items-center justify-center rounded-full text-current transition-opacity hover:opacity-70"
            >
              <Search className="size-5" aria-hidden="true" />
            </button>
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
            <Logo isScrolled={isScrolled} menuOpen={!!menuId || searchOpen} isLightBg={isLightBgPage} />
          </div>

          {/* Right: Search + Cart */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              className="flex size-10 items-center justify-center rounded-full text-current transition-opacity hover:opacity-70"
              aria-label="Search"
              onClick={() => setSearchOpen((v) => !v)}
              aria-expanded={searchOpen}
              aria-haspopup="dialog"
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


        {/* ── Mega Menu (responsive, flush against navbar) ── */}
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
        onSearchOpen={() => {
          setMobileOpen(false);
          setSearchOpen(true);
        }}
        categories={categories}
        onCartOpen={() => setCartOpen(true)}
      />

      <SearchPanel open={searchOpen} onClose={() => setSearchOpen(false)} />

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </header>
  );
}
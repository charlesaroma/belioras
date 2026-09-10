/* Layout Component: index */
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { useAsyncData } from "../../../hooks/useAsyncData";
import { useContentVersion } from "../../../context/ContentContext";
import { getNavigation } from "../../../services/navigationApi";

import AnnouncementBar from "./AnnouncementBar";
import SearchBar from "./SearchBar";
import SearchPanel from "./SearchPanel";
import Logo from "./Logo";
import NavActions from "./NavActions";
import NavLinks from "./NavLinks";
import MegaMenu from "./MegaMenu";
import MobileMenu from "./MobileMenu";
import CartDrawer from "./CartDrawer";
import { Menu, ShoppingBag } from "lucide-react";
import { cn } from "../../../utils/cn";
import { useCart } from "../../../context/CartContext";
import { useLocation, useNavigate } from "react-router-dom";
import LanguageSelector from "../../common/LanguageSelector";

/* LIGHT BG PATHS */
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

  const version = useContentVersion();
  const { data: categories } = useAsyncData(getNavigation, [version]);
  const { count } = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuId, setMenuId] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  // Where the open mega-menu trigger sits, so a compact panel opens under it.
  const [menuAnchor, setMenuAnchor] = useState(0);

  const closeTimer = useRef(null);

  const navigate = useNavigate();
  const { pathname } = useLocation();

/* is Light Bg Page */
  const isLightBgPage = LIGHT_BG_PATHS.some((p) => pathname.startsWith(p));

  const headerRef = useRef(null);

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

  /* Scroll Handler */
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

/* schedule Close Menu */
  const scheduleCloseMenu = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setMenuId(null), 160);
  };

/* cancel Close Menu */
  const cancelCloseMenu = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };

  /* Keyboard Event Handler */
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

  /* Body Scroll Lock */
  useEffect(() => {
    document.body.style.overflow = cartOpen || mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [cartOpen, mobileOpen]);

/* active Category */
  const activeCategory = categories?.find((c) => c.id === menuId);

  return (
    <header ref={headerRef} className={"fixed inset-x-0 top-0 z-50 w-full"}>
      <AnnouncementBar />

      {/* Navbar background transition container */}
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
              onAnchorChange={setMenuAnchor}
            />
          </div>

          <Logo />

          <div className="flex items-center justify-end gap-4">
            <SearchBar
              value={searchQuery}
              onChange={(v) => {
                setSearchQuery(v);
                if (v) setSearchOpen(true);
              }}
              onFocus={() => setSearchOpen(true)}
              onSubmit={() => {

/* q */
                const q = searchQuery.trim();
                if (!q) return;
                setSearchOpen(false);
                navigate(`/shop?q=${encodeURIComponent(q)}`);
              }}
            />
            <NavActions onCartOpen={() => setCartOpen(true)} />
          </div>
        </div>

        {/* ── Mobile / Tablet navbar ──
            1fr_auto_1fr, matching the desktop row: the two side columns are
            always equal, so the wordmark stays centred whatever the sides
            hold. With auto_1fr_auto it drifted by exactly the difference
            between the two — 62px, at every width.

            Language sits beside the bag because a shopper needs it to hand.
            Only one selector fits: the mark is 61px and the sides get about
            113px each at 320px, which takes language (50) plus the bag (44),
            but not currency (59) as well. Currency stays one row up. */}
        <div className="lg:hidden w-full px-4 sm:px-6 grid grid-cols-[1fr_auto_1fr] items-center py-3 gap-2">
          {/* Left: Burger menu button */}
          <div className="flex items-center justify-start">
            <button
              type="button"
              className="flex size-11 items-center justify-center rounded-full text-current transition-opacity hover:opacity-70"
              aria-label="Open menu"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="size-5" aria-hidden="true" />
            </button>
          </div>

          {/* Center: Logo */}
          <div className="flex justify-center">
            <Logo />
          </div>

          {/* Right: language selector and cart button */}
          <div className="flex items-center justify-end gap-2">
            <LanguageSelector />
            <button
              type="button"
              className="relative flex size-11 items-center justify-center rounded-full text-current transition-opacity hover:opacity-70"
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
          anchorLeft={menuAnchor}
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
      />

      <SearchPanel
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        query={searchQuery}
        onQueryChange={setSearchQuery}
      />

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </header>
  );
}
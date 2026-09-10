/* Layout Component: Navbar */
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import { useAsyncData } from "../../../hooks/useAsyncData";
import { useContentVersion } from "../../../context/ContentContext";
import { useCart } from "../../../context/CartContext";
import { getNavigation } from "../../../services/navigationApi";
import { cn } from "../../../utils/cn";

import AnnouncementBar from "./AnnouncementBar";
import NavbarDesktopRow from "./NavbarDesktopRow";
import NavbarMobileRow from "./NavbarMobileRow";
import MegaMenu from "./MegaMenu";
import MobileMenu from "./MobileMenu";
import SearchPanel from "./SearchPanel";
import CartDrawer from "./CartDrawer";
import { isLightBgPath } from "./navbarPaths";
import { useNavbarChrome } from "./useNavbarChrome";
import { useMegaMenuHover } from "./useMegaMenuHover";

export default function Navbar() {
  const version = useContentVersion();
  const { data: categories } = useAsyncData(getNavigation, [version]);
  const { count } = useCart();
  const { pathname } = useLocation();

  const { headerRef, isScrolled } = useNavbarChrome();
  const { menuId, setMenuId, openMenu, scheduleClose, cancelClose } = useMegaMenuHover();

  const [cartOpen, setCartOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  // Where the open mega-menu trigger sits, so a compact panel opens under it.
  const [menuAnchor, setMenuAnchor] = useState(0);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key !== "Escape") return;
      setMenuId(null);
      setCartOpen(false);
      setMobileOpen(false);
      setSearchOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [setMenuId]);

  useEffect(() => {
    document.body.style.overflow = cartOpen || mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [cartOpen, mobileOpen]);

  const activeCategory = categories?.find((c) => c.id === menuId);
  const solid = isScrolled || menuId || mobileOpen || cartOpen || searchOpen || isLightBgPath(pathname);

  return (
    <header ref={headerRef} className="fixed inset-x-0 top-0 z-50 w-full">
      <AnnouncementBar />

      <div
        className={cn(
          "transition-all duration-300",
          solid
            ? // No shadow while a panel is open: the panel hangs directly
              // below and would catch the navbar's shadow as a grey seam.
              cn("surface-header", !menuId && !searchOpen && "shadow-subtle")
            : "bg-gradient-to-b from-black/60 via-black/30 to-transparent text-ivory-50",
        )}
      >
        <NavbarDesktopRow
          categories={categories}
          menuId={menuId}
          onOpenMenu={openMenu}
          onScheduleClose={scheduleClose}
          onCancelClose={cancelClose}
          onAnchorChange={setMenuAnchor}
          searchQuery={searchQuery}
          onSearchQueryChange={(v) => {
            setSearchQuery(v);
            if (v) setSearchOpen(true);
          }}
          onSearchFocus={() => setSearchOpen(true)}
          onSearchClose={() => setSearchOpen(false)}
          onOpenCart={() => setCartOpen(true)}
        />

        <NavbarMobileRow
          cartCount={count}
          onOpenMenu={() => setMobileOpen(true)}
          onOpenCart={() => setCartOpen(true)}
        />

        <MegaMenu
          category={activeCategory}
          anchorLeft={menuAnchor}
          onMouseEnter={cancelClose}
          onMouseLeave={scheduleClose}
        />
      </div>

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

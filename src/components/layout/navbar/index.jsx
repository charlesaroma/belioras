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
import { Menu } from "lucide-react";

export default function Navbar() {
  const { data: categories } = useAsyncData(getCategories, []);
  const { data: products } = useAsyncData(getProducts, []);

  const [cartOpen, setCartOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuId, setMenuId] = useState(null);
  const closeTimer = useRef(null);

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
    <header>
      <AnnouncementBar />

      <div className="sticky top-0 z-50 border-b border-umber-50 bg-ivory-50/90 backdrop-blur">
        <div className="container-main grid grid-cols-[1fr_auto_1fr] items-center gap-12 py-3">
          <div className="flex items-center gap-3 lg:justify-start">
            <button
              type="button"
              className="flex size-10 items-center justify-center rounded-full text-espresso transition-colors hover:bg-brown-50 lg:hidden"
              aria-label="Open menu"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="size-5" aria-hidden="true" />
            </button>
            <NavLinks
              links={categories}
              menuId={menuId}
              onOpen={openMenu}
              onScheduleClose={scheduleCloseMenu}
              onCancelClose={cancelCloseMenu}
            />
          </div>

          <Logo />

          <div className="flex items-center justify-end gap-6">
            <SearchBar />
            <NavActions onCartOpen={() => setCartOpen(true)} />
          </div>
        </div>

        <MegaMenu
          category={activeCategory}
          products={products}
          onMouseEnter={cancelCloseMenu}
          onMouseLeave={scheduleCloseMenu}
        />

        <MobileMenu
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          categories={categories}
        />
      </div>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </header>
  );
}
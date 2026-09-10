/* Desktop Navbar Row */
import { useNavigate } from "react-router-dom";

import Logo from "./Logo";
import NavLinks from "./NavLinks";
import NavActions from "./NavActions";
import SearchBar from "./SearchBar";

export default function NavbarDesktopRow({
  categories,
  menuId,
  onOpenMenu,
  onScheduleClose,
  onCancelClose,
  onAnchorChange,
  searchQuery,
  onSearchQueryChange,
  onSearchFocus,
  onSearchClose,
  onOpenCart,
}) {
  const navigate = useNavigate();

  return (
    <div className="hidden w-full grid-cols-[1fr_auto_1fr] items-center gap-8 px-8 py-3 lg:grid xl:gap-12 xl:px-16 2xl:px-24">
      <div className="flex items-center gap-3">
        <NavLinks
          links={categories}
          menuId={menuId}
          onOpen={onOpenMenu}
          onScheduleClose={onScheduleClose}
          onCancelClose={onCancelClose}
          onAnchorChange={onAnchorChange}
        />
      </div>

      <Logo />

      <div className="flex items-center justify-end gap-4">
        <SearchBar
          value={searchQuery}
          onChange={onSearchQueryChange}
          onFocus={onSearchFocus}
          onSubmit={() => {
            const q = searchQuery.trim();
            if (!q) return;
            onSearchClose();
            navigate(`/shop?q=${encodeURIComponent(q)}`);
          }}
        />
        <NavActions onCartOpen={onOpenCart} />
      </div>
    </div>
  );
}

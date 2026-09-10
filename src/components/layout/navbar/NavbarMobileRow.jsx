/* Mobile Navbar Row */
import { Menu, ShoppingBag } from "lucide-react";

import Logo from "./Logo";
import LanguageSelector from "../../common/LanguageSelector";

// 1fr_auto_1fr, matching the desktop row: the two side columns are always
// equal, so the wordmark stays centred whatever the sides hold. Under
// auto_1fr_auto it drifted by the difference between them — 62px, at every
// width. Only one selector fits beside the bag; currency stays a row up.
export default function NavbarMobileRow({ cartCount, onOpenMenu, onOpenCart }) {
  return (
    <div className="grid w-full grid-cols-[1fr_auto_1fr] items-center gap-2 px-4 py-3 sm:px-6 lg:hidden">
      <div className="flex items-center justify-start">
        <button
          type="button"
          className="flex size-11 items-center justify-center rounded-full text-current transition-opacity hover:opacity-70"
          aria-label="Open menu"
          onClick={onOpenMenu}
        >
          <Menu className="size-5" aria-hidden="true" />
        </button>
      </div>

      <div className="flex justify-center">
        <Logo />
      </div>

      <div className="flex items-center justify-end gap-2">
        <LanguageSelector />
        <button
          type="button"
          className="relative flex size-11 items-center justify-center rounded-full text-current transition-opacity hover:opacity-70"
          aria-label={`Open cart, ${cartCount} items`}
          onClick={onOpenCart}
        >
          <ShoppingBag className="size-5" aria-hidden="true" />
          {cartCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-gold-500 text-[10px] font-semibold text-espresso">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}

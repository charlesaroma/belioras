/* Category List */
import { useState } from "react";
import { Link } from "react-router-dom";

import { hasMegaMenu, menuLabel } from "../navbarMenu";
import MobileMenuCategory from "./MobileMenuCategory";
import { titleCase } from "./mobileMenuText";

// Owns which category is open, so only one is at a time. It mounts with the
// drawer's panel, so every opening starts with all of them folded.
export default function MobileMenuNav({ categories, t, onClose }) {
  const [openId, setOpenId] = useState(null);

  return (
    <nav aria-label="Categories" className="border-t border-umber-50 px-6">
      {(categories ?? []).map((item) =>
        hasMegaMenu(item) ? (
          <MobileMenuCategory
            key={item.id}
            category={item}
            open={openId === item.id}
            onToggle={() => setOpenId((cur) => (cur === item.id ? null : item.id))}
            onClose={onClose}
          />
        ) : (
          <Link
            key={item.id}
            to={item.url}
            onClick={onClose}
            className="block border-b border-umber-50 py-5 font-display text-[26px] leading-none tracking-[-0.01em] text-espresso transition-colors hover:text-gold-700"
          >
            {titleCase(menuLabel(item, t))}
          </Link>
        ),
      )}
    </nav>
  );
}

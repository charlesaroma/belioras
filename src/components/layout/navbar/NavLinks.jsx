import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";

import { NAV_LINKS } from "../../../utils/constants";

const MEGA_IDS = ["new-arrivals", "shop", "dresses", "hair", "accessories"];

export default function NavLinks({ links, menuId, onOpen, onScheduleClose, onCancelClose }) {
  return (
    <nav aria-label="Main" className="hidden md:block">
      <ul className="flex items-center justify-start gap-6">
        {NAV_LINKS.map((link) => {
          const category = links?.find((c) => c.id === link.id);
          const hasMenu = MEGA_IDS.includes(link.id);
          const open = menuId === link.id;

          return (
            <li 
              key={link.id} 
              onMouseEnter={() => {
                if (hasMenu) {
                  onCancelClose();
                  onOpen(link.id, false);
                }
              }}
              onMouseLeave={() => {
                if (hasMenu) {
                  onScheduleClose();
                }
              }}
            >
              {hasMenu ? (
                <button
                  type="button"
                  aria-expanded={open}
                  onFocus={() => onOpen(link.id, false)}
                  onClick={() => onOpen(link.id, true)}
                  className={`flex items-center gap-1 py-3 text-[13px] font-medium uppercase tracking-[0.16em] transition-colors ${
                    open ? "text-gold-700" : "text-current hover:text-gold-700"
                  }`}
                >
                  {link.label}
                  <ChevronDown
                    className={`size-3.5 transition-transform ${open ? "rotate-180" : ""}`}
                    aria-hidden="true"
                  />
                </button>
              ) : (
                <Link
                  to={link.to}
                  className="block py-3 text-[13px] font-medium uppercase tracking-[0.16em] text-current transition-colors hover:text-gold-700"
                >
                  {link.label}
                </Link>
              )}

              {hasMenu && category && (
                <span
                  className="sr-only"
                  aria-label={`${link.label} has ${category.sections?.length || 0} sections`}
                />
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
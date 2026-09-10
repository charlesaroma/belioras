/* Layout Component: NavLinks */
import { useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";

import { useLanguage } from "../../../context/LanguageContext";
import { NAV_LINKS } from "../../../utils/constants";

/* MEGA IDS */
const MEGA_IDS = ["new-arrivals", "shop", "dresses", "hair", "accessories"];

export default function NavLinks({
  links,
  menuId,
  onOpen,
  onScheduleClose,
  onCancelClose,
  onAnchorChange,
}) {
  const { t } = useLanguage();

  const itemRefs = useRef({});

  useLayoutEffect(() => {
    if (!menuId || !onAnchorChange) return;

    const el = itemRefs.current[menuId];

    const header = el?.closest("header");
    if (!el || !header) return;
    onAnchorChange(el.getBoundingClientRect().left - header.getBoundingClientRect().left);
  }, [menuId, onAnchorChange]);

  return (
    // Visibility is governed by the navbar's own `hidden lg:grid` container;
    // a second breakpoint here only ever drifts out of step with it.
    <nav aria-label="Main">
      <ul className="flex items-center justify-start gap-6">
        {NAV_LINKS.map((link) => {

          const label = t(link.key, link.label);

          const category = links?.find((c) => c.id === link.id);

          const hasMenu = MEGA_IDS.includes(link.id);

          const open = menuId === link.id;

          return (
            <li
              key={link.id}
              ref={(el) => {
                itemRefs.current[link.id] = el;
              }}
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
                  className={`flex items-center gap-1 whitespace-nowrap py-3 text-[13px] font-medium uppercase tracking-[0.16em] transition-colors cursor-pointer ${
                    open ? "text-gold-700" : "text-current hover:text-gold-700"
                  }`}
                >
                  {label}
                  <ChevronDown
                    className={`size-3.5 transition-transform ${open ? "rotate-180" : ""}`}
                    aria-hidden="true"
                  />
                </button>
              ) : (
                <Link
                  to={link.to}
                  className="block whitespace-nowrap py-3 text-[13px] font-medium uppercase tracking-[0.16em] text-current transition-colors hover:text-gold-700 cursor-pointer"
                >
                  {label}
                </Link>
              )}

              {hasMenu && category && (
                <span
                  className="sr-only"
                  aria-label={`${label} has ${category.sections?.length || 0} sections`}
                />
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
/* Layout Component: NavLinks */
import { useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";

import { useLanguage } from "../../../context/LanguageContext";
import { hasMegaMenu, menuLabel } from "./navbarMenu";

/**
 * The top-level items come from the menu the admin manages, in its order. An
 * item with columns opens the mega menu; one without is a plain link.
 */
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
        {(links ?? []).map((item) => {
          const label = menuLabel(item, t);
          const hasMenu = hasMegaMenu(item);
          const open = menuId === item.id;

          return (
            <li
              key={item.id}
              ref={(el) => {
                itemRefs.current[item.id] = el;
              }}
              onMouseEnter={() => {
                if (hasMenu) {
                  onCancelClose();
                  onOpen(item.id, false);
                }
              }}
              onMouseLeave={() => {
                if (hasMenu) onScheduleClose();
              }}
            >
              {hasMenu ? (
                <button
                  type="button"
                  aria-expanded={open}
                  aria-label={`${label}, ${item.sections.length} ${item.sections.length === 1 ? "section" : "sections"}`}
                  onFocus={() => onOpen(item.id, false)}
                  onClick={() => onOpen(item.id, true)}
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
                  to={item.url}
                  className="block whitespace-nowrap py-3 text-[13px] font-medium uppercase tracking-[0.16em] text-current transition-colors hover:text-gold-700 cursor-pointer"
                >
                  {label}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

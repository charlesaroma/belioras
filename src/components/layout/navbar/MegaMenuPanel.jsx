import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";

import { cn } from "../../../utils/cn";

/**
 * The contents of one navigation root — text columns plus image tiles.
 *
 * One renderer serves both chromes: the desktop hover flyout (MegaMenu) lays
 * sections out in columns, while the mobile drawer (MobileMenu) collapses them
 * into accordions. Keeping it in a single component is what stops the two
 * presentations drifting apart as the tree changes.
 *
 * Structure follows the category logic the client signed off on, unchanged;
 * only the visual treatment and the imagery are new.
 */
export default function MegaMenuPanel({ item, variant = "desktop", onNavigate }) {
  const [openSection, setOpenSection] = useState(null);

  if (!item) return null;

  const sections = item.sections ?? [];
  const tiles = item.tiles ?? [];
  if (!sections.length && !tiles.length) return null;

  const isAccordion = variant === "mobile";

  if (isAccordion) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          {sections.map((section, idx) => {
            // First section open by default so the drawer never opens blank.
            const isOpen = openSection === section.id || (openSection === null && idx === 0);
            return (
              <div key={section.id} className="border-b border-umber-50/60 last:border-b-0">
                <button
                  type="button"
                  onClick={() => setOpenSection((cur) => (cur === section.id ? null : section.id))}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between py-3.5 text-left"
                >
                  <span className="eyebrow">{section.title}</span>
                  <ChevronDown
                    className={cn(
                      "size-4 shrink-0 text-espresso-300 transition-transform duration-300",
                      isOpen && "rotate-180",
                    )}
                    aria-hidden="true"
                  />
                </button>

                {/* grid-rows 1fr→0fr animates height with no JS measuring. */}
                <div
                  className={cn(
                    "grid transition-all duration-300 ease-in-out",
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                  )}
                >
                  <ul className="min-h-0 space-y-3 overflow-hidden pb-4">
                    {section.items.map((leaf) => (
                      <li key={leaf.id}>
                        <Link
                          to={leaf.url}
                          onClick={onNavigate}
                          // Collapsed links must not be reachable by keyboard.
                          tabIndex={isOpen ? 0 : -1}
                          className="block text-sm text-espresso-soft transition-colors hover:text-gold-700"
                        >
                          {leaf.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {tiles.length > 0 && <TileGrid tiles={tiles} onNavigate={onNavigate} columns={2} />}
      </div>
    );
  }

  return (
    <div className="flex gap-10 xl:gap-16">
      {/*
        Shop carries five sections. Five text columns next to the tiles is
        unreadable, so the columns cap at two on lg and three on xl and the
        remaining sections wrap.
      */}
      <div className="min-w-0 flex-1 columns-2 gap-10 xl:columns-3 xl:gap-12">
        {sections.map((section) => (
          <div key={section.id} className="mb-8 break-inside-avoid last:mb-0">
            <h3 className="eyebrow mb-3 border-b border-umber-50/60 pb-2">{section.title}</h3>
            <ul className="space-y-2">
              {section.items.map((leaf) => (
                <li key={leaf.id}>
                  <Link
                    to={leaf.url}
                    onClick={onNavigate}
                    className="block text-[13px] text-espresso-soft transition-all duration-150 hover:translate-x-0.5 hover:text-gold-700"
                  >
                    {leaf.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {tiles.length > 0 && (
        <div className="hidden w-[340px] shrink-0 xl:block">
          <TileGrid tiles={tiles} onNavigate={onNavigate} columns={2} />
        </div>
      )}
    </div>
  );
}

/** The imagery the client asked to be added to the dropdowns. */
function TileGrid({ tiles, onNavigate, columns }) {
  return (
    <ul className={cn("grid gap-3", columns === 2 ? "grid-cols-2" : "grid-cols-1")}>
      {tiles.map((tile) => (
        <li key={tile.id}>
          <Link
            to={tile.url}
            onClick={onNavigate}
            className="group relative block overflow-hidden rounded-md"
          >
            <img
              src={tile.image}
              alt=""
              loading="lazy"
              className="aspect-[3/4] w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <span className="absolute inset-0 bg-gradient-to-t from-espresso/80 via-espresso/10 to-transparent" />
            <span className="absolute inset-x-3 bottom-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-ivory-50">
              {tile.title}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

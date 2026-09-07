import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronDown } from "lucide-react";
import { motion } from "motion/react";

import { cn } from "../../../utils/cn";

/**
 * The contents of one navigation root — link columns beside editorial imagery.
 *
 * One renderer serves both chromes: the desktop flyout lays sections out in
 * columns, the mobile drawer collapses them into accordions. Keeping it in a
 * single component is what stops the two presentations drifting apart.
 *
 * The category structure is the one the client signed off on, unchanged. What
 * changed is the treatment: the previous version read as a sitemap — flat text
 * in columns with two small thumbnails stranded at the right and a large field
 * of dead space beneath them. Here the imagery is full-height and carries its
 * own captions, links get a gold underline that sweeps on hover, and a footer
 * strip closes the panel instead of letting it trail off.
 */

/** Small enough that a long list still resolves quickly — see note on stagger. */
const STAGGER = 0.035;

/**
 * Sections are capped rather than dumped in full.
 *
 * Shop carries 67 leaves; rendering every one made the panel taller than the
 * viewport and turned a navigation aid into a sitemap. Showing the first few
 * and linking onward is both the shorter panel and the better read — nobody
 * scans thirteen colour names, they scan for the two they came for.
 */
const ITEMS_PER_SECTION = 6;

export default function MegaMenuPanel({ item, variant = "desktop", onNavigate }) {
  const [openSection, setOpenSection] = useState(null);

  if (!item) return null;

  const sections = item.sections ?? [];
  const tiles = item.tiles ?? [];
  if (!sections.length && !tiles.length) return null;

  if (variant === "mobile") {
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

        {tiles.length > 0 && <TileGrid tiles={tiles} onNavigate={onNavigate} layout="mobile" />}
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="flex gap-12 xl:gap-16">
        {/*
          Shop carries five sections. Five columns beside the imagery is
          unreadable, so they cap at two on lg and three on xl and wrap.
        */}
        <div className="grid min-w-0 flex-1 grid-cols-2 gap-x-10 gap-y-9 xl:grid-cols-3 xl:gap-x-12">
          {sections.map((section, i) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              // Small offset and a tight stagger: it should read as the panel
              // settling, not as each column sliding in one at a time.
              transition={{ duration: 0.3, delay: i * STAGGER, ease: "easeOut" }}
              className="min-w-0"
            >
              <h3 className="eyebrow mb-4 flex items-center gap-2">
                {section.title}
                <span aria-hidden="true" className="h-px flex-1 bg-gold-500/25" />
              </h3>

              <ul className="space-y-2.5">
                {section.items.slice(0, ITEMS_PER_SECTION).map((leaf) => (
                  <li key={leaf.id}>
                    <Link
                      to={leaf.url}
                      onClick={onNavigate}
                      className="group/link relative inline-block text-[13px] leading-snug text-espresso-soft transition-colors duration-200 hover:text-espresso"
                    >
                      {leaf.label}
                      {/* Gold rule that sweeps out from the left on hover —
                          the same underline language as the nav links above. */}
                      <span
                        aria-hidden="true"
                        className="absolute -bottom-0.5 left-0 h-px w-0 bg-gold-500 transition-all duration-300 group-hover/link:w-full"
                      />
                    </Link>
                  </li>
                ))}

                {section.items.length > ITEMS_PER_SECTION && (
                  <li>
                    <Link
                      to={item.url}
                      onClick={onNavigate}
                      className="inline-flex items-center gap-1 pt-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-gold-700 transition-colors hover:text-espresso"
                    >
                      +{section.items.length - ITEMS_PER_SECTION} more
                    </Link>
                  </li>
                )}
              </ul>
            </motion.div>
          ))}
        </div>

        {tiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: sections.length * STAGGER, ease: "easeOut" }}
            className="hidden w-[360px] shrink-0 xl:block"
          >
            <TileGrid tiles={tiles} onNavigate={onNavigate} layout="desktop" />
          </motion.div>
        )}
      </div>

      {/* Closes the panel off, and gives the whole category a single obvious
          destination — previously there was no way to browse a root wholesale. */}
      <div className="mt-8 flex items-center justify-between gap-6 border-t border-umber-50/60 pt-5">
        <Link
          to={item.url}
          onClick={onNavigate}
          className="group/all inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-espresso transition-colors hover:text-gold-700"
        >
          {/* "View all shop" reads as a stutter; the Shop root is everything. */}
          {item.id === "shop" ? "View all products" : `View all ${item.label.toLowerCase()}`}
          <ArrowRight
            className="size-3.5 transition-transform duration-300 group-hover/all:translate-x-1"
            aria-hidden="true"
          />
        </Link>

        <p className="hidden text-[11px] uppercase tracking-[0.16em] text-espresso-soft sm:block">
          Complimentary EU shipping over &euro;150
        </p>
      </div>
    </div>
  );
}

/**
 * Editorial imagery.
 *
 * Full-height on desktop rather than the previous pair of small squares, which
 * left the right third of the panel empty. The first tile is given the taller
 * share so the block has a focal point instead of reading as a uniform grid.
 */
function TileGrid({ tiles, onNavigate, layout }) {
  const isDesktop = layout === "desktop";

  return (
    <ul className={cn("grid grid-cols-2 gap-3", isDesktop && "h-[520px]")}>
      {tiles.slice(0, 2).map((tile, i) => (
        <li key={tile.id} className={cn(isDesktop && (i === 1 ? "h-[calc(100%-2rem)] self-end" : "h-full"))}>
          <Link
            to={tile.url}
            onClick={onNavigate}
            className="group/tile relative block h-full overflow-hidden rounded-md"
          >
            <img
              src={tile.image}
              alt=""
              loading="lazy"
              className={cn(
                "w-full object-cover transition-transform duration-[600ms] ease-out group-hover/tile:scale-[1.06]",
                isDesktop ? "h-full" : "aspect-[3/4]",
                // Offsetting the second tile turns two equal rectangles into a
                // composition, which is what makes it read as editorial.
                isDesktop && i === 1 && "mt-8",
              )}
            />
            <span
              aria-hidden="true"
              className={cn(
                "pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-espresso/85 via-espresso/25 to-transparent transition-opacity duration-300 group-hover/tile:from-espresso/95",
                isDesktop ? "h-1/2" : "h-2/3",
                isDesktop && i === 1 && "mt-8",
              )}
            />
            <span className="absolute inset-x-4 bottom-4 flex items-center justify-between gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ivory-50">
                {tile.title}
              </span>
              <ArrowRight
                className="size-3.5 shrink-0 text-gold-400 transition-transform duration-300 group-hover/tile:translate-x-1"
                aria-hidden="true"
              />
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

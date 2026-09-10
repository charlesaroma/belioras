/* Layout Component: MegaMenuPanel */
import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronDown } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { cn } from "../../../utils/cn";

/* EASE OUT SOFT */
const EASE_OUT_SOFT = [0.22, 1, 0.36, 1];

/* SECTION DURATION */
const SECTION_DURATION = 0.38;

const STAGGER = 0.035;

/* ITEMS PER SECTION */
const ITEMS_PER_SECTION = 6;

export default function MegaMenuPanel({
  item,
  variant = "desktop",
  onNavigate,
  columns = 3,
  showTiles = true,
}) {
  const [openSection, setOpenSection] = useState(null);

  const reduceMotion = useReducedMotion();

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

            // A lone section whose title restates the category it sits under
            // ("New Arrivals" inside New Arrivals) is a heading carrying no
            // information; its links stand on their own.
            const redundantHeading =
              sections.length === 1 &&
              section.title.toLowerCase() === (item.label ?? "").toLowerCase();

            return redundantHeading ? (
                <ul key={section.id} className="space-y-3 pb-2">
                  {section.items.map((leaf) => (
                    <li key={leaf.id}>
                      <Link
                        to={leaf.url}
                        onClick={onNavigate}
                        className="block text-sm text-espresso transition-colors hover:text-gold-700"
                      >
                        {leaf.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
              <div
                key={section.id}
                className={cn(
                  "border-b border-umber-50/60 border-l-2 pl-3 transition-colors duration-300 last:border-b-0",
                  isOpen ? "border-l-gold-500 bg-brown-50/40" : "border-l-transparent",
                )}
              >
                <button
                  type="button"
                  onClick={() => setOpenSection((cur) => (cur === section.id ? null : section.id))}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between py-3.5 pr-2 text-left"
                >
                  <span className={cn("eyebrow", isOpen && "!text-espresso")}>{section.title}</span>
                  <ChevronDown
                    className={cn(
                      "size-4 shrink-0 text-espresso-300 transition-transform duration-[380ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
                      isOpen && "rotate-180",
                    )}
                    aria-hidden="true"
                  />
                </button>

                {/* Was a grid-rows 1fr→0fr trick. It needs no measuring, but
                    browsers interpolate grid tracks coarsely, so it stepped
                    rather than glided — and it left the drawer running two
                    different animation systems, since the category accordion
                    above it is already on motion. Both are on motion now.

                    Unmounting on collapse also removes the links from the tab
                    order for free, which the old version had to do by hand
                    with tabIndex. */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{
                        height: { duration: reduceMotion ? 0 : SECTION_DURATION, ease: EASE_OUT_SOFT },
                        opacity: { duration: reduceMotion ? 0 : SECTION_DURATION * 0.6, ease: "easeOut" },
                      }}
                      className="overflow-hidden"
                    >
                      <motion.ul
                        className="space-y-3 pb-4"
                        initial="closed"
                        animate="open"
                        exit="closed"
                        variants={{
                          // Stagger only on the way in. Cascading them out
                          // again reads as hesitation when you are collapsing
                          // a section to get it out of the way.
                          open: { transition: { staggerChildren: 0.028, delayChildren: 0.05 } },
                          closed: {},
                        }}
                      >
                        {section.items.map((leaf) => (
                          <motion.li
                            key={leaf.id}
                            variants={
                              reduceMotion
                                ? {}
                                : { open: { opacity: 1, y: 0 }, closed: { opacity: 0, y: -6 } }
                            }
                            transition={{ duration: 0.24, ease: "easeOut" }}
                          >
                            <Link
                              to={leaf.url}
                              onClick={onNavigate}
                              className="block text-sm text-espresso transition-colors hover:text-gold-700"
                            >
                              {leaf.label}
                            </Link>
                          </motion.li>
                        ))}
                      </motion.ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Tiles are desktop-only. In the drawer they push the category list
            below the fold and turn a navigation aid into a scroll. */}
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="flex gap-12 xl:gap-16">
        {/* Link Columns */}
        <div
          className="grid min-w-0 flex-1 gap-x-10 gap-y-9 xl:gap-x-12"
          style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
        >
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
                      className="group/link relative inline-block text-[13px] leading-snug text-espresso transition-colors duration-200 hover:text-gold-700"
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

        {showTiles && tiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: sections.length * STAGGER, ease: "easeOut" }}
            className="hidden w-[360px] shrink-0 xl:block"
          >
            <TileGrid tiles={tiles} onNavigate={onNavigate} />
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

function TileGrid({ tiles, onNavigate }) {

  return (
    <ul className={"grid h-[520px] grid-cols-2 gap-3"}>
      {tiles.slice(0, 2).map((tile, i) => (
        <li key={tile.id} className={i === 1 ? "h-[calc(100%-2rem)] self-end" : "h-full"}>
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
                "h-full",
                // Offsetting the second tile turns two equal rectangles into a
                // composition, which is what makes it read as editorial.
                              )}
            />
            <span
              aria-hidden="true"
              className={cn(
                "pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-espresso/85 via-espresso/25 to-transparent transition-opacity duration-300 group-hover/tile:from-espresso/95",
                "h-1/2",
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

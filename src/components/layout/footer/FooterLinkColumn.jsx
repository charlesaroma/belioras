/* One Footer Column */
import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { cn } from "../../../utils/cn";

// One component for both breakpoints: an accordion below md, a plain heading
// with an always-open list from md up. The footer used to render two separate
// trees for this, so every link existed in the markup twice.
export default function FooterLinkColumn({ title, links, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  const reduceMotion = useReducedMotion();

  return (
    <div
      className={cn(
        "-mx-5 border-b border-espresso/10 px-5 transition-colors duration-300 last:border-b-0 md:mx-0 md:border-none md:px-0",
        // The open section gets a ground of its own, the same language the
        // mobile nav drawer uses, so which one you opened is never in doubt.
        open ? "bg-brown-50/40 md:bg-transparent" : "bg-transparent",
      )}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex min-h-[56px] w-full items-center justify-between text-left md:pointer-events-none md:mb-6 md:min-h-0"
      >
        <h3 className="text-[10px] font-semibold uppercase tracking-[0.24em] text-espresso">
          {title}
        </h3>
        {/* A plus rotating into a cross, matching the nav drawer rather than
            introducing a third chevron style. */}
        <Plus
          className={cn(
            "size-4 shrink-0 text-espresso/35 transition-transform duration-[380ms] ease-[cubic-bezier(0.22,1,0.36,1)] md:hidden",
            open && "rotate-45",
          )}
          aria-hidden="true"
        />
      </button>

      {/* Desktop keeps the list mounted; mobile animates it. */}
      <ul className="hidden md:block lg:space-y-3.5">
        {links.map((link) => (
          <li key={link.to}>
            <FooterLink to={link.to} className="min-h-11 lg:min-h-0">
              {link.label}
            </FooterLink>
          </li>
        ))}
      </ul>

      <div className="md:hidden">
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{
                height: { duration: reduceMotion ? 0 : 0.38, ease: [0.22, 1, 0.36, 1] },
                opacity: { duration: reduceMotion ? 0 : 0.24, ease: "easeOut" },
              }}
              className="overflow-hidden"
            >
              <ul className="pb-4">
                {links.map((link) => (
                  <li key={link.to}>
                    <FooterLink to={link.to} className="min-h-11">
                      {link.label}
                    </FooterLink>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// A gold rule that sweeps out from the left on hover — the same underline
// language the mega menu uses, so a link behaves alike everywhere.
function FooterLink({ to, children, className }) {
  return (
    <Link
      to={to}
      className={cn(
        "group/link relative inline-flex items-center text-[13px] text-espresso/65 transition-colors duration-200 hover:text-espresso",
        className,
      )}
    >
      {children}
      <span
        aria-hidden="true"
        className="absolute -bottom-0.5 left-0 h-px w-0 bg-gold-500 transition-all duration-300 group-hover/link:w-full"
      />
    </Link>
  );
}

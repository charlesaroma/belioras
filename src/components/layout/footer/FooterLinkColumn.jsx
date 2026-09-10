/* One Footer Column */
import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";

import { cn } from "../../../utils/cn";

// One component for both breakpoints. Below md it is an accordion; from md
// the button becomes an inert heading and the list is always shown. The
// footer used to render two separate trees for this, so every link existed
// twice in the markup.
export default function FooterLinkColumn({ title, links, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-espresso/10 md:border-none">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex min-h-11 w-full items-center justify-between py-4 text-left md:pointer-events-none md:mb-5 md:min-h-0 md:py-0"
      >
        <h3 className="font-display text-sm font-medium uppercase tracking-[0.14em] text-espresso">
          {title}
        </h3>
        <ChevronDown
          className={cn(
            "size-4 text-espresso/50 transition-transform duration-300 md:hidden",
            open && "rotate-180",
          )}
          aria-hidden="true"
        />
      </button>

      <ul className={cn("space-y-2.5 pb-4 md:block md:pb-0", open ? "block" : "hidden")}>
        {links.map((link) => (
          <li key={link.to}>
            <Link
              to={link.to}
              className="flex min-h-11 items-center text-sm text-espresso/80 transition-colors hover:text-gold-700 md:min-h-0"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

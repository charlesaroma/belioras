import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown, Search, X } from "lucide-react";

import { NAV_LINKS } from "../../../utils/constants";
import { useCurrency } from "../../../context/CurrencyContext";

const UTILITY_LINKS = [
  { label: "New Arrivals", to: "/whats-new" },
  { label: "FAQ", to: "/faq" },
  { label: "About us", to: "/about-us" },
  { label: "Contact us", to: "/contact-us" },
  { label: "Order tracking", to: "/order-tracking" },
  { label: "Hair length guide", to: "/hair-length-guide" },
  { label: "Shoe size guide", to: "/shoe-size-guide" },
];

const CURRENCIES = [
  { code: "EUR", symbol: "€" },
  { code: "USD", symbol: "$" },
  { code: "GBP", symbol: "£" },
];

function CategoryAccordion({ category }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-umber-50">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between py-3.5 text-sm font-semibold uppercase tracking-[0.14em] text-espresso"
      >
        {category.label}
        <ChevronDown
          className={`size-4 text-espresso/50 transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {category.children.map((child) => (
              <li key={child.slug}>
                <Link
                  to={`/shop/${category.id}?categories=${child.slug.split("/").filter(Boolean).at(-1)}`}
                  className="block py-2 pl-4 text-sm text-espresso/70 hover:text-gold-700"
                >
                  {child.label}
                </Link>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function MobileMenu({ open, onClose, categories }) {
  const { currency, setCurrency } = useCurrency();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  function onSubmit(e) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    onClose();
    navigate(`/search?q=${encodeURIComponent(q)}`);
  }

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[60] lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 cursor-default bg-espresso/40 backdrop-blur-sm"
            aria-label="Close menu"
            onClick={onClose}
          />

          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
            className="absolute inset-y-0 left-0 flex w-[min(88vw,380px)] flex-col overflow-y-auto bg-ivory-50 shadow-large"
          >
            <div className="flex items-center justify-between border-b border-umber-50 px-5 py-4">
              <Link to="/" onClick={onClose} className="shrink-0" aria-label="Belioras — home">
                <img
                  src="/belioras-logo.png"
                  alt="Belioras"
                  width={600}
                  height={400}
                  className="h-10 w-auto"
                />
              </Link>
              <button
                type="button"
                className="flex size-10 items-center justify-center rounded-full text-espresso hover:bg-brown-50"
                aria-label="Close menu"
                onClick={onClose}
              >
                <X className="size-5" aria-hidden="true" />
              </button>
            </div>

            <form onSubmit={onSubmit} role="search" aria-label="Search products" className="px-5 py-4">
              <div className="relative">
                <Search
                  className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-espresso/40"
                  aria-hidden="true"
                />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search"
                  className="input h-11 w-full rounded-full pl-11 pr-4"
                />
              </div>
            </form>

            <div className="px-5">
              {NAV_LINKS.filter((l) => !["new-arrivals"].includes(l.id)).map((link) => {
                const category = categories?.find((c) => c.id === link.id);
                if (!category) return null;
                return <CategoryAccordion key={category.id} category={category} />;
              })}

              <Link
                to="/whats-new"
                onClick={onClose}
                className="block border-b border-umber-50 py-3.5 text-sm font-semibold uppercase tracking-[0.14em] text-espresso"
              >
                New Arrivals
              </Link>
            </div>

            <div className="flex gap-2 px-5 py-4">
              {CURRENCIES.map((c) => (
                <button
                  key={c.code}
                  type="button"
                  className={`chip ${currency === c.code ? "chip-selected" : ""}`}
                  aria-pressed={currency === c.code}
                  onClick={() => setCurrency(c.code)}
                >
                  {c.symbol} {c.code}
                </button>
              ))}
            </div>

            <div className="border-t border-umber-50 px-5 py-4">
              <p className="eyebrow mb-2">Help &amp; company</p>
              <ul className="space-y-2.5">
                {UTILITY_LINKS.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      onClick={onClose}
                      className="text-sm text-espresso/70 hover:text-gold-700"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
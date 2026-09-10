/* Layout Component: Footer */
import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";

import { useAsyncData } from "../../hooks/useAsyncData";
import { useContentVersion } from "../../context/ContentContext";
import { useToast } from "../../context/ToastContext";
import { getSettings } from "../../services/settingsApi";
import { getNavigation } from "../../services/navigationApi";
import PaymentMarks from "../shared/PaymentMarks";

/* CUSTOMER SUPPORT LINKS */
const CUSTOMER_SUPPORT_LINKS = [
  { label: "FAQ", to: "/faq" },
  { label: "Contact", to: "/contact-us" },
  { label: "Order Tracking", to: "/order-tracking" },
  { label: "Returns & Refunds", to: "/return-and-refund-policy" },
  { label: "Shipping Policy", to: "/shipping-policy" },
];

/* COMPANY LINKS */
const COMPANY_LINKS = [
  { label: "About Us", to: "/about-us" },
  { label: "Hair Length Guide", to: "/hair-length-guide" },
  { label: "Shoe Size Guide", to: "/shoe-size-guide" },
];

/* LEGAL LINKS */
const LEGAL_LINKS = [
  { label: "Privacy Policy", to: "/privacy-policy" },
  { label: "Terms of Service", to: "/terms-of-service" },
  { label: "Cookie Policy", to: "/cookie-policy" },
];

/* EMAIL RE */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/* Instagram Icon */
function InstagramIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

/* Column Title */
function ColumnTitle({ children }) {
  return (
    <h3 className="font-display text-sm font-medium uppercase tracking-[0.14em] text-espresso">
      {children}
    </h3>
  );
}

/* Collapsible Section */
function CollapsibleSection({ title, children, defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-espresso/10 md:border-none">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-4 md:py-0 md:mb-5 text-left"
        aria-expanded={isOpen}
      >
        <ColumnTitle>{title}</ColumnTitle>
        <ChevronDown
          className={`size-4 text-espresso/50 transition-transform md:hidden ${isOpen ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>
      <div className={`md:block ${isOpen ? "block pb-4" : "hidden"}`}>
        {children}
      </div>
    </div>
  );
}

function Newsletter({ showTitle = true, band = false }) {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!EMAIL_RE.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    setEmail("");
    toast("Thanks for subscribing to Belioras — your 10% welcome code is on its way.", "success");
  };

  const body = (
    <div className={band ? "mx-auto max-w-xl text-center" : ""}>
      {band ? (
        <>
          <p className="eyebrow !text-gold-400">The Belioras Letter</p>
          <h2 className="mt-2 font-display text-3xl text-ivory-50">
            Collection previews, atelier stories and private sales
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-ivory-50/60">
            Once a month, never more.
          </p>
        </>
      ) : (
        <>
          {showTitle && <ColumnTitle>Newsletter</ColumnTitle>}
          <p className="mt-4 text-sm leading-relaxed text-espresso/70">
            Seasonal edits, private sales and styling notes. No noise.
          </p>
        </>
      )}
      <form className="mt-6 flex gap-2" onSubmit={handleSubmit} noValidate>
        <label className="sr-only" htmlFor="footer-newsletter-email">
          Email address
        </label>
        <input
          id="footer-newsletter-email"
          type="email"
          autoComplete="email"
          className={
            band
              ? "min-w-0 flex-1 border-b border-ivory-50/25 bg-transparent px-2 py-3 text-sm text-ivory-50 placeholder:text-ivory-50/40 focus:border-gold-400 focus:outline-none transition-colors"
              : "min-w-0 flex-1 border-b border-espresso/20 bg-transparent px-2 py-3 text-sm text-espresso placeholder:text-espresso/40 focus:border-gold-700 focus:outline-none transition-colors"
          }
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          type="submit"
          className={
            band
              ? "inline-flex items-center gap-2 border-b border-ivory-50/25 px-2 text-xs font-semibold uppercase tracking-[0.2em] text-ivory-50/90 transition-colors hover:border-gold-400 hover:text-gold-400"
              : "inline-flex items-center gap-2 border-b border-espresso/20 px-2 text-xs font-semibold uppercase tracking-[0.2em] text-espresso/80 transition-colors hover:border-gold-700 hover:text-gold-700"
          }
          aria-label="Subscribe to newsletter"
        >
          Subscribe
        </button>
      </form>
      {error ? (
        <p className="mt-2 text-xs text-error" role="alert">
          {error}
        </p>
      ) : (
        <p className={band ? "mt-3 text-xs leading-relaxed text-ivory-50/50" : "mt-3 text-xs leading-relaxed text-espresso/60"}>
          By subscribing you agree to our{" "}
          <Link to="/privacy-policy" className="underline decoration-gold-500 underline-offset-2">
            privacy policy
          </Link>
          . Unsubscribe anytime.
        </p>
      )}
    </div>
  );

  if (!band) return body;

  return (
    <section
      className="bg-espresso px-4 py-14 sm:px-6 md:py-16"
      aria-labelledby="newsletter-heading"
    >
      {body}
    </section>
  );
}

export default function Footer() {

  const version = useContentVersion();
  const { data: settings } = useAsyncData(getSettings, [version]);
  const { data: categories } = useAsyncData(getNavigation, [version]);

  const social = settings?.social ?? {};

  const gpsr = settings?.gpsr;

  return (
    <footer className="bg-ivory-50 text-espresso">
      {/* Dedicated signup section — never a popup. */}
      <Newsletter band />

      <div className="px-4 sm:px-6 md:px-8 lg:px-8 xl:px-16 2xl:px-24 py-12 md:py-16">
        {/* Mobile: Stacked with collapsible sections */}
        <div className="md:hidden space-y-0">
          {/* Brand Section */}
          <div className="border-b border-espresso/10 pb-6 mb-6">
            <p className="mt-4 text-sm leading-relaxed text-espresso/70">
              Quiet pieces, made to be kept. European-made dresses, ethically sourced hair and
              leather goods that only get better with age.
            </p>
            <div className="mt-6 flex items-center gap-4">
              <a
                href={social.instagram ?? "https://instagram.com"}
                target="_blank"
                rel="noopener noreferrer"
                className="text-espresso/80 transition-colors hover:text-gold-700"
                aria-label="Belioras on Instagram"
              >
                <InstagramIcon className="size-5" />
              </a>
              {[
                { label: "Pinterest", href: social.pinterest },
                { label: "TikTok", href: social.tiktok },
              ].map(
                (net) =>
                  net.href && (
                    <a
                      key={net.label}
                      href={net.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] font-semibold uppercase tracking-[0.18em] text-espresso/80 transition-colors hover:text-gold-700"
                    >
                      {net.label}
                    </a>
                  )
              )}
            </div>
            <p className="mt-6 text-[11px] leading-relaxed text-espresso/60 uppercase tracking-widest">
              {gpsr?.manufacturer}, {gpsr?.address}
              <br />
              Product safety: {gpsr?.email}
            </p>
          </div>

          {/* Collapsible Sections */}
          <CollapsibleSection title="Shop" defaultOpen={true}>
            <ul className="space-y-2.5">
              <li>
                <Link to="/whats-new" className="text-sm text-espresso/80 transition-colors hover:text-gold-700">
                  What&apos;s New
                </Link>
              </li>
              {(categories ?? []).map((category) => (
                <li key={category.id}>
                  <Link
                    to={`/${category.id}`}
                    className="text-sm text-espresso/80 transition-colors hover:text-gold-700"
                  >
                    {category.label}
                  </Link>
                </li>
              ))}
            </ul>
          </CollapsibleSection>

          <CollapsibleSection title="Support">
            <ul className="space-y-2.5">
              {CUSTOMER_SUPPORT_LINKS.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-espresso/80 transition-colors hover:text-gold-700">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </CollapsibleSection>

          <CollapsibleSection title="Company">
            <ul className="space-y-2.5">
              {COMPANY_LINKS.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-espresso/80 transition-colors hover:text-gold-700">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </CollapsibleSection>

          <CollapsibleSection title="Legal">
            <ul className="space-y-2.5">
              {LEGAL_LINKS.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-espresso/80 transition-colors hover:text-gold-700">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </CollapsibleSection>

        </div>

        {/* Desktop: Grid Layout */}
        <div className="hidden md:grid gap-12 lg:grid-cols-[1.6fr_1fr_1fr_1fr] lg:gap-8">
          <div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-espresso/70">
              Quiet pieces, made to be kept. European-made dresses, ethically sourced hair and
              leather goods that only get better with age.
            </p>
            <div className="mt-8 flex items-center gap-4">
              <a
                href={social.instagram ?? "https://instagram.com"}
                target="_blank"
                rel="noopener noreferrer"
                className="text-espresso/80 transition-colors hover:text-gold-700"
                aria-label="Belioras on Instagram"
              >
                <InstagramIcon className="size-5" />
              </a>
              {[
                { label: "Pinterest", href: social.pinterest },
                { label: "TikTok", href: social.tiktok },
              ].map(
                (net) =>
                  net.href && (
                    <a
                      key={net.label}
                      href={net.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] font-semibold uppercase tracking-[0.18em] text-espresso/80 transition-colors hover:text-gold-700"
                    >
                      {net.label}
                    </a>
                  )
              )}
            </div>
            <p className="mt-8 text-[11px] leading-relaxed text-espresso/60 uppercase tracking-widest">
              {gpsr?.manufacturer}, {gpsr?.address}
              <br />
              Product safety: {gpsr?.email}
            </p>
          </div>

          <nav aria-label="Shop">
            <ColumnTitle>Shop</ColumnTitle>
            <ul className="mt-5 space-y-2.5">
              <li>
                <Link to="/whats-new" className="text-sm text-espresso/80 transition-colors hover:text-gold-700">
                  What&apos;s New
                </Link>
              </li>
              {(categories ?? []).map((category) => (
                <li key={category.id}>
                  <Link
                    to={`/${category.id}`}
                    className="text-sm text-espresso/80 transition-colors hover:text-gold-700"
                  >
                    {category.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Customer Support">
            <ColumnTitle>Support</ColumnTitle>
            <ul className="mt-5 space-y-2.5">
              {CUSTOMER_SUPPORT_LINKS.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-espresso/80 transition-colors hover:text-gold-700">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex flex-col gap-8">
            <nav aria-label="Company & Guides">
              <ColumnTitle>Company</ColumnTitle>
              <ul className="mt-5 space-y-2.5">
                {COMPANY_LINKS.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to} className="text-sm text-espresso/80 transition-colors hover:text-gold-700">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            
            <nav aria-label="Legal">
              <ColumnTitle>Legal</ColumnTitle>
              <ul className="mt-5 space-y-2.5">
                {LEGAL_LINKS.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to} className="text-sm text-espresso/80 transition-colors hover:text-gold-700">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

        </div>
      </div>

      <div className="border-t border-espresso/10">
        <div className="px-4 sm:px-6 md:px-8 lg:px-8 xl:px-16 2xl:px-24 flex flex-col gap-4 py-8 text-xs text-espresso/60 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Belioras Maison Lda. All rights reserved.</p>
          <PaymentMarks className="justify-center text-espresso/70 md:justify-start" />
          <p className="text-center md:text-right">{settings?.tax?.note ?? "All prices include 20% VAT."}</p>
        </div>
      </div>
    </footer>
  );
}
import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import { useAsyncData } from "../../hooks/useAsyncData";
import { useToast } from "../../context/ToastContext";
import { getSettings } from "../../services/settingsApi";
import { getCategories } from "../../services/categoriesApi";

const CUSTOMER_SUPPORT_LINKS = [
  { label: "FAQ", to: "/faq" },
  { label: "Contact", to: "/contact-us" },
  { label: "Order Tracking", to: "/order-tracking" },
  { label: "Returns & Refunds", to: "/return-and-refund-policy" },
  { label: "Shipping Policy", to: "/shipping-policy" },
];

const COMPANY_LINKS = [
  { label: "About Us", to: "/about-us" },
  { label: "Hair Length Guide", to: "/hair-length-guide" },
  { label: "Shoe Size Guide", to: "/shoe-size-guide" },
];

const LEGAL_LINKS = [
  { label: "Privacy Policy", to: "/privacy-policy" },
  { label: "Terms of Service", to: "/terms-of-service" },
  { label: "Cookie Policy", to: "/cookie-policy" },
];

const PAYMENTS = ["Visa", "Mastercard", "Amex", "PayPal", "Apple Pay", "Klarna"];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

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

function ColumnTitle({ children }) {
  return (
    <h3 className="font-display text-sm font-medium uppercase tracking-[0.14em] text-espresso">
      {children}
    </h3>
  );
}

function Newsletter() {
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
    toast("Thanks for subscribing — your 10% welcome code is on its way.", "success");
  };

  return (
    <div>
      <ColumnTitle>Newsletter</ColumnTitle>
      <p className="mt-4 text-sm leading-relaxed text-espresso/70">
        Seasonal edits, private sales and styling notes. No noise.
      </p>
      <form className="mt-5 flex gap-2" onSubmit={handleSubmit} noValidate>
        <label className="sr-only" htmlFor="footer-newsletter-email">
          Email address
        </label>
        <input
          id="footer-newsletter-email"
          type="email"
          autoComplete="email"
          className="min-w-0 flex-1 border-b border-espresso/20 bg-transparent px-2 py-3 text-sm text-espresso placeholder:text-espresso/40 focus:border-gold-700 focus:outline-none transition-colors"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          type="submit"
          className="inline-flex items-center gap-2 border-b border-espresso/20 px-2 text-xs font-semibold uppercase tracking-[0.2em] text-espresso/80 transition-colors hover:border-gold-700 hover:text-gold-700"
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
        <p className="mt-3 text-xs leading-relaxed text-espresso/60">
          By subscribing you agree to our{" "}
          <Link to="/privacy-policy" className="underline decoration-gold-700 underline-offset-2 hover:text-espresso">
            privacy policy
          </Link>
          . Unsubscribe anytime.
        </p>
      )}
    </div>
  );
}

export default function Footer() {
  const { data: settings } = useAsyncData(getSettings, []);
  const { data: categories } = useAsyncData(getCategories, []);

  const social = settings?.social ?? {};
  const gpsr = settings?.gpsr;

  return (
    <footer className="bg-ivory-50 text-espresso">
      <div className="container-main grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1.2fr_1.3fr] lg:gap-8">
        <div>
          <Link to="/" className="font-display text-2xl tracking-[0.08em] text-espresso">
            belioras
          </Link>
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
                  to={`/shop/${category.id}`}
                  className="text-sm text-espresso/80 transition-colors hover:text-gold-700"
                >
                  {category.name}
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

        <Newsletter />
      </div>

      <div className="border-t border-espresso/10">
        <div className="container-main flex flex-col gap-4 py-8 text-xs text-espresso/60 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Belioras Maison Ltd. All rights reserved.</p>
          <ul className="flex flex-wrap gap-2" aria-label="Accepted payment methods">
            {PAYMENTS.map((method) => (
              <li
                key={method}
                className="rounded border border-espresso/20 px-2.5 py-1 uppercase tracking-wider text-espresso/70"
              >
                {method}
              </li>
            ))}
          </ul>
          <p>{settings?.tax?.note ?? "All prices include 20% VAT."}</p>
        </div>
      </div>
    </footer>
  );
}
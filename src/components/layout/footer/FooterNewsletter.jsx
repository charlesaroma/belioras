/* Newsletter Band */
import { useState } from "react";
import { Link } from "react-router-dom";

import { useToast } from "../../../context/ToastContext";
import { EMAIL_RE } from "./footerLinks";

// A dedicated section rather than a popup — the review ruled out
// interruptions entirely. The component previously carried a second,
// light-background variant that nothing ever rendered.
export default function FooterNewsletter() {
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

  return (
    <section className="bg-espresso py-14 md:py-16" aria-labelledby="newsletter-heading">
      <div className="container-main">
        <div className="mx-auto max-w-xl text-center">
          <p className="eyebrow !text-gold-400">The Belioras Letter</p>
          <h2 id="newsletter-heading" className="mt-2 font-display text-3xl text-ivory-50">
            Collection previews, atelier stories and private sales
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-ivory-50/60">Once a month, never more.</p>

          <form className="mt-6 flex gap-2" onSubmit={handleSubmit} noValidate>
            <label className="sr-only" htmlFor="footer-newsletter-email">
              Email address
            </label>
            <input
              id="footer-newsletter-email"
              type="email"
              autoComplete="email"
              className="min-h-11 min-w-0 flex-1 border-b border-ivory-50/25 bg-transparent px-2 text-sm text-ivory-50 transition-colors placeholder:text-ivory-50/40 focus:border-gold-400 focus:outline-none"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              type="submit"
              className="inline-flex min-h-11 shrink-0 items-center gap-2 border-b border-ivory-50/25 px-2 text-xs font-semibold uppercase tracking-[0.2em] text-ivory-50/90 transition-colors hover:border-gold-400 hover:text-gold-400"
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
            <p className="mt-3 text-xs leading-relaxed text-ivory-50/50">
              By subscribing you agree to our{" "}
              <Link
                to="/privacy-policy"
                className="underline decoration-gold-500 underline-offset-2"
              >
                privacy policy
              </Link>
              . Unsubscribe anytime.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

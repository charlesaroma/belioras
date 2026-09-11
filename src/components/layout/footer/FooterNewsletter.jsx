/* Newsletter Band */
import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import { useToast } from "../../../context/ToastContext";
import { EMAIL_RE } from "./footerLinks";

// A dedicated band rather than a popup — the review ruled out interruptions
// entirely. Proportioned so the espresso reads as a deliberate rule across
// the page rather than a large empty panel.
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
    <section className="bg-espresso text-ivory-50" aria-labelledby="newsletter-heading">
      <div className="container-main py-14 md:py-20">
        <div className="grid gap-10 md:grid-cols-[1fr_auto] md:items-end md:gap-16">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gold-400">
              The Belioras Letter
            </p>
            <h2
              id="newsletter-heading"
              className="mt-4 max-w-[18ch] font-display text-[30px] leading-[1.15] tracking-[-0.01em] text-ivory-50 md:text-[38px]"
            >
              Collection previews and private sales
            </h2>
            <p className="mt-4 text-[13px] leading-relaxed text-ivory-50/45">
              Once a month, never more.
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="w-full md:w-[380px]">
            <label className="sr-only" htmlFor="footer-newsletter-email">
              Email address
            </label>
            <div className="flex items-center gap-3 border-b border-ivory-50/25 transition-colors focus-within:border-gold-400">
              <input
                id="footer-newsletter-email"
                type="email"
                autoComplete="email"
                className="min-h-12 min-w-0 flex-1 bg-transparent text-sm text-ivory-50 outline-none placeholder:text-ivory-50/35"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                type="submit"
                aria-label="Subscribe to the Belioras Letter"
                className="group/sub flex size-11 shrink-0 items-center justify-center text-ivory-50/70 transition-colors hover:text-gold-400"
              >
                <ArrowRight
                  className="size-4 transition-transform duration-300 group-hover/sub:translate-x-0.5"
                  aria-hidden="true"
                />
              </button>
            </div>

            {error ? (
              <p className="mt-3 text-xs text-gold-300" role="alert">
                {error}
              </p>
            ) : (
              <p className="mt-3 text-[11px] leading-relaxed text-ivory-50/35">
                By subscribing you agree to our{" "}
                <Link to="/privacy-policy" className="underline underline-offset-2 hover:text-ivory-50/70">
                  privacy policy
                </Link>
                .
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}

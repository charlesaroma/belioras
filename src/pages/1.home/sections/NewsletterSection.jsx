import { ArrowRight, Check } from "lucide-react";
import { useState } from "react";

import { useToast } from "../../../context/ToastContext";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    toast("Welcome to the Maison — your code is on its way", "success");
    setEmail("");
  };

  return (
    <section aria-labelledby="newsletter-title" className="bg-espresso py-section-mobile md:py-section-desktop">
      <div className="container-main max-w-3xl text-center">
        <p className="eyebrow !text-gold-400">The Belioras Edit</p>
        <h2
          id="newsletter-title"
          className="mt-3 font-display text-3xl tracking-wide text-ivory-50 md:text-4xl"
        >
          Join the Maison
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-ivory-50/70">
          New arrivals, private sales and 10% off your first order — delivered quietly,
          never more than twice a month.
        </p>

        <form onSubmit={handleSubmit} className="mx-auto mt-8 flex max-w-md">
          <label htmlFor="newsletter-email" className="sr-only">
            Email address
          </label>
          <input
            id="newsletter-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            className="w-full border border-ivory-50/20 bg-transparent px-4 py-3 text-sm text-ivory-50 placeholder:text-ivory-50/40 focus:border-gold-400 focus:outline-none"
          />
          <button
            type="submit"
            className="inline-flex shrink-0 items-center gap-2 bg-gold-600 px-6 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-ivory-50 transition hover:bg-gold-700"
          >
            Subscribe
            <ArrowRight className="size-4" aria-hidden="true" />
          </button>
        </form>
        <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-ivory-50/60">
          <Check className="size-3.5 text-gold-400" aria-hidden="true" />
          Unsubscribe anytime. We never share your details.
        </p>
      </div>
    </section>
  );
}
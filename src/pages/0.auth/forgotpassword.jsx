import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, KeyRound, Loader2, MailCheck } from "lucide-react";

import { mockDelay } from "../../services/apiClient";

const inputClasses =
  "mt-1.5 w-full rounded-xl border border-umber-50 bg-ivory-50 px-3.5 py-2.5 text-sm text-espresso placeholder:text-espresso-soft/60 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/20";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Enter a valid email address.");
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      await mockDelay(600);
      setSent(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="container-main py-section-mobile md:py-section-desktop" aria-labelledby="forgot-title">
      <p className="eyebrow">Account</p>
      <h1 id="forgot-title" className="font-display text-4xl font-medium capitalize tracking-wide">
        Reset Password
      </h1>

      <div className="mx-auto mt-8 max-w-md">
        {sent ? (
          <div className="rounded-3xl border border-umber-50 bg-white p-6 text-center shadow-sm sm:p-8">
            <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-gold-500/15 text-gold-700">
              <MailCheck className="size-6" aria-hidden="true" />
            </span>
            <h2 className="mt-5 font-display text-xl font-medium tracking-wide">Check your inbox</h2>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-espresso-soft">
              If an account exists for <span className="font-medium text-espresso">{email.trim()}</span>, reset
              instructions are on their way. They expire within 30 minutes.
            </p>
            <Link
              to="/login"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-espresso px-6 py-3 text-sm font-medium text-ivory-50 transition-colors duration-200 hover:bg-umber-500 active:scale-[0.98]"
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
              Back to sign in
            </Link>
          </div>
        ) : (
          <div>
            <form
              onSubmit={handleSubmit}
              noValidate
              className="rounded-3xl border border-umber-50 bg-white p-6 shadow-sm sm:p-8"
              aria-label="Password reset form"
            >
              <p className="text-sm leading-relaxed text-espresso-soft">
                Enter the email linked to your account and we will send a secure reset link.
              </p>
              <div className="mt-5">
                <label htmlFor="reset-email" className="block text-sm font-medium text-espresso">
                  Email
                </label>
                <input
                  id="reset-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="you@example.com"
                  className={inputClasses}
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? "reset-email-error" : undefined}
                />
                {error ? (
                  <p id="reset-email-error" className="mt-1 text-xs text-rose-700" role="alert">
                    {error}
                  </p>
                ) : null}
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-espresso px-6 py-3 text-sm font-medium text-ivory-50 transition-colors duration-200 hover:bg-umber-500 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                    Sending link…
                  </>
                ) : (
                  <>
                    <KeyRound className="size-4" aria-hidden="true" />
                    Send reset link
                  </>
                )}
              </button>
            </form>
            <p className="mt-6 text-center text-sm text-espresso-soft">
              Remembered it?{" "}
              <Link to="/login" className="font-medium text-gold-700 transition-colors hover:text-gold-600">
                Back to sign in
              </Link>
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
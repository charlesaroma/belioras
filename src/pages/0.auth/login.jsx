import { useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { Loader2, LogIn } from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

const inputClasses =
  "mt-1.5 w-full rounded-xl border border-umber-50 bg-ivory-50 px-3.5 py-2.5 text-sm text-espresso placeholder:text-espresso-soft/60 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/20";

export default function LoginPage() {
  const { login, isAuthenticated, loading: submitting } = useAuth();
  const { toast } = useToast();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  if (isAuthenticated) {
    return <Navigate to={location.state?.from ?? "/account"} replace />;
  }

  const validate = () => {
    const next = {};
    if (!email.trim()) next.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) next.email = "Enter a valid email address.";
    if (!password) next.password = "Password is required.";
    return next;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validate();
    if (Object.keys(nextErrors).length) {
      setFormErrors(nextErrors);
      return;
    }
    setError(null);
    try {
      await login({ email: email.trim(), password });
      toast("Welcome back", "success");
    } catch (err) {
      setError(err?.message ?? "Sign in failed. Please try again.");
    }
  };

  return (
    <section className="container-main py-section-mobile md:py-section-desktop" aria-labelledby="login-title">
      <p className="eyebrow">Account</p>
      <h1 id="login-title" className="font-display text-4xl font-medium capitalize tracking-wide">
        Sign In
      </h1>

      <div className="mx-auto mt-8 max-w-md">
        <form
          onSubmit={handleSubmit}
          noValidate
          className="rounded-3xl border border-umber-50 bg-white p-6 shadow-sm sm:p-8"
          aria-label="Sign in form"
        >
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-espresso">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (formErrors.email || error) {
                    setFormErrors((prev) => ({ ...prev, email: undefined }));
                    setError(null);
                  }
                }}
                placeholder="you@example.com"
                className={inputClasses}
                aria-invalid={Boolean(formErrors.email || error)}
                aria-describedby={formErrors.email ? "email-error" : undefined}
              />
              {formErrors.email ? (
                <p id="email-error" className="mt-1 text-xs text-rose-700" role="alert">
                  {formErrors.email}
                </p>
              ) : null}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-espresso">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (formErrors.password || error) {
                    setFormErrors((prev) => ({ ...prev, password: undefined }));
                    setError(null);
                  }
                }}
                placeholder="Your password"
                className={inputClasses}
                aria-invalid={Boolean(formErrors.password || error)}
                aria-describedby={formErrors.password ? "password-error" : undefined}
              />
              {formErrors.password ? (
                <p id="password-error" className="mt-1 text-xs text-rose-700" role="alert">
                  {formErrors.password}
                </p>
              ) : null}
            </div>
          </div>

          {error ? (
            <p className="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700" role="alert">
              {error}
            </p>
          ) : null}

          <div className="mt-4 flex items-center justify-between gap-3 text-sm">
            <Link to="/forgot-password" className="text-sm text-espresso-soft transition-colors hover:text-gold-700">
              Forgot your password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-espresso px-6 py-3 text-sm font-medium text-ivory-50 transition-colors duration-200 hover:bg-umber-500 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                Signing in…
              </>
            ) : (
              <>
                <LogIn className="size-4" aria-hidden="true" />
                Sign in
              </>
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-espresso-soft">
          New to Belioras?{" "}
          <Link to="/signup" className="font-medium text-gold-700 transition-colors hover:text-gold-600">
            Create an account
          </Link>
        </p>

        <div className="mt-8 rounded-2xl border border-dashed border-umber-50 bg-ivory-50/60 p-4 text-xs leading-relaxed text-espresso-soft">
          <p className="font-medium text-espresso">Demo accounts</p>
          <p className="mt-1">
            Any seed account signs in with password <span className="font-mono text-gold-700">demo123</span> — e.g.{" "}
            <span className="font-mono">mariana@belioras.com</span> (customer),{" "}
            <span className="font-mono">admin@belioras.com</span> (administrator).
          </p>
        </div>
      </div>
    </section>
  );
}
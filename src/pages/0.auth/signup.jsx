import { useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { Loader2, UserPlus } from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

const inputClasses =
  "mt-1.5 w-full rounded-xl border border-umber-50 bg-ivory-50 px-3.5 py-2.5 text-sm text-espresso placeholder:text-espresso-soft/60 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/20";

const MIN_PASSWORD_LENGTH = 6;

export default function SignupPage() {
  const { register, isAuthenticated, loading: submitting } = useAuth();
  const { toast } = useToast();
  const location = useLocation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  if (isAuthenticated) {
    return <Navigate to={location.state?.from ?? "/account"} replace />;
  }

  const validate = () => {
    const next = {};
    if (!name.trim()) next.name = "Full name is required.";
    if (!email.trim()) next.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) next.email = "Enter a valid email address.";
    if (!password) next.password = "Password is required.";
    else if (password.length < MIN_PASSWORD_LENGTH)
      next.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
    return next;
  };

  const clearFieldError = (field) => (e) => {
    if (field === "name") setName(e.target.value);
    if (field === "email") setEmail(e.target.value);
    if (field === "password") setPassword(e.target.value);
    setFormErrors((prev) => ({ ...prev, [field]: undefined }));
    setError(null);
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
      await register({ name: name.trim(), email: email.trim(), password });
      toast("Account created — welcome to Belioras", "success");
    } catch (err) {
      setError(err?.message ?? "Sign up failed. Please try again.");
    }
  };

  return (
    <section className="container-main py-section-mobile md:py-section-desktop" aria-labelledby="signup-title">
      <p className="eyebrow">Account</p>
      <h1 id="signup-title" className="font-display text-4xl font-medium capitalize tracking-wide">
        Create Account
      </h1>

      <div className="mx-auto mt-8 max-w-md">
        <form
          onSubmit={handleSubmit}
          noValidate
          className="rounded-3xl border border-umber-50 bg-white p-6 shadow-sm sm:p-8"
          aria-label="Create account form"
        >
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-espresso">
                Full name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                value={name}
                onChange={clearFieldError("name")}
                placeholder="Your full name"
                className={inputClasses}
                aria-invalid={Boolean(formErrors.name)}
                aria-describedby={formErrors.name ? "name-error" : undefined}
              />
              {formErrors.name ? (
                <p id="name-error" className="mt-1 text-xs text-rose-700" role="alert">
                  {formErrors.name}
                </p>
              ) : null}
            </div>

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
                onChange={clearFieldError("email")}
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
                autoComplete="new-password"
                value={password}
                onChange={clearFieldError("password")}
                placeholder={`At least ${MIN_PASSWORD_LENGTH} characters`}
                className={inputClasses}
                aria-invalid={Boolean(formErrors.password)}
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

          <button
            type="submit"
            disabled={submitting}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-espresso px-6 py-3 text-sm font-medium text-ivory-50 transition-colors duration-200 hover:bg-umber-500 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                Creating account…
              </>
            ) : (
              <>
                <UserPlus className="size-4" aria-hidden="true" />
                Create account
              </>
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-espresso-soft">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-gold-700 transition-colors hover:text-gold-600">
            Sign in
          </Link>
        </p>
      </div>
    </section>
  );
}
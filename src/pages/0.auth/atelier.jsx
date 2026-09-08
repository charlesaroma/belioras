import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { isAdminRole, resolveLanding } from "../../utils/roles";
import { validateCredentials } from "../../utils/validateCredentials";

const LOGO = "/belioras-boutique-primary-logo-rgb-belioras-original.svg";

/**
 * The atelier door.
 *
 * Staff and shoppers were signing in through the same form. They want
 * different things: a shopper wants to register, recover a password and be
 * welcomed; a member of staff wants to get to work. This entrance is
 * deliberately spare — no sign-up, no marketing, no imagery — and is linked
 * from nowhere on the storefront.
 *
 * On espresso rather than the storefront's ivory, so it is visibly a different
 * place and nobody mistakes it for the shopper sign-in.
 *
 * It accepts any valid credentials rather than refusing non-staff. Refusing
 * would answer the question "is this address a staff account?" for anyone
 * probing, which is precisely what someone hunting for admin accounts wants to
 * know. A shopper who ends up here is signed in and sent to their account.
 *
 * This is a signpost, not a security control. The controls that matter —
 * mandatory 2FA, tighter rate limiting, short server-side sessions — attach
 * here once the backend identity module is wired up.
 */
export default function AtelierLogin() {
  const { login, loading, isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState(null);

  // Already signed in — send them where they belong rather than asking again.
  if (isAuthenticated) {
    return <Navigate to={resolveLanding(user, location.state?.from)} replace />;
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    const errs = validateCredentials({ email, password });
    if (Object.keys(errs).length) {
      setFieldErrors(errs);
      return;
    }

    setFieldErrors({});
    setError(null);

    try {
      const result = await login({ email: email.trim(), password });
      const signedIn = result?.user;

      if (isAdminRole(signedIn?.role)) {
        toast(`Welcome back, ${signedIn.name?.split(" ")[0] ?? "there"}.`, "success");
      } else {
        // Signed in, just not staff. Say so plainly — they have already proved
        // who they are, so this reveals nothing they did not supply.
        toast("That is a client account. Taking you to your account instead.", "info");
      }

      // Navigated directly, with no setTimeout: setSession is synchronous, so
      // the delay the previous flow used bought nothing and left an
      // uncancelled timer that fired even after unmount.
      navigate(resolveLanding(signedIn, location.state?.from), { replace: true });
    } catch (err) {
      setError(err?.message ?? "Sign in failed. Please try again.");
    }
  };

  const inputClass =
    "w-full border-b border-ivory-50/25 bg-transparent px-0 py-3 text-sm text-ivory-50 placeholder:text-ivory-50/35 focus:border-gold-500 focus:outline-none transition-colors";

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-espresso px-6 py-16">
      <div className="w-full max-w-sm">
        <Link to="/" aria-label="Belioras — storefront" className="mx-auto block w-fit">
          <img src={LOGO} alt="Belioras" width={91} height={67} className="h-14 w-auto" />
        </Link>

        <p className="eyebrow mt-8 text-center">Atelier</p>
        <h1 className="mt-2 text-center font-display text-3xl tracking-wide text-ivory-50">
          Staff sign in
        </h1>

        <form onSubmit={onSubmit} className="mt-10 space-y-6" noValidate>
          <div>
            <label
              htmlFor="atelier-email"
              className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.22em] text-ivory-50/55"
            >
              Business email
            </label>
            <input
              id="atelier-email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={Boolean(fieldErrors.email)}
              aria-describedby={fieldErrors.email ? "atelier-email-error" : undefined}
              className={inputClass}
            />
            {fieldErrors.email && (
              <p id="atelier-email-error" className="mt-1.5 text-[12px] text-error">
                {fieldErrors.email}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="atelier-password"
              className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.22em] text-ivory-50/55"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="atelier-password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-invalid={Boolean(fieldErrors.password)}
                aria-describedby={fieldErrors.password ? "atelier-password-error" : undefined}
                className={`${inputClass} pr-10`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-ivory-50/45 transition-colors hover:text-ivory-50"
              >
                {showPassword ? (
                  <EyeOff className="size-4" aria-hidden="true" />
                ) : (
                  <Eye className="size-4" aria-hidden="true" />
                )}
              </button>
            </div>
            {fieldErrors.password && (
              <p id="atelier-password-error" className="mt-1.5 text-[12px] text-error">
                {fieldErrors.password}
              </p>
            )}
          </div>

          {error && (
            <p role="alert" className="text-[13px] text-error">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 bg-gold-500 py-3.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-espresso transition-colors hover:bg-gold-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading && <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />}
            Sign in
          </button>
        </form>

        {/* No sign-up link: staff accounts are created by an administrator,
            never self-registered. */}
        <p className="mt-8 text-center text-[11px] leading-relaxed text-ivory-50/40">
          Access is granted by a Belioras administrator. Shopping instead?{" "}
          <Link to="/login" className="underline underline-offset-4 hover:text-ivory-50/70">
            Client sign in
          </Link>
        </p>

        {import.meta.env.DEV && (
          <div className="mt-8 border border-dashed border-ivory-50/15 p-4 text-[11px] leading-relaxed text-ivory-50/45">
            <p className="mb-1.5 font-semibold text-ivory-50/70">Staff accounts (dev only)</p>
            <p>
              Password: <span className="font-mono text-gold-400">demo123</span>
            </p>
            <p className="mt-1">
              <span className="font-mono">admin@belioras.com</span> — Administrator
            </p>
            <p>
              <span className="font-mono">staff@belioras.com</span> — Staff
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

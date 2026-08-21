import { useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { motion } from "motion/react";
import { Loader2, Eye, EyeOff } from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

const HERO_IMAGE = "https://ik.imagekit.io/sbgenu6wj/Belioras/Home/hero-image-belioras.PNG";
const MIN_PASSWORD_LENGTH = 6;

const inputBase =
  "w-full border-b border-umber-50 bg-transparent px-0 py-3 text-sm text-espresso placeholder:text-espresso/40 focus:border-espresso focus:outline-none transition-colors";

function FloatingInput({ id, label, type = "text", value, onChange, error, autoComplete, rightSlot }) {
  return (
    <div className="relative">
      <label
        htmlFor={id}
        className={`absolute top-3 text-xs font-semibold uppercase tracking-widest transition-all duration-200 pointer-events-none ${
          value ? "-translate-y-5 text-[10px] text-espresso/50" : "text-espresso/40"
        }`}
      >
        {label}
      </label>
      <div className="flex items-center">
        <input
          id={id}
          name={id}
          type={type}
          autoComplete={autoComplete}
          value={value}
          onChange={onChange}
          className={`${inputBase} ${error ? "border-rose-400" : ""} ${rightSlot ? "pr-8" : ""}`}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
        />
        {rightSlot && <span className="absolute right-0 flex items-center">{rightSlot}</span>}
      </div>
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-xs text-rose-600" role="alert">{error}</p>
      )}
    </div>
  );
}

export default function SignupPage() {
  const { register, isAuthenticated, loading: submitting } = useAuth();
  const { toast } = useToast();
  const location = useLocation();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  if (isAuthenticated) {
    return <Navigate to={location.state?.from ?? "/account"} replace />;
  }

  const validate = () => {
    const next = {};
    if (!name.trim()) next.name = "Full name is required.";
    if (!email.trim()) next.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) next.email = "Enter a valid email.";
    if (!password) next.password = "Password is required.";
    else if (password.length < MIN_PASSWORD_LENGTH)
      next.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
    return next;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setFormErrors(errs); return; }
    setError(null);
    try {
      await register({ name: name.trim(), email: email.trim(), password });
      toast("Welcome to Belioras", "success");
    } catch (err) {
      setError(err?.message ?? "Registration failed. Please try again.");
    }
  };

  return (
    <div className="min-h-dvh grid lg:grid-cols-2">
      {/* Left: Form Panel */}
      <div className="flex flex-col items-center justify-center px-6 py-24 sm:px-12 lg:px-16 xl:px-24 bg-ivory-50 order-2 lg:order-1">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="w-full max-w-sm"
        >
          <div className="mb-10">
            <Link to="/" className="cursor-pointer">
              <img src="/belioras-logo.png" alt="Belioras" className="h-10 w-auto mb-8" />
            </Link>
            <h1 id="signup-title" className="font-display text-3xl text-espresso mb-2">
              Join the Maison
            </h1>
            <p className="text-sm text-espresso/60">
              Already a member?{" "}
              <Link to="/login" className="font-semibold text-gold-700 hover:text-espresso transition-colors cursor-pointer">
                Sign in
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate aria-labelledby="signup-title" className="space-y-8">
            <FloatingInput
              id="name"
              label="Full name"
              autoComplete="name"
              value={name}
              error={formErrors.name}
              onChange={(e) => { setName(e.target.value); setFormErrors((p) => ({ ...p, name: undefined })); }}
            />

            <FloatingInput
              id="email"
              label="Email address"
              type="email"
              autoComplete="email"
              value={email}
              error={formErrors.email}
              onChange={(e) => { setEmail(e.target.value); setFormErrors((p) => ({ ...p, email: undefined })); setError(null); }}
            />

            <FloatingInput
              id="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              value={password}
              error={formErrors.password}
              onChange={(e) => { setPassword(e.target.value); setFormErrors((p) => ({ ...p, password: undefined })); }}
              rightSlot={
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="text-espresso/40 hover:text-espresso transition-colors cursor-pointer"
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              }
            />

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl bg-rose-50 border border-rose-100 px-4 py-3 text-xs text-rose-700"
                role="alert"
              >
                {error}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-espresso text-ivory-50 py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-gold-700 hover:text-espresso transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <span className="inline-flex items-center gap-2 justify-center">
                  <Loader2 className="size-4 animate-spin" />
                  Creating account…
                </span>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <p className="mt-8 text-[10px] text-espresso/40 text-center leading-relaxed">
            By creating an account you agree to our{" "}
            <Link to="/terms" className="underline hover:text-gold-700 cursor-pointer">Terms of Service</Link>
            {" "}and{" "}
            <Link to="/privacy" className="underline hover:text-gold-700 cursor-pointer">Privacy Policy</Link>.
          </p>
        </motion.div>
      </div>

      {/* Right: Editorial Image Panel */}
      <div className="relative hidden lg:block order-1 lg:order-2">
        <img
          src={HERO_IMAGE}
          alt="Belioras collection"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-espresso/80 via-espresso/20 to-espresso/60" />
        <div className="absolute top-12 left-12 right-12 text-ivory-50">
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-gold-400 mb-4">
            Membership Benefits
          </p>
          <h2 className="font-display text-4xl xl:text-5xl leading-tight mb-8">
            Exclusively yours.
          </h2>
        </div>
        <div className="absolute bottom-12 left-12 right-12 text-ivory-50 space-y-4">
          {[
            "Early access to new collections",
            "Complimentary personal styling",
            "Priority shipping & returns",
            "Invitations to private events",
          ].map((benefit) => (
            <div key={benefit} className="flex items-center gap-3 text-sm text-ivory-50/80">
              <span className="size-1.5 rounded-full bg-gold-400 shrink-0" />
              {benefit}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

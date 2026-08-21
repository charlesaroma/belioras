import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Eye, EyeOff, Loader2 } from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

const HERO_IMAGE_LOGIN = "https://ik.imagekit.io/sbgenu6wj/Belioras/Home/model-belioras123.jpeg";
const HERO_IMAGE_SIGNUP = "https://ik.imagekit.io/sbgenu6wj/Belioras/Home/hero-image-belioras.PNG";
const MIN_PASSWORD_LENGTH = 6;

const inputBase =
  "w-full border-b border-umber-50 bg-transparent px-0 py-3 text-sm text-espresso placeholder:text-espresso/40 focus:border-espresso focus:outline-none transition-colors";

function FloatingInput({ id, label, type = "text", value, onChange, error, autoComplete, rightSlot }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="relative"
    >
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
    </motion.div>
  );
}

export default function AuthLayout({ initialMode = "login" }) {
  const { login, register, isAuthenticated, loading: submitting, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [mode, setMode] = useState(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Signup state
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");

  if (isAuthenticated) {
    const redirectPath = user?.role === "admin" ? "/dashboard" : "/account";
    navigate(redirectPath, { replace: true });
    return null;
  }

  const validateLogin = () => {
    const next = {};
    if (!loginEmail.trim()) next.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginEmail.trim())) next.email = "Enter a valid email.";
    if (!loginPassword) next.password = "Password is required.";
    return next;
  };

  const validateSignup = () => {
    const next = {};
    if (!signupName.trim()) next.name = "Full name is required.";
    if (!signupEmail.trim()) next.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signupEmail.trim())) next.email = "Enter a valid email.";
    if (!signupPassword) next.password = "Password is required.";
    else if (signupPassword.length < MIN_PASSWORD_LENGTH)
      next.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
    return next;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const errs = validateLogin();
    if (Object.keys(errs).length) { setFormErrors(errs); return; }
    setError(null);
    try {
      await login({ email: loginEmail.trim(), password: loginPassword });
      toast("Welcome back to Belioras", "success");
    } catch (err) {
      setError(err?.message ?? "Sign in failed. Please try again.");
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const errs = validateSignup();
    if (Object.keys(errs).length) { setFormErrors(errs); return; }
    setError(null);
    try {
      await register({ name: signupName.trim(), email: signupEmail.trim(), password: signupPassword });
      toast("Welcome to Belioras", "success");
    } catch (err) {
      setError(err?.message ?? "Registration failed. Please try again.");
    }
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setError(null);
    setFormErrors({});
  };

  const heroImage = mode === "login" ? HERO_IMAGE_LOGIN : HERO_IMAGE_SIGNUP;

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left: Editorial Image Panel */}
      <div className="relative hidden lg:block">
        <motion.img
          key={heroImage}
          src={heroImage}
          alt="Belioras fashion"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 h-full w-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-espresso/90 via-espresso/30 to-espresso/10" />
        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="absolute bottom-12 left-12 right-12 text-ivory-50"
          >
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-gold-400 mb-4">
              {mode === "login" ? "The Maison" : "Membership Benefits"}
            </p>
            <h2 className="font-display text-4xl xl:text-5xl leading-tight mb-4">
              {mode === "login" ? (
                <>Dressed in intention. <br /> Made to last.</>
              ) : (
                <>Exclusively yours.</>
              )}
            </h2>
            <p className="text-sm text-ivory-50/60 leading-relaxed max-w-sm">
              {mode === "login"
                ? "Sign in to access your curated wardrobe, exclusive member events, and complimentary styling services."
                : "Early access to new collections, complimentary personal styling, priority shipping & returns, and invitations to private events."}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Right: Form Panel */}
      <div className="flex flex-col items-center justify-center px-6 py-12 sm:py-16 sm:px-12 lg:px-16 xl:px-24 bg-ivory-50 min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="w-full max-w-sm"
        >
          <div className="mb-10 text-center lg:text-left">
            <Link to="/" className="cursor-pointer inline-block">
              <motion.img
                src="/belioras-logo.png"
                alt="Belioras"
                className="h-14 w-auto mb-6 mx-auto lg:mx-0"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              />
            </Link>
            <AnimatePresence mode="wait">
              <motion.h1
                key={mode}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="font-display text-3xl lg:text-4xl text-espresso mb-3"
              >
                {mode === "login" ? "Welcome back" : "Join the Maison"}
              </motion.h1>
            </AnimatePresence>
            <p className="text-sm text-espresso/60">
              {mode === "login" ? (
                <>
                  New to Belioras?{" "}
                  <button
                    type="button"
                    onClick={() => switchMode("signup")}
                    className="font-semibold text-gold-700 hover:text-espresso transition-colors cursor-pointer underline underline-offset-2"
                  >
                    Create an account
                  </button>
                </>
              ) : (
                <>
                  Already a member?{" "}
                  <button
                    type="button"
                    onClick={() => switchMode("login")}
                    className="font-semibold text-gold-700 hover:text-espresso transition-colors cursor-pointer underline underline-offset-2"
                  >
                    Sign in
                  </button>
                </>
              )}
            </p>
          </div>

          <AnimatePresence mode="wait">
            {mode === "login" ? (
              <motion.form
                key="login"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                onSubmit={handleLogin}
                noValidate
                className="space-y-6"
              >
                <FloatingInput
                  id="email"
                  label="Email address"
                  type="email"
                  autoComplete="email"
                  value={loginEmail}
                  error={formErrors.email}
                  onChange={(e) => {
                    setLoginEmail(e.target.value);
                    setFormErrors((p) => ({ ...p, email: undefined }));
                    setError(null);
                  }}
                />

                <FloatingInput
                  id="password"
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={loginPassword}
                  error={formErrors.password}
                  onChange={(e) => {
                    setLoginPassword(e.target.value);
                    setFormErrors((p) => ({ ...p, password: undefined }));
                    setError(null);
                  }}
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

                <div className="flex items-center justify-end">
                  <Link
                    to="/forgot-password"
                    className="text-xs text-espresso/50 hover:text-gold-700 transition-colors cursor-pointer"
                  >
                    Forgot password?
                  </Link>
                </div>

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
                  className="w-full bg-espresso text-ivory-50 py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-gold-700 hover:text-espresso transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-sm hover:shadow-md"
                >
                  {submitting ? (
                    <span className="inline-flex items-center gap-2 justify-center">
                      <Loader2 className="size-4 animate-spin" />
                      Signing in…
                    </span>
                  ) : (
                    "Sign In"
                  )}
                </button>
              </motion.form>
            ) : (
              <motion.form
                key="signup"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                onSubmit={handleSignup}
                noValidate
                className="space-y-6"
              >
                <FloatingInput
                  id="name"
                  label="Full name"
                  autoComplete="name"
                  value={signupName}
                  error={formErrors.name}
                  onChange={(e) => { setSignupName(e.target.value); setFormErrors((p) => ({ ...p, name: undefined })); }}
                />

                <FloatingInput
                  id="email"
                  label="Email address"
                  type="email"
                  autoComplete="email"
                  value={signupEmail}
                  error={formErrors.email}
                  onChange={(e) => { setSignupEmail(e.target.value); setFormErrors((p) => ({ ...p, email: undefined })); setError(null); }}
                />

                <FloatingInput
                  id="password"
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={signupPassword}
                  error={formErrors.password}
                  onChange={(e) => { setSignupPassword(e.target.value); setFormErrors((p) => ({ ...p, password: undefined })); }}
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
                  className="w-full bg-espresso text-ivory-50 py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-gold-700 hover:text-espresso transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-sm hover:shadow-md"
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
              </motion.form>
            )}
          </AnimatePresence>

          {mode === "signup" && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-8 text-[10px] text-espresso/40 text-center leading-relaxed"
            >
              By creating an account you agree to our{" "}
              <Link to="/terms-of-service" className="underline hover:text-gold-700 cursor-pointer">Terms of Service</Link>
              {" "}and{" "}
              <Link to="/privacy-policy" className="underline hover:text-gold-700 cursor-pointer">Privacy Policy</Link>.
            </motion.p>
          )}

          {mode === "login" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-8 border border-dashed border-umber-50 rounded-2xl p-4 text-xs text-espresso/60 leading-relaxed bg-ivory-100/50"
            >
              <p className="font-semibold text-espresso mb-2">Demo accounts</p>
              <p>Password: <span className="font-mono text-gold-700">demo123</span></p>
              <p className="mt-1"><span className="font-mono">mariana@belioras.com</span> — Customer</p>
              <p><span className="font-mono">admin@belioras.com</span> — Admin</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
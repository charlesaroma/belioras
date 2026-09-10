import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../../../../context/AuthContext";
import { useToast } from "../../../../context/ToastContext";
import { resolveLanding } from "../../../../utils/roles";
import { validateCredentials } from "../../../../utils/validateCredentials";
import CustomerAuthInput from "./CustomerAuthInput";
import CustomerAuthError from "./CustomerAuthError";
import CustomerAuthSubmit from "./CustomerAuthSubmit";
import PasswordToggle from "./PasswordToggle";

/** Email and password, for a returning shopper. */
export default function CustomerLoginForm() {
  const { login, loading: submitting } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  const clear = (field) => {
    setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    setError(null);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const errs = validateCredentials({ email, password });
    if (Object.keys(errs).length) {
      setFieldErrors(errs);
      return;
    }
    setError(null);
    try {
      // realm "customer": a staff account cannot be signed in here. The
      // rejection is identical to a wrong password, so this door cannot be
      // used to discover which addresses belong to staff.
      const result = await login({ email: email.trim(), password, realm: "customer" });
      toast("Welcome back to Belioras", "success");
      // resolveLanding honours the page they were trying to reach before being
      // asked to sign in. RequireAuth has always recorded it and nothing ever
      // read it, so a shopper following a link to one order was signed in and
      // then dumped on the account overview.
      navigate(resolveLanding(result?.user, location.state?.from), { replace: true });
    } catch (err) {
      setError(err?.message ?? "Sign in failed. Please try again.");
    }
  };

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6">
      <CustomerAuthInput
        id="email"
        label="Email address"
        type="email"
        autoComplete="email"
        value={email}
        error={fieldErrors.email}
        onChange={(e) => {
          setEmail(e.target.value);
          clear("email");
        }}
      />

      <CustomerAuthInput
        id="password"
        label="Password"
        type={showPassword ? "text" : "password"}
        autoComplete="current-password"
        value={password}
        error={fieldErrors.password}
        onChange={(e) => {
          setPassword(e.target.value);
          clear("password");
        }}
        rightSlot={
          <PasswordToggle shown={showPassword} onToggle={() => setShowPassword((v) => !v)} />
        }
      />

      <div className="flex items-center justify-end">
        <Link
          to="/forgot-password"
          className="text-xs text-espresso/50 transition-colors hover:text-gold-700"
        >
          Forgot password?
        </Link>
      </div>

      <CustomerAuthError message={error} />
      <CustomerAuthSubmit submitting={submitting} label="Sign In" busyLabel="Signing in…" />
    </form>
  );
}

/* Page: Auth - CustomerSignupForm */
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useCustomerAuth } from "@/context/auth/useAuthRealm";
import { useToast } from "../../../../context/ToastContext";
import { resolveLanding } from "../../../../utils/roles";
import { validateCredentials } from "../../../../utils/validateCredentials";
import CustomerAuthInput from "./CustomerAuthInput";
import CustomerAuthError from "./CustomerAuthError";
import CustomerAuthSubmit from "./CustomerAuthSubmit";
import PasswordToggle from "./PasswordToggle";

export default function CustomerSignupForm() {
  const { register, loading: submitting } = useCustomerAuth();
  const { toast } = useToast();

  const navigate = useNavigate();

  const location = useLocation();

  const [name, setName] = useState("");
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

    const errs = validateCredentials(
      { name, email, password },
      { requireName: true, enforceLength: true },
    );
    if (Object.keys(errs).length) {
      setFieldErrors(errs);
      return;
    }
    setError(null);
    try {

      const result = await register({ name: name.trim(), email: email.trim(), password });
      toast("Welcome to Belioras", "success");
      navigate(resolveLanding(result?.user, location.state?.from), { replace: true });
    } catch (err) {
      setError(err?.message ?? "Registration failed. Please try again.");
    }
  };

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6">
      <CustomerAuthInput
        id="name"
        label="Full name"
        autoComplete="name"
        value={name}
        error={fieldErrors.name}
        onChange={(e) => {
          setName(e.target.value);
          clear("name");
        }}
      />

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
        autoComplete="new-password"
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

      <CustomerAuthError message={error} />
      <CustomerAuthSubmit
        submitting={submitting}
        label="Create Account"
        busyLabel="Creating account…"
      />
    </form>
  );
}

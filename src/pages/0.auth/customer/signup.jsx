import { Navigate } from "react-router-dom";

import CustomerAuthShell from "./sections/CustomerAuthShell";
import CustomerSignupForm from "./sections/CustomerSignupForm";
import { SignupTerms } from "./sections/CustomerAuthNotes";
import { useRedirectIfSignedIn } from "./sections/useRedirectIfSignedIn";

/** The customer registration door. There is no staff equivalent by design. */
export default function SignupPage() {
  const redirectTo = useRedirectIfSignedIn();
  if (redirectTo) return <Navigate to={redirectTo} replace />;

  return (
    <CustomerAuthShell mode="signup" footer={<SignupTerms />}>
      <CustomerSignupForm />
    </CustomerAuthShell>
  );
}

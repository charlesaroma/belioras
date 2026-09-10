/* Page: Auth - signup */
import { Navigate } from "react-router-dom";

import CustomerAuthShell from "./sections/CustomerAuthShell";
import CustomerSignupForm from "./sections/CustomerSignupForm";
import { SignupTerms } from "./sections/CustomerAuthNotes";
import { useRedirectIfSignedIn } from "./sections/useRedirectIfSignedIn";

/* Signup Page */
export default function SignupPage() {

/* redirect To */
  const redirectTo = useRedirectIfSignedIn();
  if (redirectTo) return <Navigate to={redirectTo} replace />;

  return (
    <CustomerAuthShell mode="signup" footer={<SignupTerms />}>
      <CustomerSignupForm />
    </CustomerAuthShell>
  );
}

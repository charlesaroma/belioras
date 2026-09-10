/* Page: Auth - login */
import { Navigate } from "react-router-dom";

import CustomerAuthShell from "./sections/CustomerAuthShell";
import CustomerLoginForm from "./sections/CustomerLoginForm";
import { DemoAccountNote } from "./sections/CustomerAuthNotes";
import { useRedirectIfSignedIn } from "./sections/useRedirectIfSignedIn";

export default function LoginPage() {

  const redirectTo = useRedirectIfSignedIn();
  if (redirectTo) return <Navigate to={redirectTo} replace />;

  return (
    <CustomerAuthShell mode="login" footer={<DemoAccountNote />}>
      <CustomerLoginForm />
    </CustomerAuthShell>
  );
}

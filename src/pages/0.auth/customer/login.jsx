import { Navigate } from "react-router-dom";

import CustomerAuthShell from "./sections/CustomerAuthShell";
import CustomerLoginForm from "./sections/CustomerLoginForm";
import { DemoAccountNote } from "./sections/CustomerAuthNotes";
import { useRedirectIfSignedIn } from "./sections/useRedirectIfSignedIn";

/**
 * The customer sign-in door.
 *
 * Staff use /atelier, which is linked from nowhere public and lives in
 * ../admin. Both call the same login() and land the person by role — refusing
 * the "wrong" door would tell anyone probing which addresses belong to staff.
 */
export default function LoginPage() {
  const redirectTo = useRedirectIfSignedIn();
  if (redirectTo) return <Navigate to={redirectTo} replace />;

  return (
    <CustomerAuthShell mode="login" footer={<DemoAccountNote />}>
      <CustomerLoginForm />
    </CustomerAuthShell>
  );
}

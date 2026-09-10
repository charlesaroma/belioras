import ConfirmDialog from "../../../../components/ui/ConfirmDialog";
import { roleLabel } from "./constants";

/**
 * Confirms a role change, or the removal of atelier access.
 *
 * `pending` is `{ user, role }` or null; role "customer" means removal, which
 * is the destructive branch.
 */
export function RoleChangeDialog({ pending, onClose, onConfirm }) {
  const removing = pending?.role === "customer";

  return (
    <ConfirmDialog
      open={Boolean(pending)}
      onClose={onClose}
      onConfirm={onConfirm}
      destructive={removing}
      title={removing ? "Remove atelier access?" : "Change this role?"}
      description={
        removing
          ? "They keep their account and order history, but lose the dashboard entirely."
          : "Administrators can see and edit every order, customer and piece, and can change who else has access."
      }
      summary={
        pending && (
          <span>
            <strong className="font-medium">{pending.user.name}</strong>
            {removing ? " becomes a customer again" : ` becomes ${roleLabel(pending.role)}`}
          </span>
        )
      }
      confirmLabel={removing ? "Remove access" : "Change role"}
    />
  );
}

/**
 * Adds an existing account to the team by email.
 *
 * There is no create-account action anywhere on this page: an administrator
 * making an account for someone means choosing their password for them.
 */
export function AddMemberDialog({ open, email, onEmailChange, onClose, onConfirm }) {
  return (
    <ConfirmDialog
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      destructive={false}
      title="Add someone to the team"
      description="They must already have a Belioras account. Enter the email they registered with; they join as Staff and can be promoted afterwards."
      summary={
        <input
          type="email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          placeholder="name@example.com"
          aria-label="Email of the account to add"
          className="input w-full"
        />
      }
      confirmLabel="Add as staff"
    />
  );
}

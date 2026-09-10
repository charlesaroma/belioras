import { Eye, EyeOff } from "lucide-react";

/** Reveal control that sits inside the password field. */
export default function PasswordToggle({ shown, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="text-espresso/40 transition-colors hover:text-espresso"
      // Not a tab stop: it is a convenience, and it sits between the password
      // field and the submit button in the natural tab order.
      tabIndex={-1}
      aria-label={shown ? "Hide password" : "Show password"}
    >
      {shown ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
    </button>
  );
}

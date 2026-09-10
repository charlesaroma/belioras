/* MIN PASSWORD LENGTH */
export const MIN_PASSWORD_LENGTH = 6;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Credential validation, shared by both doors.
 *
 * Lifted out of AuthLayout so the staff entrance holds the same rules without
 * a second copy drifting from the first. `requireName` and `enforceLength`
 * only apply to registration, which exists on the customer door alone.
 */

export function validateCredentials(
  { name, email, password },
  { requireName = false, enforceLength = false } = {},
) {

  const errors = {};

  if (requireName && !name?.trim()) errors.name = "Full name is required.";

  if (!email?.trim()) errors.email = "Email is required.";
  else if (!EMAIL.test(email.trim())) errors.email = "Enter a valid email.";

  if (!password) errors.password = "Password is required.";
  else if (enforceLength && password.length < MIN_PASSWORD_LENGTH) {
    errors.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
  }

  return errors;
}

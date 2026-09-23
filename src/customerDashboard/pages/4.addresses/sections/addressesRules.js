/* EMPTY FORM */
export const EMPTY_FORM = { recipient: "", line1: "", city: "", postcode: "", country: "" };

/**
 * No seed.
 *
 * This used to start every account with a hardcoded Lisbon address for a
 * fictional "Mariana Silva", so a customer who had never added one opened the
 * page to a stranger's delivery details — and, worse, could have checked out
 * against them.
 */

/* NO ADDRESSES */
export const NO_ADDRESSES = [];

/** Every field is required: a partial address cannot be delivered to. */
export function validateAddress(form) {

  const errors = {};
  if (!form.recipient.trim()) errors.recipient = "Recipient name is required.";
  if (!form.line1.trim()) errors.line1 = "Street address is required.";
  if (!form.city.trim()) errors.city = "City is required.";
  if (!form.postcode.trim()) errors.postcode = "Postcode is required.";
  if (!form.country.trim()) errors.country = "Country is required.";
  return errors;
}

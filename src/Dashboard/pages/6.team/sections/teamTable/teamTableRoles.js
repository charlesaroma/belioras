/** The only roles this page may assign. Customers are promoted by email, not
 *  by scrolling past someone and changing a dropdown. */
export const STAFF_ROLES = [
  { value: "staff", label: "Staff" },
  { value: "super-admin", label: "Administrator" },
];

export const ROLE_TONE = {
  "super-admin": "bg-gold-500/15 text-gold-800",
  staff: "bg-brown-50 text-brown-700",
};

export const roleLabel = (value) => STAFF_ROLES.find((r) => r.value === value)?.label;

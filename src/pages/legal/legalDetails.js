/**
 * Who Belioras is, for every legal page, in one place so the pages cannot
 * disagree. The contact details the storefront shows elsewhere come from
 * settings (dashboard › Settings) and should match these.
 */

export const BUSINESS = {
  name: "Belioras – Online Boutique",
  owner: "Belindah Ongessa",
  address: ["c/o flexdienst – #12271", "Kurt-Schumacher-Straße 76", "67663 Kaiserslautern", "Germany"],
  support: "support@belioras.com",
  privacy: "info@belioras.com",
  site: "belioras.com",
};

/** The data protection authority for Kaiserslautern, in Rhineland-Palatinate. */
export const AUTHORITY = {
  name: "Der Landesbeauftragte für den Datenschutz und die Informationsfreiheit Rheinland-Pfalz",
  url: "https://www.datenschutz.rlp.de",
};

export const UPDATED = "Last updated 22 September 2026";

export const PAYMENT_METHODS = ["PayPal", "Credit and debit cards", "Klarna (pay later, instant bank transfer, instalments)", "Apple Pay and Google Pay"];

/** Rates and timings, as checkout charges them (settings › shipping zones). */
export const SHIPPING_ZONES = [
  { zone: "Germany", cost: "Free", free: "Always", time: "5–14 business days" },
  { zone: "European Union", cost: "From €9.99", free: "Over €250", time: "5–14 business days" },
  { zone: "International", cost: "From €14.99", free: "—", time: "7–21 business days" },
  { zone: "Pre-order pieces", cost: "Standard rate", free: "As above", time: "15–28 business days" },
];

/**
 * The two translations between settings.json and this page's flat form.
 *
 * Kept as pure functions so the shape of the stored document lives in one
 * readable place instead of being spread across a reset() call and a submit
 * handler at opposite ends of the file.
 */

/** settings.json -> flat form values. */
export function toFormValues(settings) {
  return {
    contactGeneral: settings.contact?.general ?? "",
    contactSupport: settings.contact?.support ?? "",
    contactPhone: settings.contact?.phone ?? "",
    contactHours: settings.contact?.hours ?? "",
    contactBoutique: settings.contact?.boutique ?? "",
    announcementText: settings.announcement?.text ?? "",
    announcementLink: settings.announcement?.link ?? "",
    cookieText: settings.cookieBanner?.text ?? "",
    gpsrManufacturer: settings.gpsr?.manufacturer ?? "",
    gpsrAddress: settings.gpsr?.address ?? "",
    gpsrEmail: settings.gpsr?.email ?? "",
    // Stored as a fraction, edited as a percentage.
    taxRate: (settings.tax?.rate ?? 0) * 100,
    instagram: settings.social?.instagram ?? "",
    pinterest: settings.social?.pinterest ?? "",
    tiktok: settings.social?.tiktok ?? "",
  };
}

/** Flat form values (+ the separately-held zones) -> settings.json. */
export function toSettingsPayload(values, zones) {
  return {
    contact: {
      general: values.contactGeneral.trim(),
      support: values.contactSupport.trim(),
      phone: values.contactPhone.trim(),
      hours: values.contactHours.trim(),
      boutique: values.contactBoutique.trim(),
    },
    announcement: { text: values.announcementText, link: values.announcementLink },
    cookieBanner: { text: values.cookieText },
    gpsr: {
      manufacturer: values.gpsrManufacturer,
      address: values.gpsrAddress,
      email: values.gpsrEmail.trim(),
    },
    tax: { rate: Number(values.taxRate) / 100 },
    social: {
      instagram: values.instagram,
      pinterest: values.pinterest,
      tiktok: values.tiktok,
    },
    shipping: { zones },
  };
}

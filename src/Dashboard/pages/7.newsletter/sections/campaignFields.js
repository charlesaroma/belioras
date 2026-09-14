/* Campaign Form Helpers */

export const EMPTY_CAMPAIGN = {
  subject: "",
  previewText: "",
  heading: "",
  body: "",
  productIds: [],
  cta: { label: "Discover the collection", url: "/new-arrivals" },
};

export function fromCampaign(c) {
  return {
    subject: c.subject ?? "",
    previewText: c.previewText ?? "",
    heading: c.heading ?? "",
    body: c.body ?? "",
    productIds: c.productIds ?? [],
    cta: { label: c.cta?.label ?? "", url: c.cta?.url ?? "/shop" },
  };
}

/** An ISO date as the value a datetime-local input expects, in local time. */
export function toLocalInput(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** Every page in the menu, as the places a campaign's button can lead. */
export function pagesFrom(navigation) {
  const name = (label) => label.charAt(0) + label.slice(1).toLowerCase();
  return (navigation ?? []).flatMap((root) => [
    { url: root.url, label: name(root.label) },
    ...(root.sections ?? []).flatMap((section) =>
      section.items.map((item) => ({ url: item.url, label: `${name(root.label)} › ${item.label}` })),
    ),
  ]);
}

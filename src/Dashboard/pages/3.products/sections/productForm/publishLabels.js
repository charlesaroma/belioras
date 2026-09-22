/** The status line and the two actions, which depend on whether the piece is live. */
export function publishLabels(isEdit, status) {
  const live = isEdit && status === "active";
  return {
    live,
    state: !isEdit ? "Not saved yet" : live ? "Live in the shop" : "Draft, hidden from the shop",
    primary: live ? "Save changes" : "Publish",
    secondary: live ? "Unpublish" : "Save draft",
  };
}

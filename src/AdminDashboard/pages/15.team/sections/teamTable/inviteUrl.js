/** The address an invited person opens to choose their password. */
export function inviteUrl(token) {
  return `${window.location.origin}/atelier/invite?token=${token}`;
}

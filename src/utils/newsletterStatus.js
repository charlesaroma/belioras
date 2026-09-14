/* Newsletter Status Labels */

/** Only `subscribed` people are ever sent campaigns. */
export const SUBSCRIBER_STATUS = {
  subscribed: { label: "Subscribed", tone: "positive" },
  pending: { label: "Awaiting confirmation", tone: "pending" },
  unsubscribed: { label: "Unsubscribed", tone: "neutral" },
  bounced: { label: "Bounced", tone: "negative" },
};

export const CAMPAIGN_STATUS = {
  draft: { label: "Draft", tone: "neutral" },
  scheduled: { label: "Scheduled", tone: "pending" },
  sent: { label: "Sent", tone: "positive" },
};

export const SIGNUP_SOURCES = {
  footer: "Footer sign-up",
  account: "Account settings",
  checkout: "Checkout",
  resubscribe: "Signed up again",
};

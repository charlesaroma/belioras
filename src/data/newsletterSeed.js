import subscribers from "./subscribers.json";
import campaigns from "./campaigns.json";
import newsletter from "./newsletter.json";

/**
 * The Belioras Letter, as sample data: who has consented, what has been sent,
 * and the welcome email.
 *
 * Each subscriber keeps a consent record (when, from where, to what wording),
 * which is what GDPR asks a shop to be able to show. Tokens stand in for the
 * links in confirmation and unsubscribe emails.
 */
export const subscribersSeed = { rev: 1, items: subscribers };

export const campaignsSeed = { rev: 1, items: campaigns };

export const newsletterSettingsSeed = newsletter;

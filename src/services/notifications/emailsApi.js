/* Email Outbox */
import { mockApi } from "@/api/mock";
import { getState, setState } from "../store/contentStore";

/**
 * Every email Belioras sends, in one place.
 *
 * Nothing is delivered from the browser. Each flow queues its message here —
 * the type, the recipient and the facts the template needs — and the backend's
 * `notifications` module will send exactly these, from a Belioras address,
 * through an email service (Postmark, Resend, SES…). Until then the outbox is
 * the record of what would have gone, and the dashboard shows it.
 *
 * The server sends; the payment provider does not. Stripe's own receipt is
 * switched off so a customer gets one Belioras email, not two.
 */
/** False until the backend's mailer is connected; the dashboard says so while it is. */
export const EMAIL_CONNECTED = false;

export const EMAIL_TYPES = {
  "order-confirmation": { label: "Order confirmation", audience: "Customer", when: "Payment succeeded (payment provider webhook). Includes the invoice." },
  "payment-failed": { label: "Payment failed", audience: "Customer", when: "The payment provider reports a failed or expired payment." },
  "order-shipped": { label: "Order shipped", audience: "Customer", when: "Staff mark an order shipped. Includes the carrier and tracking." },
  "order-delivered": { label: "Order delivered", audience: "Customer", when: "The order is marked delivered. Invites a review." },
  "order-cancelled": { label: "Order cancelled", audience: "Customer", when: "An order is cancelled, by the customer or by staff." },
  refund: { label: "Refund", audience: "Customer", when: "A refund is made. Includes the credit note." },
  welcome: { label: "Welcome", audience: "Customer", when: "A customer creates an account." },
  "password-reset": { label: "Password reset", audience: "Customer or staff", when: "Someone asks to reset their password." },
  "team-invitation": { label: "Team invitation", audience: "Staff", when: "An administrator invites someone to the team." },
  "newsletter-confirm": { label: "Confirm your subscription", audience: "Subscriber", when: "Someone signs up to the Letter (double opt-in)." },
  "newsletter-welcome": { label: "Newsletter welcome", audience: "Subscriber", when: "A subscription is confirmed. Carries the welcome code." },
  campaign: { label: "Newsletter campaign", audience: "Subscribers", when: "A campaign is sent." },
  "contact-received": { label: "Contact message", audience: "Client care", when: "A shopper writes through the contact form." },
};

/**
 * Queues one email. `data` holds what the template needs (order id, tracking,
 * amounts, a link token). Never throws: an email that cannot be queued must
 * not undo the action it reports.
 */
export function queueEmail({ type, to, subject, orderId = null, data = {} }) {
  try {
    const email = {
      id: `em_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
      type,
      to,
      subject,
      orderId,
      data,
      createdAt: new Date().toISOString(),
      status: "queued",
    };
    setState("emails", (state) => ({ ...state, items: [email, ...state.items].slice(0, 2000) }));
    return email;
  } catch {
    return null;
  }
}

/** Newest first. */
export function getEmails() {
  return mockApi(() => getState("emails").items.map((e) => ({ ...e })), 0);
}

/** One order's emails, oldest first — for the order's own timeline. */
export function emailsForOrder(orderId) {
  return getState("emails").items.filter((e) => e.orderId === orderId).slice().reverse();
}

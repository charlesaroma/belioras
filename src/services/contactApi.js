import { ApiError, mockApi } from "./apiClient";

/**
 * Contact form submission.
 *
 * A seam, not an implementation. The contact page previously called
 * setStatus("success") after a one-second timer and told the shopper their
 * message had been received — while nothing was sent anywhere and no record
 * of it existed. That is worse than a form that visibly fails: someone with a
 * genuine problem waits for a reply that is never coming.
 *
 * Until the backend `notifications` module exists, this resolves as `queued`
 * and the UI says plainly that the message is held locally and gives the
 * mailbox to write to directly. Messages are kept in localStorage so nothing
 * a shopper typed is silently thrown away.
 */

/* STORAGE KEY */
const STORAGE_KEY = "belioras:contact:outbox";

function readOutbox() {
  try {

    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function sendMessage(payload) {
  return mockApi(() => {
    const { name, email, subject, message } = payload ?? {};
    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      throw new ApiError("Please complete every required field.", 422);
    }

    const entry = {
      id: `msg_${Date.now()}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject ?? "General",
      message: message.trim(),
      receivedAt: new Date().toISOString(),
    };

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify([entry, ...readOutbox()]));
    } catch {
      // Storage full or unavailable — the caller is still told the truth
      // below about delivery not being wired up.
    }

    return { status: "queued", entry };
  }, 600);
}

/** Everything held locally, for a future dashboard inbox. */
export function getMessages() {
  return mockApi(() => readOutbox());
}

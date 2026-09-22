/* Subscriber List Helpers */

const DAY = 24 * 60 * 60 * 1000;

export function subscriberStats(rows) {
  const by = (status) => rows.filter((r) => r.status === status).length;
  const since = Date.now() - 30 * DAY;
  return {
    subscribed: by("subscribed"),
    pending: by("pending"),
    unsubscribed: by("unsubscribed"),
    recent: rows.filter((r) => r.status === "subscribed" && Date.parse(r.confirmedAt ?? "") >= since).length,
  };
}

/** Status tabs, counted over the whole list. */
export function statusTabs(rows) {
  const by = (status) => rows.filter((r) => r.status === status).length;
  return [
    { value: "all", label: "All", count: rows.length },
    { value: "subscribed", label: "Subscribed", count: by("subscribed") },
    { value: "pending", label: "Awaiting confirmation", count: by("pending") },
    { value: "unsubscribed", label: "Unsubscribed", count: by("unsubscribed") },
    { value: "bounced", label: "Bounced", count: by("bounced") },
  ];
}

const CSV_COLUMNS = [
  ["email", "Email"],
  ["name", "Name"],
  ["status", "Status"],
  ["source", "Signed up from"],
  ["consentedAt", "Consent given"],
  ["confirmedAt", "Confirmed"],
];

/**
 * A spreadsheet-safe CSV. A value starting with = + - or @ is prefixed with an
 * apostrophe, so a crafted address cannot run as a formula when opened.
 */
export function subscribersCsv(rows) {
  const cell = (value) => {
    let s = String(value ?? "");
    if (/^[=+\-@]/.test(s)) s = `'${s}`;
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [
    CSV_COLUMNS.map(([, header]) => header).join(","),
    ...rows.map((row) => CSV_COLUMNS.map(([key]) => cell(row[key])).join(",")),
  ].join("\n");
}

export function downloadCsv(text, filename) {
  const url = URL.createObjectURL(new Blob([text], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

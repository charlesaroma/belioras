/**
 * Spreadsheet exports for any dashboard list.
 *
 * A text value starting with = + - or @ is prefixed with an apostrophe, so a
 * crafted name cannot run as a formula when the file is opened. Numbers are
 * written as they are, so a -3 stays a number.
 */

/** `columns` is `[[key, header], …]`; a key may also be a function of the row. */
export function toCsv(columns, rows) {
  const cell = (value) => {
    if (typeof value === "number") return Number.isFinite(value) ? String(value) : "";
    let s = String(value ?? "");
    if (/^[=+\-@]/.test(s)) s = `'${s}`;
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const read = (row, key) => (typeof key === "function" ? key(row) : row[key]);
  return [
    columns.map(([, header]) => cell(header)).join(","),
    ...rows.map((row) => columns.map(([key]) => cell(read(row, key))).join(",")),
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

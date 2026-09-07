import languagesData from "../data/languages.json";

export const DEFAULT_LANGUAGE = "en";

/** Walks a dot-path ("home.hero.title") without throwing on a missing branch. */
function resolvePath(obj, path) {
  return path
    .split(".")
    .reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : undefined), obj);
}

/** Substitutes {name} placeholders. Keeps unmatched braces so gaps are visible. */
function interpolate(template, values) {
  if (!values) return template;
  return template.replace(/\{(\w+)\}/g, (match, key) =>
    values[key] === undefined ? match : String(values[key]),
  );
}

const warned = new Set();

function warnOnce(key, lang) {
  if (!import.meta.env.DEV) return;
  const id = `${lang}:${key}`;
  if (warned.has(id)) return;
  warned.add(id);
  console.warn(`[i18n] missing translation for "${key}" (${lang})`);
}

/**
 * Translates a dot-path key.
 *
 * `defaultText` is what makes incremental migration workable: a section can be
 * wrapped in t() with its existing English copy as the default and still render
 * correctly before the key exists in languages.json. Without it, half-migrated
 * screens show raw dot-paths to the user.
 *
 * Resolution order: requested language → English → defaultText → the key.
 */
export function t(key, defaultText, lang = DEFAULT_LANGUAGE, values) {
  const strings = languagesData.strings;
  const localized = resolvePath(strings[lang], key);

  if (typeof localized === "string") return interpolate(localized, values);

  const english = resolvePath(strings[DEFAULT_LANGUAGE], key);
  if (typeof english === "string") {
    if (lang !== DEFAULT_LANGUAGE) warnOnce(key, lang);
    return interpolate(english, values);
  }

  warnOnce(key, lang);
  return interpolate(defaultText ?? key, values);
}

/** The locales offered in the header selector. */
export function locales() {
  return languagesData.locales;
}

export function isSupportedLanguage(code) {
  return languagesData.locales.some((locale) => locale.code === code);
}

/* Customer Dashboard Page: Settings - SettingsPreferencesPanel */
import Field from "../../../../components/ui/Field";

export default function PreferencesPanel({
  language,
  locales,
  onLanguageChange,
  currency,
  currencies,
  onCurrencyChange,
}) {
  return (
    <section className="border border-umber-50 bg-ivory-50 p-6">
      <h2 className="font-display text-xl tracking-wide text-espresso">Preferences</h2>
      <p className="mt-1 text-[12px] leading-relaxed text-espresso-soft">
        Saved to your account, so they follow you to another device.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Field label="Language">
          <select value={language} onChange={(e) => onLanguageChange(e.target.value)}>
            {locales.map((l) => (
              <option key={l.code} value={l.code}>
                {l.label}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Currency" helper="Prices are held in euros and converted for display.">
          <select value={currency} onChange={(e) => onCurrencyChange(e.target.value)}>
            {currencies.map((code) => (
              <option key={code} value={code}>
                {code}
              </option>
            ))}
          </select>
        </Field>
      </div>
    </section>
  );
}

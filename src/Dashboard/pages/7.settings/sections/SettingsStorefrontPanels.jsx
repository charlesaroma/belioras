import Field from "../../../../components/ui/Field";
import Panel from "./SettingsPanel";

/** Announcement bar, cookie notice and VAT — the three things a shopper sees. */
export default function StorefrontPanels({ register, errors }) {
  return (
    <div className="space-y-5">
      <Panel title="Announcement bar" hint="Shown across the top of every page.">
        <Field label="Message">
          <input {...register("announcementText")} />
        </Field>
        <Field label="Links to">
          <input {...register("announcementLink")} placeholder="/shop" />
        </Field>
      </Panel>

      <Panel title="Cookie notice" hint="Required under EU ePrivacy rules.">
        <Field label="Notice text">
          <textarea rows={3} {...register("cookieText")} className="resize-y" />
        </Field>
      </Panel>

      <Panel title="Tax">
        <Field
          label="VAT rate (%)"
          helper="Portuguese standard rate is 23%. Prices are shown inclusive."
          error={errors.taxRate?.message}
        >
          <input
            type="number"
            min="0"
            max="100"
            step="0.1"
            {...register("taxRate", {
              min: { value: 0, message: "Rate cannot be negative." },
              max: { value: 100, message: "Rate cannot exceed 100%." },
            })}
          />
        </Field>
      </Panel>
    </div>
  );
}

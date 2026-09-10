/* Admin Dashboard Page: Settings - SettingsContactPanel */
import Field from "../../../../components/ui/Field";
import Panel from "./SettingsPanel";

export default function ContactPanel({ register, errors }) {
  return (
    <Panel
      title="Contact"
      hint="Belioras operates two mailboxes. These are used across the legal pages, the client-care pages and the contact form, so changing one here changes it everywhere."
    >
      <Field
        label="General enquiries"
        required
        error={errors.contactGeneral?.message}
        helper="Press, privacy and GDPR requests, GPSR compliance, legal."
      >
        <input
          type="email"
          {...register("contactGeneral", { required: "A general address is required." })}
        />
      </Field>

      <Field
        label="Client care"
        required
        error={errors.contactSupport?.message}
        helper="Orders, tracking, returns, shipping and sizing."
      >
        <input
          type="email"
          {...register("contactSupport", { required: "A support address is required." })}
        />
      </Field>

      <Field label="Telephone">
        <input {...register("contactPhone")} />
      </Field>

      <Field label="Opening hours">
        <input {...register("contactHours")} />
      </Field>

      <Field label="Boutique address">
        <input {...register("contactBoutique")} />
      </Field>
    </Panel>
  );
}

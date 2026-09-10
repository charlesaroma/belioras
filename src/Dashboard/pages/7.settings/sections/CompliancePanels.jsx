import Field from "../../../../components/ui/Field";
import Panel from "./Panel";

/** GPSR responsible person, and the social accounts the footer links to. */
export default function CompliancePanels({ register, errors }) {
  return (
    <div className="space-y-5">
      <Panel
        title="Product safety (GPSR)"
        hint="EU General Product Safety Regulation requires a reachable responsible person."
      >
        <Field label="Manufacturer">
          <input {...register("gpsrManufacturer")} />
        </Field>
        <Field label="Registered address">
          <input {...register("gpsrAddress")} />
        </Field>
        <Field label="Compliance email" error={errors.gpsrEmail?.message}>
          <input type="email" {...register("gpsrEmail")} />
        </Field>
      </Panel>

      <Panel title="Social">
        <Field label="Instagram">
          <input {...register("instagram")} />
        </Field>
        <Field label="Pinterest">
          <input {...register("pinterest")} />
        </Field>
        <Field label="TikTok">
          <input {...register("tiktok")} />
        </Field>
      </Panel>
    </div>
  );
}

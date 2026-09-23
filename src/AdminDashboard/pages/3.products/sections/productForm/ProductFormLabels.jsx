/* Admin Dashboard Page: Products - ProductFormLabels */
import Toggle from "@/AdminDashboard/components/Toggle";
import FormSection from "./ProductFormSection";

export default function ProductFormLabels({ values, setValue }) {
  return (
    <FormSection title="Labels">
      <Toggle
        checked={Boolean(values.isNew)}
        onChange={(on) => setValue("isNew", on, { shouldDirty: true })}
        label="New arrival"
        description="Carries the New badge and appears in New Arrivals: on the home page and in the menu."
      />
      <div className="border-t border-umber-50" />
      <Toggle
        checked={Boolean(values.featured)}
        onChange={(on) => setValue("featured", on, { shouldDirty: true })}
        label="Featured"
        description="Appears under Featured Collections in the New Arrivals menu."
      />
    </FormSection>
  );
}

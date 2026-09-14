/* Admin Dashboard Page: Settings - settings */
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Check } from "lucide-react";

import Button from "../../../components/ui/Button";
import { useToast } from "../../../context/ToastContext";
import { useAsyncData } from "../../../hooks/useAsyncData";
import { getSettings, updateSettings } from "../../../services/settingsApi";
import ContactPanel from "./sections/SettingsContactPanel";
import StorefrontPanels from "./sections/SettingsStorefrontPanels";
import ShippingZonesPanel from "./sections/SettingsShippingZonesPanel";
import CompliancePanels from "./sections/SettingsCompliancePanels";
import { toFormValues, toSettingsPayload } from "./sections/settingsForm";

export default function DashSettings() {
  const { toast } = useToast();
  const { data: settings, loading } = useAsyncData(getSettings, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  /* Side Effect */
  useEffect(() => {
    if (settings) reset(toFormValues(settings));
  }, [settings, reset]);

  const [zoneEdits, setZones] = useState(null);

  const zones = zoneEdits ?? settings?.shipping?.zones ?? [];

  const onSubmit = async (values) => {
    try {
      await updateSettings(toSettingsPayload(values, zones));
      toast("Settings saved.", "success");
    } catch (err) {
      toast(err.message ?? "Could not save those settings.", "error");
    }
  };

  if (loading) {
    return (
      <div className="space-y-4" aria-hidden="true">
        <div className="skeleton h-40 w-full" />
        <div className="skeleton h-40 w-full" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 pb-24">
      <div className="flex justify-end">
        <Button type="submit" icon={Check} loading={isSubmitting}>
          Save changes
        </Button>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <ContactPanel register={register} errors={errors} />
        <StorefrontPanels register={register} errors={errors} />
        <ShippingZonesPanel zones={zones} onChange={setZones} />
        <CompliancePanels register={register} errors={errors} />
      </div>
    </form>
  );
}

/* Admin Dashboard Page: Settings - settings */
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Check } from "lucide-react";

import Button from "../../../components/ui/Button";
import { useToast } from "../../../context/ToastContext";
import { useAsyncData } from "../../../hooks/useAsyncData";
import { getSettings, updateSettings } from "../../../services/content/settingsApi";
import ContactPanel from "./sections/SettingsContactPanel";
import StorefrontPanels from "./sections/SettingsStorefrontPanels";
import CompliancePanels from "./sections/SettingsCompliancePanels";
import { toFormValues, toSettingsPayload } from "./sections/settingsForm";

export default function DashSettings() {
  const { toast } = useToast();
  const { data: settings, loading } = useAsyncData(getSettings, []);

  const {
    register,
    setValue,
    watch,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  /* Side Effect */
  useEffect(() => {
    if (settings) reset(toFormValues(settings));
  }, [settings, reset]);

  const onSubmit = async (values) => {
    try {
      await updateSettings(toSettingsPayload(values));
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
        <ContactPanel register={register} setValue={setValue} watch={watch} errors={errors} />
        <StorefrontPanels register={register} errors={errors} />
        <CompliancePanels register={register} errors={errors} />
      </div>
    </form>
  );
}

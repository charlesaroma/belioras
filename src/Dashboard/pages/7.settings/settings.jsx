import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Check } from "lucide-react";

import Button from "../../../components/ui/Button";
import { useToast } from "../../../context/ToastContext";
import { useAsyncData } from "../../../hooks/useAsyncData";
import { getSettings, updateSettings } from "../../../services/settingsApi";
import ContactPanel from "./sections/ContactPanel";
import StorefrontPanels from "./sections/StorefrontPanels";
import ShippingZonesPanel from "./sections/ShippingZonesPanel";
import CompliancePanels from "./sections/CompliancePanels";
import { toFormValues, toSettingsPayload } from "./sections/settingsForm";

/**
 * Store settings.
 *
 * Was entirely inert: three uncontrolled defaultValue inputs, three toggles
 * that were <button>s with hardcoded knob positions and no onClick — they
 * physically could not be switched — and a Save Changes button with no
 * handler. Its currency select also defaulted to USD in a Lisbon euro store.
 *
 * Everything here is bound to settings.json through the content store, so a
 * change reaches the storefront: the announcement bar, the cookie notice, the
 * shipping thresholds shown at checkout, and the contact addresses used across
 * the legal and client-care pages.
 *
 * This file owns the form and the save; each group of fields is a panel in
 * sections/, and the mapping to and from settings.json is in settingsForm.js.
 */
export default function DashSettings() {
  const { toast } = useToast();
  const { data: settings, loading } = useAsyncData(getSettings, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  useEffect(() => {
    if (settings) reset(toFormValues(settings));
  }, [settings, reset]);

  /**
   * Zones are edited as local state, not through react-hook-form.
   *
   * Derived during render rather than copied in an effect: null means "not
   * edited yet, show what loaded", which avoids a setState-in-effect and the
   * frame of empty rows it would cause before the copy landed.
   */
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

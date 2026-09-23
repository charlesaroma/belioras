/* Admin Dashboard Page: Shipping - shipping */
import { useState } from "react";
import { Check } from "lucide-react";

import Button from "../../../components/ui/Button";
import { useToast } from "../../../context/ToastContext";
import { useAsyncData } from "../../../hooks/useAsyncData";
import { getSettings, updateSettings } from "../../../services/content/settingsApi";
import ShippingZonesPanel from "./sections/ShippingZonesPanel";

/**
 * Its own page rather than a panel inside Settings: shipping is where the
 * real operational complexity of running the shop lives — zones today,
 * carriers and methods to come. Room to grow that Settings' single flat
 * form never had.
 */
export default function DashShipping() {
  const { toast } = useToast();
  const { data: settings, loading } = useAsyncData(getSettings, []);

  const [zoneEdits, setZoneEdits] = useState(null);
  const zones = zoneEdits ?? settings?.shipping?.zones ?? [];

  const [saving, setSaving] = useState(false);

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // updateSettings merges section by section, so this never touches
      // contact, tax, compliance or anything else Settings owns.
      await updateSettings({ shipping: { zones } });
      toast("Shipping zones saved.", "success");
    } catch (err) {
      toast(err.message ?? "Could not save those zones.", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4" aria-hidden="true">
        <div className="skeleton h-64 w-full" />
      </div>
    );
  }

  return (
    <form onSubmit={save} className="space-y-5 pb-24">
      <div className="flex justify-end">
        <Button type="submit" icon={Check} loading={saving}>
          Save changes
        </Button>
      </div>

      <ShippingZonesPanel zones={zones} onChange={setZoneEdits} />
    </form>
  );
}

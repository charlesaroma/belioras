import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Check } from "lucide-react";

import Button from "../../../components/ui/Button";
import Field from "../../../components/ui/Field";
import { useToast } from "../../../context/ToastContext";
import { useAsyncData } from "../../../hooks/useAsyncData";
import { getSettings, updateSettings } from "../../../services/settingsApi";

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
    if (!settings) return;
    reset({
      contactGeneral: settings.contact?.general ?? "",
      contactSupport: settings.contact?.support ?? "",
      contactPhone: settings.contact?.phone ?? "",
      contactHours: settings.contact?.hours ?? "",
      contactBoutique: settings.contact?.boutique ?? "",
      announcementText: settings.announcement?.text ?? "",
      announcementLink: settings.announcement?.link ?? "",
      cookieText: settings.cookieBanner?.text ?? "",
      gpsrManufacturer: settings.gpsr?.manufacturer ?? "",
      gpsrAddress: settings.gpsr?.address ?? "",
      gpsrEmail: settings.gpsr?.email ?? "",
      taxRate: (settings.tax?.rate ?? 0) * 100,
      instagram: settings.social?.instagram ?? "",
      pinterest: settings.social?.pinterest ?? "",
      tiktok: settings.social?.tiktok ?? "",
    });
  }, [settings, reset]);

  /**
   * Shipping zones are an array of objects, which react-hook-form handles
   * awkwardly, so they are edited as local state.
   *
   * Derived during render rather than copied in an effect: null means "not
   * edited yet, show what loaded", which avoids a setState-in-effect and the
   * frame of empty rows it would cause before the copy landed.
   */
  const [zoneEdits, setZones] = useState(null);
  const zones = zoneEdits ?? settings?.shipping?.zones ?? [];

  const onSubmit = async (values) => {
    try {
      await updateSettings({
        contact: {
          general: values.contactGeneral.trim(),
          support: values.contactSupport.trim(),
          phone: values.contactPhone.trim(),
          hours: values.contactHours.trim(),
          boutique: values.contactBoutique.trim(),
        },
        announcement: { text: values.announcementText, link: values.announcementLink },
        cookieBanner: { text: values.cookieText },
        gpsr: {
          manufacturer: values.gpsrManufacturer,
          address: values.gpsrAddress,
          email: values.gpsrEmail.trim(),
        },
        tax: { rate: Number(values.taxRate) / 100 },
        social: {
          instagram: values.instagram,
          pinterest: values.pinterest,
          tiktok: values.tiktok,
        },
        shipping: { zones },
      });
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

        <Panel
          title="Shipping zones"
          hint="Flat rate per zone, with an optional threshold above which shipping is complimentary."
        >
          <div className="space-y-4">
            {zones.map((zone, i) => (
              <div key={zone.id} className="border border-umber-50 p-4">
                <p className="mb-3 text-[13px] font-medium text-espresso">{zone.label}</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Flat rate (EUR)">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={zone.flat ?? 0}
                      onChange={(e) =>
                        setZones((prev) =>
                          prev.map((z, idx) =>
                            idx === i ? { ...z, flat: Number(e.target.value) } : z,
                          ),
                        )
                      }
                    />
                  </Field>
                  <Field label="Free above (EUR)" helper="Blank for none.">
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={zone.freeThreshold ?? ""}
                      onChange={(e) =>
                        setZones((prev) =>
                          prev.map((z, idx) =>
                            idx === i
                              ? {
                                  ...z,
                                  freeThreshold: e.target.value ? Number(e.target.value) : undefined,
                                }
                              : z,
                          ),
                        )
                      }
                    />
                  </Field>
                </div>
              </div>
            ))}
          </div>
        </Panel>

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
      </div>
    </form>
  );
}

function Panel({ title, hint, children }) {
  return (
    <section className="border border-umber-50 bg-ivory-50 p-5">
      <h2 className="font-display text-lg tracking-wide text-espresso">{title}</h2>
      {hint && <p className="mt-1 text-[12px] leading-relaxed text-espresso-soft">{hint}</p>}
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}

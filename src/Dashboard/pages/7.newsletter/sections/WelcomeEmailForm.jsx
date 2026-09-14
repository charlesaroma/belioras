/* Admin Dashboard Page: Newsletter - WelcomeEmailForm */
import { useState } from "react";

import Button from "@/components/ui/Button";
import Field from "@/components/ui/Field";
import { useToast } from "@/context/ToastContext";
import Toggle from "@/Dashboard/components/Toggle";
import { updateWelcomeEmail } from "@/services/campaignsApi";
import NewsletterEmailPreview from "./NewsletterEmailPreview";

/** The automatic email sent once, when someone confirms. Remount with a `key` after saving. */
export default function WelcomeEmailForm({ welcome, coupons, onSaved }) {
  const { toast } = useToast();
  const [form, setForm] = useState({
    enabled: Boolean(welcome?.enabled),
    couponCode: welcome?.couponCode ?? "",
    subject: welcome?.subject ?? "",
    heading: welcome?.heading ?? "",
    body: welcome?.body ?? "",
  });
  const [saving, setSaving] = useState(false);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const coupon = coupons.find((c) => c.code === form.couponCode);

  const save = async () => {
    setSaving(true);
    try {
      await updateWelcomeEmail(form);
      toast(form.enabled ? "Welcome email saved. New subscribers receive it when they confirm." : "Welcome email turned off.", "success");
      onSaved();
    } catch (err) {
      toast(err.message ?? "Could not save the welcome email.", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="space-y-5 border border-umber-50 bg-ivory-50 p-5">
        <Toggle
          checked={form.enabled}
          onChange={(on) => setForm((f) => ({ ...f, enabled: on }))}
          label="Send a welcome email"
          description="Sent automatically, once, the moment someone confirms their subscription. Someone who unsubscribes and joins again does not receive a second code."
        />

        <Field label="Welcome code" helper={coupon ? coupon.description : "No code: the welcome email is a thank-you only."}>
          <select value={form.couponCode} onChange={set("couponCode")}>
            <option value="">No code</option>
            {coupons.map((c) => (
              <option key={c.id} value={c.code}>
                {c.code}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Subject line" required>
          <input value={form.subject} onChange={set("subject")} />
        </Field>
        <Field label="Heading" required>
          <input value={form.heading} onChange={set("heading")} />
        </Field>
        <Field label="Message" required helper="Leave a blank line between paragraphs.">
          <textarea rows={5} value={form.body} onChange={set("body")} className="h-auto min-h-32 resize-y" />
        </Field>

        <div className="flex justify-end">
          <Button loading={saving} onClick={save} className="bg-espresso text-ivory-50 hover:bg-espresso-600">
            Save welcome email
          </Button>
        </div>
      </section>

      <NewsletterEmailPreview
        subject={form.subject}
        heading={form.heading}
        body={form.body}
        code={form.couponCode || null}
        cta={{ label: "Shop new arrivals" }}
      />
    </div>
  );
}

/* Admin Dashboard Page: Newsletter - CampaignFormFields */
import Field from "@/components/ui/Field";
import CampaignProductsField from "./CampaignProductsField";

export default function CampaignFormFields({ form, onChange, products, pages, sendAt, onSendAtChange }) {
  const set = (key) => (e) => onChange((f) => ({ ...f, [key]: e.target.value }));
  const setCta = (key) => (e) => onChange((f) => ({ ...f, cta: { ...f.cta, [key]: e.target.value } }));

  return (
    <div className="space-y-5">
      <Field label="Subject line" required helper="What appears in the inbox. Short and specific reads best.">
        <input value={form.subject} onChange={set("subject")} maxLength={90} placeholder="The Autumn Edit" />
      </Field>

      <Field label="Preview text" helper="The grey line most inboxes show after the subject.">
        <input value={form.previewText} onChange={set("previewText")} maxLength={120} />
      </Field>

      <Field label="Heading" required>
        <input value={form.heading} onChange={set("heading")} />
      </Field>

      <Field label="Message" required helper="Leave a blank line between paragraphs.">
        <textarea rows={6} value={form.body} onChange={set("body")} className="h-auto min-h-36 resize-y" />
      </Field>

      <CampaignProductsField
        products={products}
        selected={form.productIds}
        onChange={(productIds) => onChange((f) => ({ ...f, productIds }))}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Button text">
          <input value={form.cta.label} onChange={setCta("label")} />
        </Field>
        <Field label="Button goes to">
          <select value={form.cta.url} onChange={setCta("url")}>
            {pages.map((page) => (
              <option key={page.url} value={page.url}>
                {page.label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Send on" helper="Choose a date and time to schedule it, or send it yourself when it's ready.">
        <input type="datetime-local" value={sendAt} onChange={(e) => onSendAtChange(e.target.value)} />
      </Field>
    </div>
  );
}

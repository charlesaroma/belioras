/* Admin Dashboard Page: Newsletter - CampaignEditor */
import { useState } from "react";

import Modal from "@/components/common/Modal";
import Button from "@/components/ui/Button";
import { useLanguage } from "@/context/LanguageContext";
import { useToast } from "@/context/ToastContext";
import { saveCampaign, scheduleCampaign, sendCampaign, unscheduleCampaign } from "@/services/marketing/campaignsApi";
import CampaignFormFields from "./CampaignFormFields";
import NewsletterEmailPreview from "./NewsletterEmailPreview";
import { EMPTY_CAMPAIGN, fromCampaign, toLocalInput } from "./campaignFields";

const SOLID = "bg-espresso text-ivory-50 hover:bg-espresso-600";

/** Writes, schedules or sends one campaign. Remount with a changing `key` per open. */
export default function CampaignEditor({ open, campaign, audience, products, pages, onClose, onChanged }) {
  const { locale } = useLanguage();
  const { toast } = useToast();
  const [form, setForm] = useState(() => (campaign ? fromCampaign(campaign) : EMPTY_CAMPAIGN));
  const [sendAt, setSendAt] = useState(() => toLocalInput(campaign?.sendAt));
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const sent = campaign?.status === "sent";
  const scheduled = campaign?.status === "scheduled";
  const people = `${audience} confirmed ${audience === 1 ? "subscriber" : "subscribers"}`;
  const when = (iso) => new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short" }).format(new Date(iso));
  const chosen = form.productIds.map((id) => products.find((p) => p.id === id)).filter(Boolean);

  // Every action saves what is on screen first, so nothing typed is lost.
  const run = async (action) => {
    setBusy(true);
    setError("");
    try {
      const saved = await saveCampaign({ ...form, id: campaign?.id });
      onChanged(await action(saved));
    } catch (err) {
      const message = err.message ?? "Could not save the campaign.";
      setError(message);
      toast(message, "error");
      setConfirming(false);
    } finally {
      setBusy(false);
    }
  };

  const saveDraft = () => run(async () => (scheduled ? "Changes saved." : "Draft saved."));
  const schedule = () =>
    run(async (saved) => `Scheduled for ${when((await scheduleCampaign(saved.id, sendAt ? new Date(sendAt).toISOString() : null)).sendAt)}.`);
  const unschedule = () => run(async (saved) => (await unscheduleCampaign(saved.id), "Schedule cancelled. It is a draft again."));
  const sendNow = () =>
    run(async (saved) => `Marked as sent to ${(await sendCampaign(saved.id)).recipients} subscribers. Delivery begins once the email service is connected.`);

  return (
    <Modal open={open} onClose={onClose} title={sent ? "Sent campaign" : campaign ? "Edit campaign" : "New campaign"} width="max-w-5xl">
      <div className="grid gap-6 lg:grid-cols-2">
        {sent ? (
          <div className="space-y-3 text-[13px] leading-relaxed text-espresso-soft">
            <p className="text-espresso">
              Sent {when(campaign.sentAt)} to {campaign.recipients} {campaign.recipients === 1 ? "subscriber" : "subscribers"}.
            </p>
            <p>Opens, clicks and unsubscribes from this email appear here once the email service is connected.</p>
            <p>A sent campaign can't be edited: it is the record of what subscribers received.</p>
          </div>
        ) : (
          <CampaignFormFields form={form} onChange={setForm} products={products} pages={pages} sendAt={sendAt} onSendAtChange={setSendAt} />
        )}
        <div className="lg:sticky lg:top-0 lg:self-start">
          <NewsletterEmailPreview {...form} products={chosen} />
        </div>
      </div>

      {error && (
        <p role="alert" className="mt-4 border-l-2 border-error py-1 pl-3 text-[13px] text-error">
          {error}
        </p>
      )}

      {!sent && (
        <div className="surface-header sticky bottom-0 -mx-6 -mb-5 mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-umber-50 px-6 py-3">
          {confirming ? (
            <>
              <p className="text-[13px] text-espresso">Send “{form.subject || "this campaign"}” to {people} now?</p>
              <div className="flex gap-2">
                <Button variant="ghost" onClick={() => setConfirming(false)}>Cancel</Button>
                <Button loading={busy} onClick={sendNow} className={SOLID}>Send now</Button>
              </div>
            </>
          ) : (
            <>
              <p className="text-[12px] text-espresso-soft">Goes to {people}.</p>
              <div className="flex flex-wrap gap-2">
                <Button variant="ghost" disabled={busy} onClick={saveDraft}>{scheduled ? "Save changes" : "Save draft"}</Button>
                {scheduled && <Button variant="ghost" disabled={busy} onClick={unschedule}>Cancel schedule</Button>}
                <Button variant="secondary" disabled={busy || !sendAt} onClick={schedule}>Schedule</Button>
                <Button disabled={busy} onClick={() => setConfirming(true)} className={SOLID}>Send now…</Button>
              </div>
            </>
          )}
        </div>
      )}
    </Modal>
  );
}

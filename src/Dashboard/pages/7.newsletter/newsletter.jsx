/* Admin Dashboard Page: Newsletter - newsletter */
import { useState } from "react";
import { Mail, MailCheck, Send } from "lucide-react";

import { cn } from "@/utils/cn";
import NewsletterCampaigns from "./sections/NewsletterCampaigns";
import NewsletterSubscribers from "./sections/NewsletterSubscribers";
import NewsletterWelcome from "./sections/NewsletterWelcome";

const TABS = [
  { id: "subscribers", label: "Subscribers", icon: Mail },
  { id: "campaigns", label: "Campaigns", icon: Send },
  { id: "welcome", label: "Welcome email", icon: MailCheck },
];

export default function DashNewsletter() {
  const [tab, setTab] = useState("subscribers");

  return (
    <div className="space-y-6">
      <p className="max-w-3xl text-[13px] leading-relaxed text-espresso-soft">
        People join the Belioras Letter from the footer or their account, then confirm by email.
        Confirmed subscribers receive your campaigns until they unsubscribe, which every email lets
        them do in one click. Emails are delivered once the email service is connected.
      </p>

      {/* Scrolls sideways on a phone rather than wrapping a lone tab onto a second row. */}
      <div className="max-w-full overflow-x-auto">
      <div role="tablist" aria-label="Newsletter" className="inline-flex border border-umber-50 bg-ivory-50">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            id={`tab-${t.id}`}
            aria-selected={tab === t.id}
            aria-controls={`panel-${t.id}`}
            onClick={() => setTab(t.id)}
            className={cn(
              "flex shrink-0 items-center gap-2 whitespace-nowrap border-r border-umber-50 px-5 py-3 text-[11px] uppercase tracking-[0.16em] transition-colors last:border-r-0",
              tab === t.id ? "bg-espresso text-ivory-50" : "text-espresso-soft hover:bg-brown-50/60 hover:text-espresso",
            )}
          >
            <t.icon className="size-3.5" aria-hidden="true" />
            {t.label}
          </button>
        ))}
      </div>
      </div>

      <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`}>
        {tab === "subscribers" && <NewsletterSubscribers />}
        {tab === "campaigns" && <NewsletterCampaigns />}
        {tab === "welcome" && <NewsletterWelcome />}
      </div>
    </div>
  );
}

/* Admin Dashboard Page: Newsletter - NewsletterWelcome */
import { useState } from "react";

import { useAsyncData } from "@/hooks/useAsyncData";
import { getNewsletterSettings } from "@/services/marketing/campaignsApi";
import { getCoupons } from "@/services/sales/couponsApi";
import WelcomeEmailForm from "./WelcomeEmailForm";

export default function NewsletterWelcome() {
  const [revision, setRevision] = useState(0);
  const { data: settings, loading } = useAsyncData(getNewsletterSettings, [revision]);
  const { data: coupons } = useAsyncData(getCoupons, []);

  if (loading || !settings) return <div className="skeleton h-72 w-full" aria-hidden="true" />;

  return (
    <WelcomeEmailForm
      key={revision}
      welcome={settings.welcome}
      coupons={(coupons ?? []).filter((c) => c.active)}
      onSaved={() => setRevision((n) => n + 1)}
    />
  );
}

import { useAsyncData } from "../../../hooks/useAsyncData";
import { useLanguage } from "../../../context/LanguageContext";
import { getTopBanner } from "../../../services/promotionsApi";

export default function AnnouncementBar() {
  const { data: banner } = useAsyncData(getTopBanner, []);
  const { t } = useLanguage();

  if (!banner || banner.announcements.length === 0) return null;

  // Duplicate the sequence so the -50% translate loops seamlessly
  const items = [...banner.announcements, ...banner.announcements];

  return (
    <div className="overflow-hidden bg-espresso text-ivory-50">
      <div className="py-2">
        <div className="flex w-max animate-[marquee-left_28s_linear_infinite] items-center whitespace-nowrap">
          {items.map((message, i) => (
            <span key={i} className="flex items-center">
              <span className="px-8 text-xs font-medium uppercase tracking-[0.18em]">
                {/* Messages are dashboard-editable content, so they carry a
                    translation key plus the authored English as the fallback.
                    The string form is still accepted while data migrates. */}
                {typeof message === "string" ? message : t(message.key, message.default)}
              </span>
              <span aria-hidden="true" className="text-gold-400">·</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

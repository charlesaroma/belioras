import { useAsyncData } from "../../../hooks/useAsyncData";
import { useLanguage } from "../../../context/LanguageContext";
import { getTopBanner } from "../../../services/promotionsApi";
import CurrencySelector from "../../common/CurrencySelector";
import LanguageSelector from "../../common/LanguageSelector";

/**
 * The promo marquee, and on mobile the header's utility row.
 *
 * Language and currency sit here rather than beside the bag. In the main row
 * they were a 168px cluster against a 44px burger, and because the centre
 * column is 1fr it absorbed the whole difference — the wordmark rendered 62px
 * left of true centre at every width, and at 360px it was squeezed into a
 * 100px column. Moving them up leaves burger | wordmark | bag at 44px a side,
 * so the mark is centred for free and the bag is the only action on the row.
 *
 * They are also settings changed once a session at most, which did not earn
 * standing space next to the one control that takes money.
 */
export default function AnnouncementBar() {
  const { data: banner } = useAsyncData(getTopBanner, []);
  const { t } = useLanguage();

  const announcements = banner?.announcements ?? [];

  // The utility row has to survive an empty promo list. Clearing the
  // announcements in the dashboard would otherwise take language and currency
  // off the phone header along with the marquee.
  if (announcements.length === 0) {
    return (
      <div className="flex justify-end bg-espresso px-2 text-ivory-50 lg:hidden">
        <Utilities />
      </div>
    );
  }

  // Duplicate the sequence so the -50% translate loops seamlessly
  const items = [...announcements, ...announcements];

  return (
    // No overflow-hidden here: the language and currency menus drop out of
    // this row and would be clipped by it. Only the marquee track clips.
    <div className="flex items-center bg-espresso text-ivory-50">
      <div className="relative min-w-0 flex-1 overflow-hidden py-2">
        {/* The track runs right up to the utility cluster, so a half-word
            would otherwise butt against "EN". Fade it into the bar instead. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-r from-transparent to-espresso lg:hidden"
        />
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

      <div className="shrink-0 pr-2 lg:hidden">
        <Utilities />
      </div>
    </div>
  );
}

function Utilities() {
  return (
    <div className="flex items-center gap-2">
      <LanguageSelector />
      <CurrencySelector />
    </div>
  );
}

/* Layout Component: Footer */
import { useAsyncData } from "../../hooks/useAsyncData";
import { useContentVersion } from "../../context/ContentContext";
import { getSettings } from "../../services/settingsApi";
import { getNavigation } from "../../services/navigationApi";

import FooterNewsletter from "./footer/FooterNewsletter";
import FooterBrand, { FooterCompliance } from "./footer/FooterBrand";
import FooterLinkColumn from "./footer/FooterLinkColumn";
import FooterBottomBar from "./footer/FooterBottomBar";
import { FOOTER_COLUMNS, linksFor } from "./footer/footerLinks";

export default function Footer() {
  const version = useContentVersion();
  const { data: settings } = useAsyncData(getSettings, [version]);
  const { data: categories } = useAsyncData(getNavigation, [version]);

  return (
    <footer className="bg-ivory-50 text-espresso">
      <FooterNewsletter />

      {/* One tree for every width. The columns were written twice, once under
          md:hidden and once under hidden md:grid, so each link existed in the
          markup twice and could only be edited in both places at once. */}
      <div className="container-main pb-14 pt-16 md:pb-16 md:pt-20">
        {/* Five children, so the brand needs its own track — at
            [1.6fr_1fr_1fr_1fr] the Legal column wrapped onto a second row and
            left the right half of the footer empty. */}
        <div className="md:grid md:grid-cols-2 md:gap-x-10 md:gap-y-14 lg:grid-cols-[1.5fr_repeat(4,1fr)] lg:gap-x-8">
          <FooterBrand social={settings?.social} />

          {FOOTER_COLUMNS.map((column, i) => (
            <FooterLinkColumn
              key={column.id}
              title={column.title}
              links={linksFor(column, categories)}
              // Shop opens by default on a phone; the rest stay closed so the
              // footer is a short list rather than a screen of links.
              defaultOpen={i === 0}
            />
          ))}
        </div>

        <div className="mt-10 border-t border-espresso/10 pt-8 md:mt-14">
          <FooterCompliance gpsr={settings?.gpsr} />
        </div>
      </div>

      <FooterBottomBar taxNote={settings?.tax?.note} />
    </footer>
  );
}

/* Layout Component: Footer */
import { useAsyncData } from "../../hooks/useAsyncData";
import { useContentVersion } from "../../context/ContentContext";
import { getSettings } from "../../services/settingsApi";
import { getNavigation } from "../../services/navigationApi";

import FooterNewsletter from "./footer/FooterNewsletter";
import FooterBrand from "./footer/FooterBrand";
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
      <div className="container-main py-12 md:py-16">
        <div className="md:grid md:gap-12 lg:grid-cols-[1.6fr_1fr_1fr_1fr] lg:gap-8">
          <FooterBrand social={settings?.social} gpsr={settings?.gpsr} />

          {FOOTER_COLUMNS.map((column, i) => (
            <FooterLinkColumn
              key={column.id}
              title={column.title}
              links={linksFor(column, categories)}
              // Shop opens by default on a phone; the rest stay closed so the
              // footer does not become a screen of links.
              defaultOpen={i === 0}
            />
          ))}
        </div>
      </div>

      <FooterBottomBar taxNote={settings?.tax?.note} />
    </footer>
  );
}

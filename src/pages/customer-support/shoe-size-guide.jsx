import PageShell, { Section } from "../../components/layout/PageShell";
import SizeChart from "../../components/storefront/sizeChart/SizeChart";

/**
 * Footwear sizing.
 *
 * The conversion table is no longer written here: it was byte-identical to the
 * one inside product.jsx, so the two could drift and a shopper could be shown
 * different numbers depending on where they looked. Both now render the same
 * SizeChart, and the advice below is what this page adds on top of it.
 */
export default function ShoeSizeGuidePage() {
  return (
    <PageShell
      eyebrow="Client care"
      title="Shoe size guide"
      intro="Our shoes are made on European lasts. Measure your foot and read across."
    >
      <Section title="Conversions">
        <SizeChart kind="footwear" />
      </Section>

      <Section title="Between sizes">
        <p>
          Take the larger size. If you are more than half a size over, a heel grip will close the gap
          more comfortably than a size down will.
        </p>
        <p>
          Our heels are cut narrow through the toe. If your foot is wide, we suggest going up a full
          size in the pointed styles.
        </p>
      </Section>
    </PageShell>
  );
}

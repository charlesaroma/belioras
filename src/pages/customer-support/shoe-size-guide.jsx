import PageShell, { Section } from "../../components/layout/PageShell";

/** EU is our reference scale; the rest are the standard conversions. */
const SIZES = [
  { eu: 36, uk: 3, us: 5, cm: 22.5 },
  { eu: 37, uk: 4, us: 6, cm: 23.5 },
  { eu: 38, uk: 5, us: 7, cm: 24.1 },
  { eu: 39, uk: 6, us: 8, cm: 25.1 },
  { eu: 40, uk: 6.5, us: 9, cm: 25.9 },
  { eu: 41, uk: 7.5, us: 10, cm: 26.7 },
];

export default function ShoeSizeGuidePage() {
  return (
    <PageShell
      eyebrow="Client care"
      title="Shoe Size Guide"
      intro="Our shoes are made on European lasts and run true to size. Measure once and use the table below."
    >
      <Section title="Conversions">
        <div className="-mx-1 overflow-x-auto">
          <table className="w-full min-w-[420px] text-left text-sm">
            <thead>
              <tr className="border-b border-umber-50 text-[10px] uppercase tracking-[0.16em] text-espresso/45">
                <th className="pb-2 pr-4 font-semibold">EU</th>
                <th className="pb-2 pr-4 font-semibold">UK</th>
                <th className="pb-2 pr-4 font-semibold">US</th>
                <th className="pb-2 font-semibold">Foot length</th>
              </tr>
            </thead>
            <tbody>
              {SIZES.map((s) => (
                <tr key={s.eu} className="border-b border-umber-50/60 last:border-0">
                  <td className="py-3 pr-4 tabular-nums text-espresso">{s.eu}</td>
                  <td className="py-3 pr-4 tabular-nums">{s.uk}</td>
                  <td className="py-3 pr-4 tabular-nums">{s.us}</td>
                  <td className="py-3 tabular-nums">{s.cm}&nbsp;cm</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>Foot length is the measurement of your foot, not the inside of the shoe.</p>
      </Section>

      <Section title="Measuring">
        <ul>
          <li>Stand on a sheet of paper with your heel to a wall, in the evening.</li>
          <li>Mark the tip of your longest toe — not always the big toe.</li>
          <li>Measure heel to mark in centimetres, and do both feet.</li>
          <li>Use the larger of the two against the table.</li>
        </ul>
        <p>
          Feet swell over the course of a day, which is why we suggest measuring in the evening. A
          morning measurement will read short.
        </p>
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

import PageShell, { Section } from "../../components/layout/PageShell";

/** Inches are the trade standard for hair; centimetres shown for EU customers. */
const LENGTHS = [
  { in: 12, cm: 30, falls: "Collarbone", note: "A sharp bob. Holds the most volume." },
  { in: 14, cm: 36, falls: "Shoulder", note: "Grazes the shoulder when straight." },
  { in: 16, cm: 41, falls: "Below shoulder", note: "The most requested length." },
  { in: 18, cm: 46, falls: "Armpit", note: "Long enough to gather." },
  { in: 20, cm: 51, falls: "Mid-back", note: "" },
  { in: 22, cm: 56, falls: "Below mid-back", note: "" },
  { in: 24, cm: 61, falls: "Waist", note: "" },
  { in: 26, cm: 66, falls: "Below waist", note: "Heaviest to wear all day." },
];

const TEXTURES = [
  { name: "Straight", note: "Measures as stated. Nothing lost to curl pattern." },
  { name: "Yaky", note: "Sits close to straight; a relaxed texture with a soft finish." },
  { name: "Wavy", note: "Wears roughly one to two inches shorter than measured." },
  { name: "Bouncy", note: "Wears about two inches shorter; blow-dried body." },
  { name: "Curly", note: "Wears three to four inches shorter. Size up if length matters." },
  { name: "Kinky", note: "Wears four or more inches shorter — the tightest pattern we carry." },
  { name: "Braided", note: "Measured finished, so what is stated is what you wear." },
  { name: "Locs", note: "Measured finished. Weight builds with length." },
  { name: "Short", note: "Under 12 inches, cut to shape." },
];

export default function HairLengthGuidePage() {
  return (
    <PageShell
      eyebrow="Client care"
      title="Hair Length Guide"
      intro="Hair is measured stretched, but you wear it curled — so the number on the label is rarely the length you see in the mirror. Here is how the two relate."
    >
      <Section title="Where each length falls">
        <div className="-mx-1 overflow-x-auto">
          <table className="w-full min-w-[460px] text-left text-sm">
            <thead>
              <tr className="border-b border-umber-50 text-[10px] uppercase tracking-[0.16em] text-espresso/45">
                <th className="pb-2 pr-4 font-semibold">Inches</th>
                <th className="pb-2 pr-4 font-semibold">cm</th>
                <th className="pb-2 pr-4 font-semibold">Falls at</th>
                <th className="pb-2 font-semibold">Note</th>
              </tr>
            </thead>
            <tbody>
              {LENGTHS.map((l) => (
                <tr key={l.in} className="border-b border-umber-50/60 last:border-0">
                  <td className="py-3 pr-4 tabular-nums text-espresso">{l.in}&Prime;</td>
                  <td className="py-3 pr-4 tabular-nums">{l.cm}</td>
                  <td className="py-3 pr-4">{l.falls}</td>
                  <td className="py-3 text-espresso/50">{l.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          Measured on a 168&nbsp;cm frame. Taller than that and each length falls a little higher.
        </p>
      </Section>

      <Section title="How texture changes length">
        <p>
          This is the part most people are caught by. A 20&Prime; kinky wig and a 20&Prime; straight
          wig contain the same length of hair, but the kinky one will sit near the shoulder while the
          straight one reaches mid-back.
        </p>
        <div className="-mx-1 overflow-x-auto">
          <table className="w-full min-w-[420px] text-left text-sm">
            <thead>
              <tr className="border-b border-umber-50 text-[10px] uppercase tracking-[0.16em] text-espresso/45">
                <th className="pb-2 pr-4 font-semibold">Texture</th>
                <th className="pb-2 font-semibold">How it wears</th>
              </tr>
            </thead>
            <tbody>
              {TEXTURES.map((t) => (
                <tr key={t.name} className="border-b border-umber-50/60 last:border-0">
                  <td className="py-3 pr-4 text-espresso">{t.name}</td>
                  <td className="py-3">{t.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Choosing">
        <ul>
          <li>Measure from your hairline to where you want the hair to end.</li>
          <li>Add the allowance above for your texture.</li>
          <li>If you are between two lengths, take the longer — it can be cut, not added to.</li>
        </ul>
        <p>
          Unsure? Send us a photograph at{" "}
          <a href="mailto:care@belioras.com">care@belioras.com</a> and we will advise.
        </p>
      </Section>

      <Section title="Before you order">
        <p>
          <strong>Hair cannot be returned once its packaging is opened</strong> — a hygiene rule
          under EU consumer law. Unopened and still sealed, it can be returned normally within
          fourteen days. Please check the length before you break the seal.
        </p>
      </Section>
    </PageShell>
  );
}

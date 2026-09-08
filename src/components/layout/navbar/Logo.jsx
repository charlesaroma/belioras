import BrandMark from "../../shared/BrandMark";

/**
 * Brand mark in the header.
 *
 * A thin wrapper over BrandMark, which owns the asset path and the
 * height-based sizing. It sits directly on the header with no container, so the
 * background blends seamlessly; the drop shadow and circular backdrop the
 * design review rejected are both gone.
 *
 * The review specified a 230px width, but width is the wrong axis to size this
 * on — see the note in BrandMark. It is sized by height instead, at 67px on
 * desktop, a deliberate departure worth confirming with Belioras.
 */
export default function Logo() {
  return <BrandMark size="lg" wrapperClassName="justify-self-center" />;
}

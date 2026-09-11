/* Copyright Payment Marks And VAT */
import FooterPaymentMarks from "./FooterPaymentMarks";

export default function FooterBottomBar({ taxNote }) {
  return (
    <div className="border-t border-espresso/10">
      <div className="container-main flex flex-col items-center gap-6 py-8 text-[11px] text-espresso/40 md:flex-row md:justify-between md:gap-8">
        <p className="order-3 tracking-wide md:order-none">
          © {new Date().getFullYear()} Belioras Maison Lda.
        </p>
        <FooterPaymentMarks className="order-1 justify-center md:order-none" />
        <p className="order-2 tracking-wide md:order-none">{taxNote ?? "Prices include VAT."}</p>
      </div>
    </div>
  );
}

/* Copyright Payment Marks And VAT */
import FooterPaymentMarks from "./FooterPaymentMarks";

export default function FooterBottomBar({ taxNote }) {
  return (
    <div className="border-t border-espresso/10">
      <div className="container-main flex flex-col items-center gap-4 py-8 text-xs text-espresso/60 md:flex-row md:justify-between">
        <p className="order-2 text-center md:order-none md:text-left">
          © {new Date().getFullYear()} Belioras Maison Lda. All rights reserved.
        </p>
        <FooterPaymentMarks className="order-1 justify-center text-espresso/70 md:order-none" />
        <p className="order-3 text-center md:order-none md:text-right">
          {taxNote ?? "All prices include 20% VAT."}
        </p>
      </div>
    </div>
  );
}

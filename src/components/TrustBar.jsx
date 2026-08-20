import { Truck, RotateCcw, ShieldCheck, Lock } from "lucide-react";

export default function TrustBar() {
  const benefits = [
    {
      icon: <Truck className="h-6 w-6 text-gold-500" strokeWidth={1.5} />,
      title: "Free EU Shipping",
      subtitle: "On orders over €150, tracked and insured.",
    },
    {
      icon: <RotateCcw className="h-6 w-6 text-gold-500" strokeWidth={1.5} />,
      title: "14-Day Returns",
      subtitle: "Effortless returns on unworn pieces.",
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-gold-500" strokeWidth={1.5} />,
      title: "Authentic, Guaranteed",
      subtitle: "Every item is verified at source.",
    },
    {
      icon: <Lock className="h-6 w-6 text-gold-500" strokeWidth={1.5} />,
      title: "Secure Checkout",
      subtitle: "Encrypted payments, your data stays yours.",
    },
  ];

  return (
    <section className="border-y border-umber-50 bg-ivory-50">
      <div className="container-main py-10">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((item, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gold-50">
                {item.icon}
              </div>
              <h3 className="mb-2 font-sans text-[14px] font-semibold uppercase tracking-[0.06em] text-espresso">
                {item.title}
              </h3>
              <p className="font-sans text-[13px] text-brown-500 max-w-[200px]">
                {item.subtitle}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

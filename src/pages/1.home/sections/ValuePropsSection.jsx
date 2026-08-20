import { Lock, RotateCcw, ShieldCheck, Truck } from "lucide-react";

export default function ValuePropsSection() {
  const benefits = [
    {
      icon: <Truck className="size-6 text-gold-500" strokeWidth={1.5} />,
      title: "FREE EU SHIPPING",
      subtitle: "On orders over €150, tracked and insured.",
    },
    {
      icon: <RotateCcw className="size-6 text-gold-500" strokeWidth={1.5} />,
      title: "14-DAY RETURNS",
      subtitle: "Effortless returns on unworn pieces.",
    },
    {
      icon: <ShieldCheck className="size-6 text-gold-500" strokeWidth={1.5} />,
      title: "AUTHENTIC, GUARANTEED",
      subtitle: "Every item is verified at source.",
    },
    {
      icon: <Lock className="size-6 text-gold-500" strokeWidth={1.5} />,
      title: "SECURE CHECKOUT",
      subtitle: "Encrypted payments, your data stays yours.",
    },
  ];

  return (
    <section aria-label="Shopping perks" className="border-y border-[#e5e5e5] bg-ivory-50">
      <div className="container-main py-10">
        <ul className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((item) => (
            <li key={item.title} className="flex flex-col items-center text-center">
              <span className="mb-4 flex size-12 shrink-0 items-center justify-center rounded-full bg-gold-50 text-gold-500">
                {item.icon}
              </span>
              <h3 className="mb-2 text-[14px] font-semibold uppercase tracking-[0.06em] text-espresso">
                {item.title}
              </h3>
              <p className="max-w-[200px] text-[13px] leading-relaxed text-brown-500">
                {item.subtitle}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
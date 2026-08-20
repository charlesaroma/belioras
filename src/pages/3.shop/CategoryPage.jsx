import { useParams } from "react-router-dom";

export default function CategoryPage() {
  const { category } = useParams();

  return (
    <section className="container-main py-section-mobile md:py-section-desktop" aria-labelledby="category-title">
      <p className="eyebrow">Collection</p>
      <h1 id="category-title" className="font-display text-4xl font-medium capitalize tracking-wide">
        {category ?? "Shop"}
      </h1>
      <p className="mt-4 max-w-xl text-espresso-soft">
        Products for this collection are being wired in.
      </p>
    </section>
  );
}
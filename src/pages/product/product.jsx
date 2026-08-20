import { useParams } from "react-router-dom";

export default function ProductPage() {
  const { slug } = useParams();

  return (
    <section className="container-main py-section-mobile md:py-section-desktop" aria-labelledby="product-title">
      <p className="eyebrow">Product</p>
      <h1 id="product-title" className="font-display text-4xl font-medium capitalize tracking-wide">
        {slug ?? "Product"}
      </h1>
      <p className="mt-4 max-w-xl text-espresso-soft">
        Galleries, options, reviews and add-to-bag coming in the product pass.
      </p>
    </section>
  );
}
export default function ShopPage() {
  return (
    <section className="container-main py-section-mobile md:py-section-desktop" aria-labelledby="shop-title">
      <p className="eyebrow">All categories</p>
      <h1 id="shop-title" className="font-display text-4xl font-medium capitalize tracking-wide">
        Shop
      </h1>
      <p className="mt-4 max-w-xl text-espresso-soft">
        The full Belioras catalogue, with filters and sorting on the way.
      </p>
    </section>
  );
}
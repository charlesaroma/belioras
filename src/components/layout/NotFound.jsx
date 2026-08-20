import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="container-main py-24">
      <div className="mx-auto max-w-xl text-center">
        <p className="eyebrow">Error 404</p>
        <h1 className="mt-3 font-display text-5xl text-espresso sm:text-6xl">Page not found</h1>
        <p className="mx-auto mt-4 max-w-md text-espresso/70">
          The page you are looking for has moved or no longer exists. Head back to the shop to
          keep browsing.
        </p>
        <Link to="/shop" className="btn btn-primary btn-lg mt-8">
          Back to shop
        </Link>
      </div>
    </section>
  );
}
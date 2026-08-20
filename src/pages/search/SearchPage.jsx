import { useSearchParams } from "react-router-dom";

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") ?? "";

  return (
    <section className="container-main py-section-mobile md:py-section-desktop" aria-labelledby="search-title">
      <p className="eyebrow">Search</p>
      <h1 id="search-title" className="font-display text-4xl font-medium capitalize tracking-wide">
        Results
      </h1>
      <p className="mt-4 max-w-xl text-espresso-soft">
        {query ? (
          <>Showing results for “{query}”.</>
        ) : (
          <>Search the catalogue for something to keep.</>
        )}
      </p>
    </section>
  );
}
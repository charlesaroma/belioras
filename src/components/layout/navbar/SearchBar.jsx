import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  function onSubmit(e) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    navigate(`/search?q=${encodeURIComponent(q)}`);
    setQuery("");
  }

  return (
    <form
      role="search"
      aria-label="Search products"
      onSubmit={onSubmit}
      className="hidden w-full max-w-sm lg:block"
    >
      <label htmlFor="navbar-search" className="sr-only">
        Search products
      </label>
      <div className="relative border-b border-espresso/30 transition-colors focus-within:border-espresso hover:border-espresso/50">
        <input
          id="navbar-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Try searching for... Corset Tops"
          className="h-10 w-full bg-transparent pr-10 text-sm text-espresso placeholder-espresso/60 focus:outline-none"
        />
        <button
          type="submit"
          className="absolute right-0 top-1/2 flex -translate-y-1/2 items-center justify-center p-2 text-espresso/60 transition-colors hover:text-espresso"
          aria-label="Submit search"
        >
          <Search className="size-4" aria-hidden="true" />
        </button>
      </div>
    </form>
  );
}
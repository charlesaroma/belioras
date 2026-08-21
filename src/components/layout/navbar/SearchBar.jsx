import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

const SEARCH_PHRASES = [
  "Try searching for... Corset Tops",
  "Try searching for... Maxi Dresses",
  "Try searching for... Hair Extensions",
  "Try searching for... Two-Piece Sets"
];

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [placeholder, setPlaceholder] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  function onSubmit(e) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    navigate(`/search?q=${encodeURIComponent(q)}`);
    setQuery("");
  }

  useEffect(() => {
    const currentPhrase = SEARCH_PHRASES[phraseIndex];
    let typingSpeed = isDeleting ? 30 : 60;

    if (!isDeleting && charIndex === currentPhrase.length) {
      typingSpeed = 2000; // Pause at the end
      const timeout = setTimeout(() => setIsDeleting(true), typingSpeed);
      return () => clearTimeout(timeout);
    } else if (isDeleting && charIndex === 0) {
      setIsDeleting(false);
      setPhraseIndex((prev) => (prev + 1) % SEARCH_PHRASES.length);
      return;
    }

    const timeout = setTimeout(() => {
      setPlaceholder(currentPhrase.substring(0, charIndex + (isDeleting ? -1 : 1)));
      setCharIndex((prev) => prev + (isDeleting ? -1 : 1));
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, phraseIndex]);

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
      <div className="relative border-b border-current opacity-70 transition-opacity focus-within:opacity-100 hover:opacity-100">
        <input
          id="navbar-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder || " "}
          className="h-10 w-full bg-transparent pr-10 text-sm text-current placeholder-current focus:outline-none"
        />
        <button
          type="submit"
          className="absolute right-0 top-1/2 flex -translate-y-1/2 items-center justify-center p-2 text-current opacity-70 transition-opacity hover:opacity-100"
          aria-label="Submit search"
        >
          <Search className="size-4" aria-hidden="true" />
        </button>
      </div>
    </form>
  );
}
/* Layout Component: SearchBar */
import { useEffect, useState } from "react";
import { Search } from "lucide-react";

const PHRASES = [
  "Try searching for... Corset Tops",
  "Try searching for... Maxi Dresses",
  "Try searching for... Hair Extensions",
  "Try searching for... Two-Piece Sets",
];

export default function SearchBar({ value, onChange, onFocus, onSubmit }) {
  const [placeholder, setPlaceholder] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  // Pauses once the shopper has typed something — a placeholder animating
  // under live text is a distraction at exactly the wrong moment.
  const paused = Boolean(value);

  useEffect(() => {
    if (paused) return undefined;

    const phrase = PHRASES[phraseIndex];

    if (!deleting && charIndex === phrase.length) {
      const hold = setTimeout(() => setDeleting(true), 2000);
      return () => clearTimeout(hold);
    }

    const tick = setTimeout(
      () => {
        if (deleting && charIndex === 0) {
          setDeleting(false);
          setPhraseIndex((i) => (i + 1) % PHRASES.length);
          return;
        }
        const next = charIndex + (deleting ? -1 : 1);
        setPlaceholder(phrase.substring(0, next));
        setCharIndex(next);
      },
      deleting ? 30 : 60,
    );
    return () => clearTimeout(tick);
  }, [charIndex, deleting, phraseIndex, paused]);

  return (
    <form
      role="search"
      aria-label="Search products"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit?.();
      }}
      className="hidden w-full max-w-[280px] lg:block"
    >
      <label htmlFor="navbar-search" className="sr-only">
        Search products
      </label>
      <div className="relative border-b border-current opacity-70 transition-opacity focus-within:opacity-100 hover:opacity-100">
        <input
          id="navbar-search"
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={onFocus}
          placeholder={placeholder || " "}
          className="h-10 w-full bg-transparent pr-10 text-sm text-current placeholder-current focus:outline-none"
        />
        <button
          type="submit"
          className="absolute right-0 top-1/2 flex -translate-y-1/2 items-center justify-center p-2 text-current opacity-70 transition-opacity hover:opacity-100"
          aria-label="Search"
        >
          <Search className="size-4" aria-hidden="true" />
        </button>
      </div>
    </form>
  );
}

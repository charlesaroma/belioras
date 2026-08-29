import { Link } from "react-router-dom";

export default function Logo({ isScrolled, menuOpen }) {
  return (
    <Link
      to="/"
      aria-label="Belioras — home"
      className="justify-self-center transition-opacity hover:opacity-80 cursor-pointer"
    >
      <img
        src="/belioras-logo.png"
        alt="Belioras"
        width={600}
        height={400}
        className="h-16 w-auto sm:h-20 transition-all duration-300"
      />
    </Link>
  );
}
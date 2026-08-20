import { Link } from "react-router-dom";

export default function Logo() {
  return (
    <Link
      to="/"
      aria-label="Belioras — home"
      className="justify-self-center transition-opacity hover:opacity-80"
    >
      <img
        src="/belioras-logo.png"
        alt="Belioras"
        width={600}
        height={400}
        className="h-12 w-auto sm:h-14"
      />
    </Link>
  );
}
import { Link, useLocation } from "react-router-dom";

// Pages with a light/white background that should always show the gold logo
const LIGHT_BG_PATHS = ["/product", "/shop", "/account", "/contact", "/about", "/login", "/signup", "/forgot-password", "/search", "/wishlist"];

export default function Logo({ isScrolled, menuOpen }) {
  const { pathname } = useLocation();
  const isLightBgPage = LIGHT_BG_PATHS.some((p) => pathname.startsWith(p));
  const useDarkLogo = isScrolled || menuOpen || isLightBgPage;

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
        className={`h-12 w-auto sm:h-14 transition-all duration-300 ${!useDarkLogo ? 'brightness-0 invert' : ''}`}
      />
    </Link>
  );
}
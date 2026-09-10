/* Navbar Paths */

// Paths whose page opens on a plain light background rather than a full-bleed
// photo, so the navbar renders solid from the first frame instead of
// transparent-over-dark. The catalogue routes were missing here and it showed
// as a dark gradient smudge over blank ivory once ShopHeader lost its banner.
const LIGHT_BG_PATHS = [
  "/product",
  "/shop",
  "/dresses",
  "/hair",
  "/accessories",
  "/new-arrivals",
  "/account",
  "/contact",
  "/about",
  "/login",
  "/signup",
  "/forgot-password",
  "/search",
  "/wishlist",
];

export function isLightBgPath(pathname) {
  return LIGHT_BG_PATHS.some((p) => pathname.startsWith(p));
}

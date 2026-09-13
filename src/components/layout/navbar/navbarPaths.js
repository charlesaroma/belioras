/* Navbar Paths */

// The navbar is transparent only over a full-bleed photograph, and only the
// home page opens on one. Everywhere else the page starts on ivory, where a
// transparent navbar is ivory text on an ivory page.
//
// This used to be a list of the light pages instead, which every new page had
// to remember to join. Order tracking, both size guides, all five legal pages,
// FAQ, checkout and the 404 never did. Listing the exception rather than the
// rule means a new page is readable by default.
const PHOTO_HERO_PATHS = ["/"];

export function isLightBgPath(pathname) {
  return !PHOTO_HERO_PATHS.includes(pathname);
}

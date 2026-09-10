import { Heart, LayoutDashboard, MapPin, Package, Settings, UserRound } from "lucide-react";

/**
 * The signed-in destinations, defined once.
 *
 * The header dropdown listed six and the mobile drawer listed one, so five of
 * the six were unreachable on a phone without landing on /account first — and
 * an admin got no atelier link at all despite the role being available. Two
 * hand-maintained lists is how that gap opened; this is the one list both
 * render from.
 *
 * `t` and `isAdmin` are passed in rather than read from context, so this stays
 * a pure function and each menu keeps its own presentation.
 */

/* account Menu Items */
export function accountMenuItems({ t, isAdmin }) {

  const label = (key, fallback) => (t ? t(key, fallback) : fallback);

  return [
    { to: "/account", label: label("nav.myAccount", "My account"), icon: UserRound },
    { to: "/account/orders", label: label("nav.orders", "Orders"), icon: Package },
    { to: "/account/wishlist", label: label("nav.savedPieces", "Saved pieces"), icon: Heart },
    { to: "/account/addresses", label: label("nav.addresses", "Addresses"), icon: MapPin },
    { to: "/account/settings", label: label("nav.settings", "Settings"), icon: Settings },
    ...(isAdmin
      ? [
          {
            to: "/dashboard",
            label: label("nav.dashboard", "Atelier dashboard"),
            icon: LayoutDashboard,
          },
        ]
      : []),
  ];
}

/* Layout Component: MegaMenuPanel */
import MegaMenuDesktop from "./megaMenu/MegaMenuDesktop";
import MegaMenuMobile from "./megaMenu/MegaMenuMobile";

// One renderer serves both chromes — the desktop panel lays sections out in
// columns, the drawer collapses them into accordions. Keeping the choice here
// is what stops the two presentations drifting apart.
export default function MegaMenuPanel({
  item,
  variant = "desktop",
  onNavigate,
  columns = 3,
  showTiles = true,
}) {
  if (!item) return null;

  const sections = item.sections ?? [];
  const tiles = item.tiles ?? [];
  if (!sections.length && !tiles.length) return null;

  if (variant === "mobile") {
    return <MegaMenuMobile item={item} sections={sections} onNavigate={onNavigate} />;
  }

  return (
    <MegaMenuDesktop
      item={item}
      sections={sections}
      tiles={tiles}
      columns={columns}
      showTiles={showTiles}
      onNavigate={onNavigate}
    />
  );
}

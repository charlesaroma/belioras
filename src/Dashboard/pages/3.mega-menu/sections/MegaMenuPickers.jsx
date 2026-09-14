/* Admin Dashboard Page: Mega-menu - MegaMenuPickers */
import MegaMenuLinkPicker from "./MegaMenuLinkPicker";
import MegaMenuTilePicker from "./MegaMenuTilePicker";
import { addRootIn, menuPages, newLeaf } from "./megaMenuTree";

/** The one picker open at a time: for a tile, or for a menu item or link. Remounted per opening by `n`. */
export default function MegaMenuPickers({ picker, draft, lookups, onClose, onSave }) {
  const { request, n } = picker;
  const root = draft.find((r) => r.id === request?.rootId);

  if (request?.mode === "tile") {
    return (
      <MegaMenuTilePicker
        key={n}
        open
        initial={request.initial ?? null}
        pages={menuPages(draft)}
        lookups={lookups}
        onClose={onClose}
        onSave={onSave}
      />
    );
  }

  // New items and links show the address they will get; existing ones keep theirs.
  const addressFor =
    request?.mode === "item" && !request.rootId
      ? (name) => addRootIn(draft, { label: name }).at(-1).url
      : request?.mode === "link" && !request.itemId && root
        ? (name) => newLeaf(draft, root, { label: name }).url
        : null;

  return (
    <MegaMenuLinkPicker
      key={n}
      open={Boolean(request)}
      mode={request?.mode ?? "link"}
      initial={request?.initial ?? null}
      defaultCategory={root?.target?.kind === "category" ? root.target.id : ""}
      lookups={lookups}
      addressFor={addressFor}
      onClose={onClose}
      onSave={onSave}
    />
  );
}

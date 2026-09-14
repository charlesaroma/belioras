/* Admin Dashboard Page: Mega-menu - MegaMenuTilePicker */
import { useState } from "react";
import { Search } from "lucide-react";

import Modal from "@/components/common/Modal";
import Button from "@/components/ui/Button";
import Field from "@/components/ui/Field";
import { cn } from "@/utils/cn";
import { countFor, piecesText } from "./megaMenuPickerOptions";

const TABS = [
  { id: "page", label: "A page in this menu" },
  { id: "product", label: "A product" },
];

const ROW = "flex min-h-12 w-full items-center gap-3 border px-3 text-left text-[13px] transition-colors";
const ON = "border-espresso bg-espresso text-ivory-50";
const OFF = "border-umber-100 bg-white text-espresso hover:border-espresso/50";

/** Chooses where a feature tile links: a page already in the menu, or one product. */
export default function MegaMenuTilePicker({ open, initial = null, pages, lookups, onClose, onSave }) {
  const isProduct = initial?.target?.kind === "product";
  const [tab, setTab] = useState(isProduct ? "product" : "page");
  const [pageUrl, setPageUrl] = useState(isProduct ? "" : (initial?.url ?? ""));
  const [productId, setProductId] = useState(isProduct ? initial.target.id : "");
  const [query, setQuery] = useState("");
  const [title, setTitle] = useState(initial?.title ?? "");
  const [touched, setTouched] = useState(Boolean(initial?.title));

  const page = pages.find((p) => p.url === pageUrl);
  const product = lookups.products.find((p) => p.id === productId);
  const chosen = tab === "page" ? page : product;
  const name = touched ? title : (chosen?.name ?? "");
  const results = lookups.products
    .filter((p) => p.name.toLowerCase().includes(query.trim().toLowerCase()))
    .slice(0, 40);

  const save = () =>
    onSave(
      tab === "page"
        ? { title: name.trim(), target: page.target, url: page.url }
        : { title: name.trim(), target: { kind: "product", id: product.id }, url: `/product/${product.slug}` },
    );

  return (
    <Modal open={open} onClose={onClose} title={initial ? "Change this tile" : "Add a feature tile"} width="max-w-2xl">
      <div className="space-y-5">
        <div role="tablist" aria-label="Tile links to" className="inline-flex border border-umber-50">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "border-r border-umber-50 px-4 py-2.5 text-[11px] uppercase tracking-[0.14em] last:border-r-0",
                tab === t.id ? "bg-espresso text-ivory-50" : "text-espresso-soft hover:text-espresso",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === "page" ? (
          <ul className="grid max-h-80 gap-1.5 overflow-y-auto pr-1">
            {pages.map((p) => (
              <li key={p.id}>
                <button type="button" aria-pressed={p.url === pageUrl} onClick={() => setPageUrl(p.url)} className={cn(ROW, "justify-between", p.url === pageUrl ? ON : OFF)}>
                  <span className="min-w-0">
                    <span className="block truncate">{p.name}</span>
                    <span className={cn("block truncate text-[11px]", p.url === pageUrl ? "text-ivory-50/60" : "text-espresso-soft")}>{p.context}</span>
                  </span>
                  <span className="shrink-0 text-[11px] tabular-nums">{piecesText(countFor(p.target, lookups.products))}</span>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="space-y-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-espresso/35" aria-hidden="true" />
              <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search products" aria-label="Search products" className="input w-full pl-9" />
            </div>
            <ul className="grid max-h-72 gap-1.5 overflow-y-auto pr-1">
              {results.map((p) => (
                <li key={p.id}>
                  <button type="button" aria-pressed={p.id === productId} onClick={() => setProductId(p.id)} className={cn(ROW, p.id === productId ? ON : OFF)}>
                    {p.images?.[0] && <img src={p.images[0]} alt="" className="size-9 shrink-0 object-cover" />}
                    <span className="min-w-0 truncate">{p.name}</span>
                  </button>
                </li>
              ))}
            </ul>
            <p className="text-[12px] text-espresso-soft">The tile uses the product&rsquo;s lead photo unless you upload one.</p>
          </div>
        )}

        <Field label="Tile title" required>
          <input
            value={name}
            placeholder="Choose where it links first"
            onChange={(e) => {
              setTitle(e.target.value);
              setTouched(true);
            }}
          />
        </Field>

        {/* Pinned to the foot of the dialog's scroll area, so the action is never below the fold. */}
        <div className="surface-header sticky bottom-0 -mx-6 -mb-5 flex justify-end gap-2 border-t border-umber-50 px-6 py-3">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button disabled={!chosen || !name.trim()} onClick={save} className="bg-espresso text-ivory-50 hover:bg-espresso-600">
            {initial ? "Save tile" : "Add tile"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

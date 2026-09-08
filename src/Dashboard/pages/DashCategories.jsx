import { useMemo, useState } from "react";
import { LayoutGrid, Tags } from "lucide-react";

import { useAsyncData } from "../../hooks/useAsyncData";
import { getNavigation, getTaxonomy } from "../../services/navigationApi";
import { getProducts } from "../../services/productsApi";
import { DIMENSION_PREFIX } from "../../utils/faceting";
import { cn } from "../../utils/cn";
import DashTable from "../components/DashTable";
import DashToolbar from "../components/DashToolbar";

/**
 * Categories and attributes.
 *
 * Previously six invented rows — "Mini Dresses", "Prom & Gala", "Jumpsuits" —
 * that had nothing to do with the navigation tree the storefront actually
 * renders or the taxonomy its filters are built from.
 *
 * Two different things live here and the page now says so. Menu leaves are the
 * navigation structure: the paths shoppers reach from the mega menu. Attributes
 * are the filter vocabulary. Both drive what a piece can be found by, so both
 * show a live product count — a leaf reading 0 is a dead end in the menu, and
 * that is the single most useful thing this page can tell an admin.
 */
export default function DashCategories() {
  const [tab, setTab] = useState("menu");
  const { data: navigation, loading: navLoading } = useAsyncData(getNavigation, []);
  const { data: taxonomy, loading: taxLoading } = useAsyncData(getTaxonomy, []);
  const { data: products } = useAsyncData(getProducts, []);

  /** Every menu leaf, flattened, with how many pieces it currently returns. */
  const leaves = useMemo(() => {
    const rows = [];
    const tagCount = (token) =>
      (products ?? []).filter((p) => (p.tags ?? []).includes(token)).length;

    for (const root of navigation ?? []) {
      for (const section of root.sections ?? []) {
        for (const item of section.items ?? []) {
          const token = item.dimension === "group" ? null : item.slug?.split("/").pop();
          rows.push({
            id: item.id,
            label: item.label,
            root: root.label,
            section: section.title,
            url: item.url,
            products: token
              ? (products ?? []).filter((p) =>
                  (p.tags ?? []).some((t) => t.endsWith(`:${token}`)),
                ).length
              : tagCount(`cat:${root.id}`),
          });
        }
      }
    }
    return rows;
  }, [navigation, products]);

  /** Every attribute value, with its product count. */
  const attributes = useMemo(() => {
    const rows = [];
    for (const [dimension, config] of Object.entries(taxonomy ?? {})) {
      const prefix = DIMENSION_PREFIX[dimension] ?? dimension;
      for (const value of config.values ?? []) {
        const token = `${prefix}:${value.id}`;
        rows.push({
          id: token,
          name: value.name,
          dimension,
          token,
          hex: value.hex,
          products: (products ?? []).filter((p) => (p.tags ?? []).includes(token)).length,
        });
      }
    }
    return rows;
  }, [taxonomy, products]);

  const [query, setQuery] = useState("");

  const menuColumns = [
    { accessorKey: "label", header: "Menu leaf" },
    { accessorKey: "root", header: "Under" },
    { accessorKey: "section", header: "Section" },
    {
      accessorKey: "url",
      header: "Path",
      cell: ({ getValue }) => (
        <code className="text-[11px] text-espresso-soft">{getValue()}</code>
      ),
    },
    {
      accessorKey: "products",
      header: "Pieces",
      meta: { align: "right" },
      cell: ({ getValue }) => (
        <span className={cn("tabular-nums", getValue() === 0 && "text-error")}>{getValue()}</span>
      ),
    },
  ];

  const attrColumns = [
    {
      accessorKey: "name",
      header: "Value",
      cell: ({ row }) => (
        <span className="inline-flex items-center gap-2">
          {row.original.hex && (
            <span
              aria-hidden="true"
              className="inline-block size-3 border border-umber-50"
              style={{ backgroundColor: row.original.hex }}
            />
          )}
          {row.original.name}
        </span>
      ),
    },
    { accessorKey: "dimension", header: "Dimension" },
    {
      accessorKey: "token",
      header: "Tag",
      cell: ({ getValue }) => (
        <code className="text-[11px] text-espresso-soft">{getValue()}</code>
      ),
    },
    {
      accessorKey: "products",
      header: "Pieces",
      meta: { align: "right" },
      cell: ({ getValue }) => (
        <span className={cn("tabular-nums", getValue() === 0 && "text-error")}>{getValue()}</span>
      ),
    },
  ];

  const emptyLeaves = leaves.filter((l) => l.products === 0).length;

  return (
    <div className="space-y-5">
      <div className="flex border border-umber-50" role="tablist" aria-label="Category view">
        {[
          { id: "menu", label: "Menu leaves", icon: LayoutGrid, count: leaves.length },
          { id: "attributes", label: "Attributes", icon: Tags, count: attributes.length },
        ].map((option) => (
          <button
            key={option.id}
            type="button"
            role="tab"
            aria-selected={tab === option.id}
            onClick={() => setTab(option.id)}
            className={cn(
              "flex items-center gap-2 border-r border-umber-50 px-4 py-2.5 text-[11px] uppercase tracking-[0.14em] transition-colors last:border-r-0",
              tab === option.id
                ? "bg-espresso text-ivory-50"
                : "text-espresso-soft hover:bg-brown-50/60 hover:text-espresso",
            )}
          >
            <option.icon className="size-3.5" aria-hidden="true" />
            {option.label}
            <span className="tabular-nums opacity-60">{option.count}</span>
          </button>
        ))}
      </div>

      {tab === "menu" && emptyLeaves > 0 && (
        <p className="border-l-2 border-error px-4 py-2 text-[12px] text-espresso-soft">
          <strong className="font-medium text-espresso">{emptyLeaves}</strong> menu{" "}
          {emptyLeaves === 1 ? "leaf returns" : "leaves return"} no pieces. A shopper reaching one
          of these from the menu lands on an empty grid.
        </p>
      )}

      <DashToolbar
        query={query}
        onQueryChange={setQuery}
        placeholder={tab === "menu" ? "Search menu leaves" : "Search attributes"}
      />

      {/* Keyed on the tab so the table resets its sort and page when the two
          different shapes swap, rather than carrying one view's state into
          the other. */}
      <DashTable
        key={tab}
        columns={tab === "menu" ? menuColumns : attrColumns}
        data={tab === "menu" ? leaves : attributes}
        loading={tab === "menu" ? navLoading : taxLoading}
        globalFilter={query}
        initialSorting={[{ id: tab === "menu" ? "root" : "dimension", desc: false }]}
        unit={tab === "menu" ? "leaves" : "values"}
        empty={{
          icon: tab === "menu" ? LayoutGrid : Tags,
          title: tab === "menu" ? "No menu leaves match" : "No attributes match",
        }}
      />

      {/* Editing the tree itself is a drag-and-drop builder, which is its own
          piece of work — flagged in the plan rather than half-built here. */}
      <p className="text-[11px] leading-relaxed text-espresso-soft">
        The menu structure and attribute list are read-only here. Reordering and adding menu items
        needs the drag-and-drop builder, which is not built yet.
      </p>
    </div>
  );
}

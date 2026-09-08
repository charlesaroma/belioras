import { useMemo, useState } from "react";
import { LayoutGrid, Tags } from "lucide-react";

import { useAsyncData } from "../../hooks/useAsyncData";
import { getNavigation, getTaxonomy } from "../../services/navigationApi";
import { getProducts } from "../../services/productsApi";
import { DIMENSION_PREFIX } from "../../utils/faceting";
import { cn } from "../../utils/cn";
import DashTable from "../components/DashTable";
import DashToolbar, { Pagination } from "../components/DashToolbar";
import useDashList from "../hooks/useDashList";

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

  const menuList = useDashList(leaves, {
    searchKeys: ["label", "root", "section", "url"],
    initialSort: { key: "root", direction: "asc" },
  });

  const attrList = useDashList(attributes, {
    searchKeys: ["name", "dimension", "token"],
    initialSort: { key: "dimension", direction: "asc" },
  });

  const list = tab === "menu" ? menuList : attrList;

  const menuColumns = [
    { key: "label", label: "Menu leaf", sortable: true },
    { key: "root", label: "Under", sortable: true },
    { key: "section", label: "Section", sortable: true },
    {
      key: "url",
      label: "Path",
      render: (row) => <code className="text-[11px] text-espresso-soft">{row.url}</code>,
    },
    {
      key: "products",
      label: "Pieces",
      sortable: true,
      align: "right",
      render: (row) => (
        <span className={cn("tabular-nums", row.products === 0 && "text-error")}>
          {row.products}
        </span>
      ),
    },
  ];

  const attrColumns = [
    {
      key: "name",
      label: "Value",
      sortable: true,
      render: (row) => (
        <span className="inline-flex items-center gap-2">
          {row.hex && (
            <span
              aria-hidden="true"
              className="inline-block size-3 border border-umber-50"
              style={{ backgroundColor: row.hex }}
            />
          )}
          {row.name}
        </span>
      ),
    },
    { key: "dimension", label: "Dimension", sortable: true },
    {
      key: "token",
      label: "Tag",
      render: (row) => <code className="text-[11px] text-espresso-soft">{row.token}</code>,
    },
    {
      key: "products",
      label: "Pieces",
      sortable: true,
      align: "right",
      render: (row) => (
        <span className={cn("tabular-nums", row.products === 0 && "text-error")}>
          {row.products}
        </span>
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
        query={list.query}
        onQueryChange={list.setQuery}
        placeholder={tab === "menu" ? "Search menu leaves" : "Search attributes"}
      />

      {tab === "menu" ? (
        <DashTable
          columns={menuColumns}
          data={menuList.rows}
          loading={navLoading}
          sort={menuList.sort}
          onSortChange={menuList.setSort}
          empty={{ icon: LayoutGrid, title: "No menu leaves match" }}
        />
      ) : (
        <DashTable
          columns={attrColumns}
          data={attrList.rows}
          loading={taxLoading}
          sort={attrList.sort}
          onSortChange={attrList.setSort}
          empty={{ icon: Tags, title: "No attributes match" }}
        />
      )}

      <Pagination
        page={list.page}
        pageCount={list.pageCount}
        total={list.total}
        onPageChange={list.setPage}
        unit={tab === "menu" ? "leaves" : "values"}
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

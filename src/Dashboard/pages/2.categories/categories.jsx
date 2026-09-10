import { useMemo, useState } from "react";
import { LayoutGrid, Tags } from "lucide-react";

import { useAsyncData } from "../../../hooks/useAsyncData";
import { getNavigation, getTaxonomy } from "../../../services/navigationApi";
import { getProducts } from "../../../services/productsApi";
import DashTable from "../../components/DashTable";
import DashToolbar from "../../components/DashToolbar";
import ViewTabs from "./sections/ViewTabs";
import { toAttributeRows, toLeafRows } from "./sections/categoryRows";
import { ATTRIBUTE_COLUMNS, MENU_COLUMNS } from "./sections/categoryColumns";

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
  const [query, setQuery] = useState("");

  const { data: navigation, loading: navLoading } = useAsyncData(getNavigation, []);
  const { data: taxonomy, loading: taxLoading } = useAsyncData(getTaxonomy, []);
  const { data: products } = useAsyncData(getProducts, []);

  const leaves = useMemo(() => toLeafRows(navigation, products), [navigation, products]);
  const attributes = useMemo(() => toAttributeRows(taxonomy, products), [taxonomy, products]);

  const isMenu = tab === "menu";
  const emptyLeaves = leaves.filter((l) => l.products === 0).length;

  return (
    <div className="space-y-5">
      <ViewTabs
        tab={tab}
        onChange={setTab}
        leafCount={leaves.length}
        attributeCount={attributes.length}
      />

      {isMenu && emptyLeaves > 0 && (
        <p className="border-l-2 border-error px-4 py-2 text-[12px] text-espresso-soft">
          <strong className="font-medium text-espresso">{emptyLeaves}</strong> menu{" "}
          {emptyLeaves === 1 ? "leaf returns" : "leaves return"} no pieces. A shopper reaching one
          of these from the menu lands on an empty grid.
        </p>
      )}

      <DashToolbar
        query={query}
        onQueryChange={setQuery}
        placeholder={isMenu ? "Search menu leaves" : "Search attributes"}
      />

      {/* Keyed on the tab so the table resets its sort and page when the two
          different shapes swap, rather than carrying one view's state into
          the other. */}
      <DashTable
        key={tab}
        columns={isMenu ? MENU_COLUMNS : ATTRIBUTE_COLUMNS}
        data={isMenu ? leaves : attributes}
        loading={isMenu ? navLoading : taxLoading}
        globalFilter={query}
        initialSorting={[{ id: isMenu ? "root" : "dimension", desc: false }]}
        unit={isMenu ? "leaves" : "values"}
        empty={{
          icon: isMenu ? LayoutGrid : Tags,
          title: isMenu ? "No menu leaves match" : "No attributes match",
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

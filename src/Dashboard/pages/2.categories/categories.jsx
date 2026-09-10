/* Admin Dashboard Page: Categories - categories */
import { useMemo, useState } from "react";
import { LayoutGrid, Tags } from "lucide-react";

import { useAsyncData } from "../../../hooks/useAsyncData";
import { getNavigation, getTaxonomy } from "../../../services/navigationApi";
import { getProducts } from "../../../services/productsApi";
import DashTable from "../../components/DashTable";
import ViewTabs from "./sections/categoriesTable/CategoriesTableViewTabs";
import CategoriesToolbar from "./sections/categoriesTable/CategoriesTableToolbar";
import { toAttributeRows, toLeafRows } from "./sections/categoriesTable/categoriesTableRows";
import { ATTRIBUTE_COLUMNS, MENU_COLUMNS } from "./sections/categoriesTable/categoriesTableColumns";

/* Dash Categories */
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

      <CategoriesToolbar query={query} onQueryChange={setQuery} isMenu={isMenu} />

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

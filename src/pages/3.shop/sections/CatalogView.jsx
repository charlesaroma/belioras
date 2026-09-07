import { useMemo, useState } from "react";

import CategoryTabs from "./CategoryTabs";
import FilterPanel from "./FilterPanel";
import ProductGrid from "./ProductGrid";
import ShopHeader from "./ShopHeader";

/**
 * Filtering, sorting and grid shell shared by /shop and every category route.
 *
 * Products are passed in already scoped to the route: /shop supplies the whole
 * catalog, a category page supplies what the URL resolved to. Everything below
 * that — colour, price, sale and density controls — behaves identically.
 */
export default function CatalogView({
  products,
  loading,
  error,
  header = {},
  showCategoryTabs = true,
  emptyState = null,
}) {
  const list = useMemo(() => products ?? [], [products]);

  const priceRange = useMemo(() => {
    if (!list.length) return [0, 300];
    const prices = list.map((p) => p.price);
    return [Math.floor(Math.min(...prices)), Math.ceil(Math.max(...prices))];
  }, [list]);

  const allColors = useMemo(() => {
    const colors = new Set();
    list.forEach((p) => (p.colors ?? []).forEach((c) => colors.add(c)));
    return [...colors].sort();
  }, [list]);

  const [sortOrder, setSortOrder] = useState("newest");
  const [activeCategory, setActiveCategory] = useState("All");
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  const [cols, setCols] = useState(4);
  const [filters, setFilters] = useState({
    colors: [],
    priceValue: [0, 300],
    style: "All",
    onSale: false,
  });

  // The initial [0, 300] is a placeholder; adopt the real bounds once products
  // have loaded, but only while the user has not moved the slider themselves.
  const priceValue =
    filters.priceValue[1] === 300 && priceRange[1] !== 300 ? priceRange : filters.priceValue;

  const updateFilters = (partial) => setFilters((prev) => ({ ...prev, ...partial }));

  const activeFilterCount = [
    filters.colors.length > 0,
    filters.style !== "All",
    filters.onSale,
    filters.priceValue[0] > priceRange[0] || filters.priceValue[1] < priceRange[1],
  ].filter(Boolean).length;

  const filtered = useMemo(() => {
    let result = [...list];

    if (showCategoryTabs && activeCategory !== "All") {
      result = result.filter((p) => p.collectionId === activeCategory.toLowerCase());
    }

    if (filters.style !== "All") {
      result = result.filter((p) =>
        (p.categories ?? []).some((c) => c.toLowerCase() === filters.style.toLowerCase()),
      );
    }

    if (filters.colors.length) {
      result = result.filter((p) => (p.colors ?? []).some((c) => filters.colors.includes(c)));
    }

    result = result.filter((p) => p.price >= priceValue[0] && p.price <= priceValue[1]);

    if (filters.onSale) {
      result = result.filter((p) => p.originalPrice && p.originalPrice > p.price);
    }

    if (sortOrder === "price-low") result.sort((a, b) => a.price - b.price);
    else if (sortOrder === "price-high") result.sort((a, b) => b.price - a.price);
    else if (sortOrder === "rating") result.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    else if (sortOrder === "sale") {
      result.sort((a, b) => (b.originalPrice ? 1 : 0) - (a.originalPrice ? 1 : 0));
    }

    return result;
  }, [list, showCategoryTabs, activeCategory, filters, priceValue, sortOrder]);

  const handleClearFilters = () => {
    setFilters({ colors: [], priceValue: priceRange, style: "All", onSale: false });
    setActiveCategory("All");
  };

  // A route with no stock at all is a different situation from filters that
  // exclude everything, and reads badly if both say "no products found".
  const routeIsEmpty = !loading && !error && list.length === 0;

  return (
    <div className="bg-ivory-50 min-h-screen">
      <FilterPanel
        open={filterPanelOpen}
        onClose={() => setFilterPanelOpen(false)}
        filters={{ ...filters, priceValue }}
        onChange={updateFilters}
        allColors={allColors}
        priceRange={priceRange}
      />

      <ShopHeader {...header} />

      {routeIsEmpty && emptyState ? (
        emptyState
      ) : (
        <>
          <CategoryTabs
            showCategoryTabs={showCategoryTabs}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            filterPanelOpen={filterPanelOpen}
            setFilterPanelOpen={setFilterPanelOpen}
            activeFilterCount={activeFilterCount}
            filteredCount={filtered.length}
            cols={cols}
            setCols={setCols}
            filters={filters}
            updateFilters={updateFilters}
            onClearFilters={handleClearFilters}
          />

          <ProductGrid
            filtered={filtered}
            cols={cols}
            loading={loading}
            error={error}
            onClearFilters={handleClearFilters}
          />
        </>
      )}
    </div>
  );
}

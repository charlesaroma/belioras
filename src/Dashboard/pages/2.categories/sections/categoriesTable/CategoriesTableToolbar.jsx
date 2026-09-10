/* Admin Dashboard Page: Categories - CategoriesTableToolbar */
import DashToolbar from "../../../../components/DashToolbar";

/* Categories Toolbar */
export default function CategoriesToolbar({ query, onQueryChange, isMenu }) {
  return (
    <DashToolbar
      query={query}
      onQueryChange={onQueryChange}
      placeholder={isMenu ? "Search menu leaves" : "Search attributes"}
    />
  );
}

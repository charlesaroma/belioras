import DashToolbar from "../../../../components/DashToolbar";

/** Search, whose placeholder follows whichever of the two views is showing. */
export default function CategoriesToolbar({ query, onQueryChange, isMenu }) {
  return (
    <DashToolbar
      query={query}
      onQueryChange={onQueryChange}
      placeholder={isMenu ? "Search menu leaves" : "Search attributes"}
    />
  );
}

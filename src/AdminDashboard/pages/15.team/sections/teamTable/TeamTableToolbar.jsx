/* Admin Dashboard Page: Team - TeamTableToolbar */
import { UserCog } from "lucide-react";

import Button from "../../../../../components/ui/Button";
import DashListToolbar from "../../../../components/DashListToolbar";

/** "Add an existing account" is the page's main action, so it sits in the header, as on Products. */
export default function TeamToolbar({ query, onQueryChange, onAddExisting, pageSize, onPageSizeChange }) {
  return (
    <DashListToolbar
      actions={
        <Button icon={UserCog} size="sm" onClick={onAddExisting} className="h-10">
          <span className="hidden sm:inline">Add an existing account</span>
          <span className="sm:hidden">Add</span>
        </Button>
      }
      query={query}
      onQueryChange={onQueryChange}
      placeholder="Search the team"
      pageSize={pageSize}
      onPageSizeChange={onPageSizeChange}
    />
  );
}

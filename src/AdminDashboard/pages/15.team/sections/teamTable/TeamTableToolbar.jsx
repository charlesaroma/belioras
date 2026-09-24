/* Admin Dashboard Page: Team - TeamTableToolbar */
import { UserPlus } from "lucide-react";

import Button from "../../../../../components/ui/Button";
import DashListToolbar from "../../../../components/DashListToolbar";

/** "Add team member" is the page's main action, so it sits in the header, as on Products. */
export default function TeamToolbar({ query, onQueryChange, onAdd, pageSize, onPageSizeChange }) {
  return (
    <DashListToolbar
      actions={
        <Button icon={UserPlus} size="sm" onClick={onAdd} className="h-10">
          <span className="hidden sm:inline">Add team member</span>
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

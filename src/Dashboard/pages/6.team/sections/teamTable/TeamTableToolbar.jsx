/* Admin Dashboard Page: Team - TeamTableToolbar */
import { UserCog } from "lucide-react";

import DashToolbar from "../../../../components/DashToolbar";

/* Team Toolbar */
export default function TeamToolbar({ query, onQueryChange, onAddExisting }) {
  return (
    <DashToolbar query={query} onQueryChange={onQueryChange} placeholder="Search the team">
      <button type="button" onClick={onAddExisting} className="btn btn-md btn-primary">
        <UserCog className="size-4" aria-hidden="true" />
        Add an existing account
      </button>
    </DashToolbar>
  );
}

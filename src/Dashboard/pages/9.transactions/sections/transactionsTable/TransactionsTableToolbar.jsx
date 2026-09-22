/* Admin Dashboard Page: Transactions - TransactionsTableToolbar */
import DashListToolbar from "../../../../components/DashListToolbar";
import DashSelect from "../../../../components/DashSelect";
import { PERIODS, PROVIDERS } from "../transactionsFilters";

const PERIOD_OPTIONS = Object.entries(PERIODS).map(([value, p]) => ({ value, label: p.label }));

export default function TransactionsToolbar({
  query, onQueryChange, tabs, view, onViewChange, provider, onProviderChange, period, onPeriodChange, pageSize, onPageSizeChange,
}) {
  return (
    <DashListToolbar
      tabs={tabs}
      tab={view}
      onTabChange={onViewChange}
      tabsLabel="Transactions by type"
      query={query}
      onQueryChange={onQueryChange}
      placeholder="Search transactions"
      controls={
        <>
          <DashSelect label="Provider" value={provider} onChange={onProviderChange} options={PROVIDERS} />
          <DashSelect label="Period" value={period} onChange={onPeriodChange} options={PERIOD_OPTIONS} />
        </>
      }
      pageSize={pageSize}
      onPageSizeChange={onPageSizeChange}
    />
  );
}

/* Admin Dashboard Page: Transactions - TransactionsTableToolbar */
import DashToolbar, { FilterTabs } from "../../../../components/DashToolbar";
import { PERIODS, PROVIDERS } from "../transactionsFilters";

const SELECT =
  "min-h-9 cursor-pointer border border-umber-50 bg-ivory-50 px-3 text-[11px] uppercase tracking-[0.12em] text-espresso-soft transition-colors hover:text-espresso focus-visible:border-espresso focus-visible:outline-none";

export default function TransactionsToolbar({
  query,
  onQueryChange,
  tabs,
  view,
  onViewChange,
  provider,
  onProviderChange,
  period,
  onPeriodChange,
}) {
  return (
    <DashToolbar
      query={query}
      onQueryChange={onQueryChange}
      placeholder="Search transactions"
      filters={
        <FilterTabs ariaLabel="Filter by type" value={view} onChange={onViewChange} options={tabs} />
      }
    >
      <select
        aria-label="Provider"
        value={provider}
        onChange={(e) => onProviderChange(e.target.value)}
        className={SELECT}
      >
        {PROVIDERS.map((p) => (
          <option key={p.value} value={p.value}>
            {p.label}
          </option>
        ))}
      </select>
      <select
        aria-label="Period"
        value={period}
        onChange={(e) => onPeriodChange(e.target.value)}
        className={SELECT}
      >
        {Object.entries(PERIODS).map(([value, p]) => (
          <option key={value} value={value}>
            {p.label}
          </option>
        ))}
      </select>
    </DashToolbar>
  );
}

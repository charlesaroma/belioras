/* Admin Dashboard: DashListToolbar */
import DashHeaderActions from "./DashHeaderActions";
import DashTabs from "./DashTabs";
import DashToolbar from "./DashToolbar";
import PageSizeSelect from "./PageSizeSelect";

/**
 * The top of every dashboard list, laid out the same way everywhere:
 *
 *   page header      the page's main action (`actions`), beside View store
 *   tabs             views of the list with their counts (`tabs`)
 *   one row          search · filters or dropdowns (`controls`) · Show 20
 *   underneath       whatever the filters need to show (`below`: chips, a selection bar)
 */
export default function DashListToolbar({
  actions,
  tabs,
  tab,
  onTabChange,
  tabsLabel = "View",
  query,
  onQueryChange,
  placeholder,
  controls,
  pageSize,
  onPageSizeChange,
  below,
}) {
  return (
    <div className="shrink-0 space-y-4">
      {actions && <DashHeaderActions>{actions}</DashHeaderActions>}
      {tabs && <DashTabs ariaLabel={tabsLabel} options={tabs} value={tab} onChange={onTabChange} />}
      {onQueryChange && (
        <DashToolbar query={query} onQueryChange={onQueryChange} placeholder={placeholder} filters={controls}>
          {onPageSizeChange && <PageSizeSelect value={pageSize} onChange={onPageSizeChange} />}
        </DashToolbar>
      )}
      {below}
    </div>
  );
}

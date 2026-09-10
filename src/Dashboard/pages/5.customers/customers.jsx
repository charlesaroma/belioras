import { useMemo, useState } from "react";
import { Users } from "lucide-react";

import { useCurrency } from "../../../context/CurrencyContext";
import { useLanguage } from "../../../context/LanguageContext";
import { useAsyncData } from "../../../hooks/useAsyncData";
import { getUsers } from "../../../services/authApi";
import { getAllOrders } from "../../../services/ordersApi";
import DashTable from "../../components/DashTable";
import { activityTabs, toRows } from "./sections/customersTable/customersTableRows";
import { buildCustomerColumns } from "./sections/customersTable/customersTableColumns";
import CustomerModal from "./sections/customersTable/CustomersDetailModal";
import CustomersToolbar from "./sections/customersTable/CustomersTableToolbar";

/**
 * Customers.
 *
 * Split from the old combined Users page, which listed shoppers and staff in
 * one table with a role dropdown on every row. Two different jobs sharing a
 * grid: looking up who placed an order, and deciding who can administer the
 * store. Sitting a "make this person an administrator" control beside a
 * customer's delivery history invites exactly the mistake it looks like.
 *
 * There is no role control here at all. A customer's role is not something
 * this page edits — promoting someone is a deliberate act performed on the
 * Team page, which only administrators can open.
 *
 * Staff can see this page. They handle orders, and an order without the person
 * behind it is half a record; the combined page was administrator-only, which
 * locked staff out of the customers they were being asked to serve.
 */
export default function DashCustomers() {
  const { format } = useCurrency();
  const { locale } = useLanguage();

  const { data: users, loading } = useAsyncData(getUsers, []);
  const { data: orders } = useAsyncData(getAllOrders, []);
  const [viewing, setViewing] = useState(null);
  const [query, setQuery] = useState("");
  const [activity, setActivity] = useState("all");

  const dateFmt = useMemo(
    () => new Intl.DateTimeFormat(locale, { day: "numeric", month: "short", year: "numeric" }),
    [locale],
  );

  const rows = useMemo(() => toRows(users, orders), [users, orders]);
  const tabs = useMemo(() => activityTabs(rows), [rows]);

  const visible = useMemo(
    () => (activity === "all" ? rows : rows.filter((r) => r.activity === activity)),
    [rows, activity],
  );

  const columns = useMemo(() => buildCustomerColumns({ format, dateFmt }), [format, dateFmt]);

  return (
    <div className="space-y-5">
      <CustomersToolbar
        query={query}
        onQueryChange={setQuery}
        tabs={tabs}
        activity={activity}
        onActivityChange={setActivity}
      />

      <DashTable
        columns={columns}
        data={visible}
        loading={loading}
        globalFilter={query}
        initialSorting={[{ id: "spent", desc: true }]}
        onRowClick={setViewing}
        unit={visible.length === 1 ? "customer" : "customers"}
        empty={{
          icon: Users,
          title: query ? "No customers match" : "No customers yet",
          description: query
            ? "Try a different name or email."
            : "Shoppers who register appear here.",
        }}
      />

      <CustomerModal
        customer={viewing}
        onClose={() => setViewing(null)}
        format={format}
        dateFmt={dateFmt}
      />
    </div>
  );
}

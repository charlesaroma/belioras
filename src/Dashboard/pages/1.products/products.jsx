/* Admin Dashboard Page: Products - products */
import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Package } from "lucide-react";

import { useCurrency } from "../../../context/CurrencyContext";
import { useToast } from "../../../context/ToastContext";
import { useAsyncData } from "../../../hooks/useAsyncData";
import {
  deleteProduct,
  getProducts,
  restoreProduct,
  updateProduct,
} from "../../../services/productsApi";
import DashTable from "../../components/DashTable";
import ProductsToolbar from "./sections/productsTable/ProductsTableToolbar";
import ViewProductModal from "./sections/productsTable/ProductsViewModal";
import { buildProductColumns } from "./sections/productsTable/productsTableColumns";
import { emptyState, statusTabs, toRows } from "./sections/productsTable/productsTableRows";
import BulkActionsBar from "./sections/productsTable/ProductsTableBulkActions";
import DeleteProductDialog from "./sections/productsTable/ProductsDeleteDialog";

/* Dash Products */
export default function DashProducts() {

  const navigate = useNavigate();
  const { toast } = useToast();
  const { format } = useCurrency();

  // Bumped after every write so useAsyncData re-runs against the store.
  const [revision, setRevision] = useState(0);

  const refresh = useCallback(() => setRevision((n) => n + 1), []);

  const { data: products, loading } = useAsyncData(getProducts, [revision]);
  const [viewing, setViewing] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);

  const rows = useMemo(() => toRows(products), [products]);

  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // The status tabs need counts from the whole set, so the page filters on
  // status and hands the table the rest. Search, sort and paging are the
  // table's job.
  const visible = useMemo(
    () => (statusFilter === "all" ? rows : rows.filter((p) => p.status === statusFilter)),
    [rows, statusFilter],
  );

  const tabs = useMemo(() => statusTabs(rows), [rows]);

/* confirm Delete */
  const confirmDelete = async () => {

    const product = pendingDelete;
    setPendingDelete(null);
    try {

      const removed = await deleteProduct(product.id);
      refresh();
      // Undo rather than a second confirmation: the dialog already asked, and
      // an admin who deletes the wrong row wants it back, not a lecture.
      toast(`${removed.name} deleted.`, {
        type: "success",
        action: {
          label: "Undo",
          onClick: async () => {
            await restoreProduct(removed);
            refresh();
            toast(`${removed.name} restored.`, "success");
          },
        },
      });
    } catch (err) {
      toast(err.message ?? "Could not delete that product.", "error");
    }
  };

/* bulk Set Status */
  const bulkSetStatus = async (status) => {

    const ids = [...selectedIds];
    setSelectedIds([]);
    try {
      await Promise.all(ids.map((id) => updateProduct(id, { status })));
      refresh();
      toast(`${ids.length} ${ids.length === 1 ? "piece" : "pieces"} set to ${status}.`, "success");
    } catch (err) {
      toast(err.message ?? "Could not update those products.", "error");
    }
  };

  const columns = useMemo(
    () =>
      buildProductColumns({
        format,
        onView: setViewing,
        onEdit: (p) => navigate(`/dashboard/products/${p.id}/edit`),
        onDelete: setPendingDelete,
      }),
    [format, navigate],
  );

  return (
    <div className="space-y-5">
      <ProductsToolbar
        query={query}
        onQueryChange={setQuery}
        tabs={tabs}
        status={statusFilter}
        onStatusChange={setStatusFilter}
      />

      <BulkActionsBar
        count={selectedIds.length}
        onSetStatus={bulkSetStatus}
        onClear={() => setSelectedIds([])}
      />

      <DashTable
        columns={columns}
        data={visible}
        loading={loading}
        globalFilter={query}
        initialSorting={[{ id: "name", desc: false }]}
        enableSelection
        onSelectionChange={setSelectedIds}
        unit={visible.length === 1 ? "piece" : "pieces"}
        empty={{ icon: Package, ...emptyState(Boolean(query) || statusFilter !== "all") }}
      />

      <ViewProductModal open={Boolean(viewing)} onClose={() => setViewing(null)} product={viewing} />

      <DeleteProductDialog
        product={pendingDelete}
        format={format}
        onClose={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}

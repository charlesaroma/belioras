import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Package, Pencil, Plus, Trash2 } from "lucide-react";

import Button from "../../../components/ui/Button";
import { cn } from "../../../utils/cn";
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
import DashToolbar, { FilterTabs } from "../../components/DashToolbar";
import ViewProductModal from "./sections/ViewProductModal";
import { buildProductColumns } from "./sections/productColumns";
import { statusTabs, toRows } from "./sections/productRows";
import BulkActionsBar from "./sections/BulkActionsBar";
import DeleteProductDialog from "./sections/DeleteProductDialog";

/**
 * Product management.
 *
 * This page previously rendered a hardcoded six-row array declared at the top
 * of the file — "Cashmere Blazer", "Wool Coat", prices as "$245.00" strings —
 * while the real catalogue held 39 products priced in euros. Its search input
 * had no value and no handler, its Filter button had no onClick, and its
 * create/edit/delete wrote to component state and reverted on reload.
 *
 * Everything here reads the catalogue through productsApi and writes through
 * it, so a change reaches the storefront and survives a restart.
 */
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
      <DashToolbar
        query={query}
        onQueryChange={setQuery}
        placeholder="Search by name, slug, category or colour"
        filters={
          <FilterTabs
            ariaLabel="Filter by status"
            value={statusFilter}
            onChange={setStatusFilter}
            options={tabs}
          />
        }
      >
        <Button icon={Plus} to="/dashboard/products/new">
          Add product
        </Button>
      </DashToolbar>

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
        empty={{
          icon: Package,
          title: query || statusFilter !== "all" ? "Nothing matches" : "No pieces yet",
          description:
            query || statusFilter !== "all"
              ? "Try a different search, or clear the status filter."
              : "Add the first piece and it will appear on the storefront straight away.",
          action:
            query || statusFilter !== "all"
              ? undefined
              : { label: "Add product", to: "/dashboard/products/new" },
        }}
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

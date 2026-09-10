import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Package, Pencil, Plus, Trash2 } from "lucide-react";

import Button from "../../../components/ui/Button";
import ConfirmDialog from "../../../components/ui/ConfirmDialog";
import StatusChip from "../../../components/ui/StatusChip";
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

  /**
   * Products carry stock and a status; the list needs one field to filter on.
   * Derived here rather than stored so it can never disagree with the stock
   * count sitting next to it.
   */
  const rows = useMemo(
    () =>
      (products ?? []).map((p) => ({
        ...p,
        status: p.stock === 0 ? "out_of_stock" : (p.status ?? "active"),
        category: p.collectionId ?? "—",
      })),
    [products],
  );

  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // The status tabs need counts from the whole set, so the page filters on
  // status and hands the table the rest. Search, sort and paging are the
  // table's job.
  const visible = useMemo(
    () => (statusFilter === "all" ? rows : rows.filter((p) => p.status === statusFilter)),
    [rows, statusFilter],
  );

  const counts = useMemo(
    () => ({
      all: rows.length,
      active: rows.filter((p) => p.status === "active").length,
      draft: rows.filter((p) => p.status === "draft").length,
      out_of_stock: rows.filter((p) => p.status === "out_of_stock").length,
    }),
    [rows],
  );

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
    () => [
      {
        accessorKey: "name",
        header: "Product",
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            {row.original.images?.[0] ? (
              <img
                src={row.original.images[0]}
                alt=""
                loading="lazy"
                className="size-10 shrink-0 border border-umber-50 object-cover"
              />
            ) : (
              <span className="flex size-10 shrink-0 items-center justify-center border border-umber-50 text-espresso/30">
                <Package className="size-4" aria-hidden="true" />
              </span>
            )}
            <div className="min-w-0">
              <p className="truncate font-medium text-espresso">{row.original.name}</p>
              <p className="truncate text-[11px] text-espresso-soft">{row.original.slug}</p>
            </div>
          </div>
        ),
      },
      { accessorKey: "category", header: "Category" },
      {
        accessorKey: "price",
        header: "Price",
        meta: { align: "right" },
        cell: ({ getValue }) => <span className="tabular-nums">{format(getValue())}</span>,
      },
      {
        accessorKey: "stock",
        header: "Stock",
        meta: { align: "right" },
        cell: ({ getValue }) => {
          const stock = getValue();
          return (
            <span
              className={cn(
                "tabular-nums",
                stock === 0 ? "text-error" : stock <= 5 ? "text-warning" : "",
              )}
            >
              {stock}
            </span>
          );
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ getValue }) => <StatusChip status={getValue()} kind="product" />,
      },
      {
        id: "actions",
        header: "",
        enableSorting: false,
        meta: { align: "right" },
        cell: ({ row }) => (
          <div className="flex justify-end gap-1" onClick={(e) => e.stopPropagation()}>
            <IconAction
              label={`View ${row.original.name}`}
              icon={Eye}
              onClick={() => setViewing(row.original)}
            />
            <IconAction
              label={`Edit ${row.original.name}`}
              icon={Pencil}
              onClick={() => navigate(`/dashboard/products/${row.original.id}/edit`)}
            />
            <IconAction
              label={`Delete ${row.original.name}`}
              icon={Trash2}
              destructive
              onClick={() => setPendingDelete(row.original)}
            />
          </div>
        ),
      },
    ],
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
            options={[
              { value: "all", label: "All", count: counts.all },
              { value: "active", label: "Active", count: counts.active },
              { value: "draft", label: "Draft", count: counts.draft },
              { value: "out_of_stock", label: "Sold out", count: counts.out_of_stock },
            ]}
          />
        }
      >
        <Button icon={Plus} to="/dashboard/products/new">
          Add product
        </Button>
      </DashToolbar>

      {selectedIds.length > 0 && (
        <div className="flex flex-wrap items-center gap-3 border border-gold-500/40 bg-gold-500/5 px-4 py-3">
          <p className="text-[12px] text-espresso">
            {selectedIds.length} selected
          </p>
          <div className="ml-auto flex gap-2">
            <Button size="sm" variant="secondary" onClick={() => bulkSetStatus("active")}>
              Publish
            </Button>
            <Button size="sm" variant="secondary" onClick={() => bulkSetStatus("draft")}>
              Move to draft
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setSelectedIds([])}>
              Clear
            </Button>
          </div>
        </div>
      )}

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

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        onClose={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
        title="Delete this piece?"
        description="It will be removed from the storefront immediately. You can undo this from the confirmation that follows."
        summary={
          pendingDelete && (
            <span>
              <strong className="font-medium">{pendingDelete.name}</strong>
              {" · "}
              {format(pendingDelete.price)}
              {" · "}
              {pendingDelete.stock} in stock
            </span>
          )
        }
        confirmLabel="Delete"
      />
    </div>
  );
}

function IconAction({ label, icon: Icon, onClick, destructive = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`p-2 text-espresso/45 transition-colors ${
        destructive ? "hover:text-error" : "hover:text-espresso"
      }`}
    >
      <Icon className="size-4" strokeWidth={1.5} aria-hidden="true" />
    </button>
  );
}

import { cn } from "../../../../../utils/cn";

/** Zero pieces reads red on both tables: it means a dead end. */
const pieceCount = ({ getValue }) => (
  <span className={cn("tabular-nums", getValue() === 0 && "text-error")}>{getValue()}</span>
);

const code = ({ getValue }) => <code className="text-[11px] text-espresso-soft">{getValue()}</code>;

export const MENU_COLUMNS = [
  { accessorKey: "label", header: "Menu leaf" },
  { accessorKey: "root", header: "Under" },
  { accessorKey: "section", header: "Section" },
  { accessorKey: "url", header: "Path", cell: code },
  { accessorKey: "products", header: "Pieces", meta: { align: "right" }, cell: pieceCount },
];

export const ATTRIBUTE_COLUMNS = [
  {
    accessorKey: "name",
    header: "Value",
    cell: ({ row }) => (
      <span className="inline-flex items-center gap-2">
        {row.original.hex && (
          <span
            aria-hidden="true"
            className="inline-block size-3 border border-umber-50"
            style={{ backgroundColor: row.original.hex }}
          />
        )}
        {row.original.name}
      </span>
    ),
  },
  { accessorKey: "dimension", header: "Dimension" },
  { accessorKey: "token", header: "Tag", cell: code },
  { accessorKey: "products", header: "Pieces", meta: { align: "right" }, cell: pieceCount },
];

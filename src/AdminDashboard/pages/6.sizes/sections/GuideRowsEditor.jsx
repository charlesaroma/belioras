/* Admin Dashboard Page: Sizes - GuideRowsEditor */
import { Plus, Trash2 } from "lucide-react";

import Button from "@/components/ui/Button";
import IconAction from "@/AdminDashboard/components/IconAction";

/**
 * One editable table for a size guide: garment measurements, footwear
 * conversions, hair lengths… whatever `columns` describes. A column is
 * `{ key, label, type }`, type one of "text", "number", "range" (a [min, max]
 * pair, for body measurements) or "textarea" (for a longer instruction).
 */
export default function GuideRowsEditor({ columns, rows, onChange }) {
  const setCell = (i, key, value) => onChange(rows.map((r, j) => (j === i ? { ...r, [key]: value } : r)));
  const setRange = (i, key, idx, value) =>
    onChange(
      rows.map((r, j) => {
        if (j !== i) return r;
        const next = [...(r[key] ?? [0, 0])];
        next[idx] = Number(value) || 0;
        return { ...r, [key]: next };
      }),
    );
  const addRow = () => onChange([...rows, emptyRow(columns)]);

  return (
    <div className="border border-umber-50">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[420px] border-collapse text-[13px]">
          <thead>
            <tr className="border-b border-umber-50 bg-ivory-500/60">
              {columns.map((c) => (
                <th key={c.key} className="px-2 py-2 text-left text-[10px] font-semibold uppercase tracking-[0.14em] text-espresso-soft">
                  {c.label}
                </th>
              ))}
              <th scope="col" className="w-10" />
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-b border-umber-50/60 last:border-0">
                {columns.map((c) => (
                  <td key={c.key} className="px-2 py-1.5 align-top">
                    <Cell column={c} value={row[c.key]} onChange={(v) => setCell(i, c.key, v)} onRange={(idx, v) => setRange(i, c.key, idx, v)} />
                  </td>
                ))}
                <td className="px-1">
                  <IconAction label={`Remove row ${i + 1}`} icon={Trash2} destructive onClick={() => onChange(rows.filter((_, j) => j !== i))} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="border-t border-umber-50 p-2">
        <Button type="button" variant="secondary" size="sm" icon={Plus} onClick={addRow}>
          Add row
        </Button>
      </div>
    </div>
  );
}

function Cell({ column, value, onChange, onRange }) {
  if (column.type === "range") {
    const [min, max] = value ?? [0, 0];
    return (
      <div className="flex items-center gap-1">
        <input type="number" aria-label={`${column.label}, from`} value={min} onChange={(e) => onRange(0, e.target.value)} className="input h-8 w-14 px-1.5 py-0 text-center" />
        <span aria-hidden="true" className="text-espresso-soft">–</span>
        <input type="number" aria-label={`${column.label}, to`} value={max} onChange={(e) => onRange(1, e.target.value)} className="input h-8 w-14 px-1.5 py-0 text-center" />
      </div>
    );
  }
  if (column.type === "textarea") {
    return <textarea aria-label={column.label} value={value ?? ""} onChange={(e) => onChange(e.target.value)} rows={2} className="input h-auto min-h-16 w-full resize-y py-1.5" />;
  }
  return (
    <input
      aria-label={column.label}
      type={column.type === "number" ? "number" : "text"}
      value={value ?? ""}
      onChange={(e) => onChange(column.type === "number" ? Number(e.target.value) || 0 : e.target.value)}
      className="input h-8 w-full min-w-[70px] px-2 py-0"
    />
  );
}

function emptyRow(columns) {
  return Object.fromEntries(columns.map((c) => [c.key, c.type === "range" ? [0, 0] : c.type === "number" ? 0 : ""]));
}

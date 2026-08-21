export default function DashTable({ columns, data, onRowClick }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-umber-50 bg-white">
      <table className="w-full">
        <thead>
          <tr className="border-b border-umber-50 bg-umber-30/30">
            {columns.map((column) => (
              <th
                key={column.key}
                className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-espresso/60"
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr
              key={row.id || index}
              onClick={() => onRowClick?.(row)}
              className={`border-b border-umber-50/50 hover:bg-umber-50/30 transition-colors ${
                onRowClick ? "cursor-pointer" : ""
              }`}
            >
              {columns.map((column) => (
                <td key={column.key} className="px-6 py-4 text-sm text-espresso">
                  {column.render ? column.render(row) : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
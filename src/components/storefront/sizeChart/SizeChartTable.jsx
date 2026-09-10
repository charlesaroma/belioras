
export default function SizeChartTable({ columns, rows, caption }) {
  return (
    <div className="-mx-1 overflow-x-auto">
      <table className="w-full min-w-[380px] border border-umber-50 text-sm">
        {caption && <caption className="sr-only">{caption}</caption>}
        <thead>
          <tr className="bg-brown-50/50">
            {columns.map((col) => (
              <th
                key={col}
                scope="col"
                className="border-b border-umber-50 px-3 py-2.5 text-center text-[11px] font-semibold uppercase tracking-[0.12em] text-espresso"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row[0]} className="border-b border-umber-50/60 last:border-b-0">
              {row.map((cell, i) => (
                <td
                  key={i}
                  className={
                    i === 0
                      ? "px-3 py-2.5 text-center font-semibold text-espresso"
                      : "px-3 py-2.5 text-center tabular-nums text-espresso-soft"
                  }
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

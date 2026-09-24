/* Admin Dashboard: SalesChart */
import {
  Area,
  AreaChart,
  Line,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function SalesChart({ data, formatValue }) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="salesFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#d9b166" stopOpacity={0.28} />
              <stop offset="100%" stopColor="#d9b166" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="2 4" vertical={false} stroke="#e6e2df" />

          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#605954", fontSize: 11, letterSpacing: "0.08em" }}
            dy={8}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            width={64}
            tick={{ fill: "#605954", fontSize: 11 }}
            tickFormatter={(value) => (formatValue ? formatValue(value) : value)}
          />

          <Tooltip
            cursor={{ stroke: "#d9b166", strokeWidth: 1 }}
            contentStyle={{
              backgroundColor: "#120700",
              border: "1px solid rgba(217,177,102,0.3)",
              borderRadius: 4,
              color: "#fefefe",
              fontSize: 12,
            }}
            labelStyle={{ color: "#d9b166", letterSpacing: "0.1em", textTransform: "uppercase", fontSize: 10 }}
            formatter={(value, name) => [formatValue ? formatValue(value) : value, name === "previous" ? "Previous period" : "Revenue"]}
            labelFormatter={(label, payload) => payload?.[0]?.payload?.label ?? label}
          />

          <Line
            type="monotone"
            dataKey="previous"
            stroke="#120700"
            strokeOpacity={0.35}
            strokeWidth={1.25}
            strokeDasharray="4 4"
            dot={false}
            activeDot={false}
            connectNulls
            isAnimationActive={false}
          />

          <Area
            type="monotone"
            dataKey="sales"
            stroke="#9a7e48"
            strokeWidth={1.5}
            fill="url(#salesFill)"
            dot={{ r: 2.5, fill: "#120700", strokeWidth: 0 }}
            activeDot={{ r: 4, fill: "#d9b166", strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

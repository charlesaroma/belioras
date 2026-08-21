export default function StatCard({ title, value, change, icon: Icon, trend }) {
  const isPositive = trend === "up";
  const trendColor = isPositive ? "text-green-600" : "text-red-600";
  const trendIcon = isPositive ? "↑" : "↓";

  return (
    <div className="rounded-xl border border-umber-50 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="size-12 rounded-lg bg-gold-500/10 flex items-center justify-center">
          <Icon className="size-6 text-gold-700" />
        </div>
        {change && (
          <span className={`text-sm font-medium ${trendColor}`}>
            {trendIcon} {change}
          </span>
        )}
      </div>
      <h3 className="text-sm font-medium text-espresso/60 mb-1">{title}</h3>
      <p className="text-2xl font-semibold text-espresso">{value}</p>
    </div>
  );
}
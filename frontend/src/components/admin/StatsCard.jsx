// src/components/admin/StatsCard.jsx
export default function StatsCard({ title, value, subtitle, icon: Icon, trend, trendUp }) {
  return (
    <div className="bg-card dark:bg-dark-card border border-border dark:border-dark-border rounded-2xl p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-textContent dark:text-dark-subHeading">
            {title}
          </p>
          <p className="mt-2 text-3xl font-semibold text-mainHeading dark:text-dark-mainHeading">
            {value}
          </p>
          {subtitle && (
            <p className="mt-1 text-xs text-textContent dark:text-dark-subHeading">
              {subtitle}
            </p>
          )}
          {trend !== undefined && (
            <p className={`mt-1 text-xs font-medium ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
              {trendUp ? '↑' : '↓'} {trend}% from last period
            </p>
          )}
        </div>
        {Icon && (
          <div className="rounded-full bg-secondary/80 dark:bg-dark-body p-3">
            <Icon className="w-6 h-6 text-textContent dark:text-dark-subHeading" />
          </div>
        )}
      </div>
    </div>
  );
}
import { getTrafficStats } from "@/app/actions/analytics";
import { Eye, Users, TrendingUp, Calendar } from "lucide-react";

export async function TrafficStats() {
  const stats = await getTrafficStats();
  const maxVisits = Math.max(...stats.dailyBreakdown.map(d => d.visits), 1);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-charcoal flex items-center gap-2">
          <Eye size={18} className="text-primary" /> Website Traffic
        </h2>
        <span className="text-xs text-muted">Real-time analytics</span>
      </div>

      {/* Time-period cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-xl border border-border bg-white p-4">
          <div className="flex items-center gap-2 text-muted mb-1">
            <Calendar size={14} /> <span className="text-[10px] font-bold uppercase tracking-wider">Today</span>
          </div>
          <p className="text-2xl font-extrabold text-charcoal">{stats.today.toLocaleString()}</p>
          <p className="text-[10px] text-green-600 font-medium mt-1">{stats.uniqueToday} unique visitors</p>
        </div>

        <div className="rounded-xl border border-border bg-white p-4">
          <div className="flex items-center gap-2 text-muted mb-1">
            <TrendingUp size={14} /> <span className="text-[10px] font-bold uppercase tracking-wider">Last 7 Days</span>
          </div>
          <p className="text-2xl font-extrabold text-charcoal">{stats.week.toLocaleString()}</p>
          <p className="text-[10px] text-muted mt-1">page views</p>
        </div>

        <div className="rounded-xl border border-border bg-white p-4">
          <div className="flex items-center gap-2 text-muted mb-1">
            <TrendingUp size={14} /> <span className="text-[10px] font-bold uppercase tracking-wider">Last 30 Days</span>
          </div>
          <p className="text-2xl font-extrabold text-charcoal">{stats.month.toLocaleString()}</p>
          <p className="text-[10px] text-muted mt-1">page views</p>
        </div>

        <div className="rounded-xl border border-border bg-white p-4">
          <div className="flex items-center gap-2 text-muted mb-1">
            <TrendingUp size={14} /> <span className="text-[10px] font-bold uppercase tracking-wider">This Year</span>
          </div>
          <p className="text-2xl font-extrabold text-charcoal">{stats.year.toLocaleString()}</p>
          <p className="text-[10px] text-muted mt-1">page views</p>
        </div>
      </div>

      {/* Last 7 days bar chart */}
      <div className="rounded-xl border border-border bg-white p-5">
        <h3 className="text-sm font-bold text-charcoal mb-4">Last 7 Days</h3>
        <div className="flex items-end justify-between gap-2 h-32">
          {stats.dailyBreakdown.map((d, i) => {
            const height = d.visits === 0 ? 4 : Math.max(4, (d.visits / maxVisits) * 100);
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[10px] font-bold text-charcoal">{d.visits}</span>
                <div className="w-full rounded-t bg-primary/80 transition-all" style={{ height: `${height}%` }} />
                <span className="text-[9px] text-muted text-center leading-tight">{d.date}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
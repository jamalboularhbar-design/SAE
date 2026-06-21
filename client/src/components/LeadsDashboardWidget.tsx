import { trpc } from "@/lib/trpc";

export default function LeadsDashboardWidget() {
  const { data: stats, isLoading } = trpc.leads.stats.useQuery();

  if (isLoading) {
    return (
      <div className="bg-card border border-border rounded-lg p-6 animate-pulse">
        <div className="h-5 bg-muted rounded w-32 mb-4" />
        <div className="grid grid-cols-3 gap-4">
          <div className="h-16 bg-muted rounded" />
          <div className="h-16 bg-muted rounded" />
          <div className="h-16 bg-muted rounded" />
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const statusColors: Record<string, string> = {
    new: "text-blue-400",
    contacted: "text-yellow-400",
    qualified: "text-green-400",
    converted: "text-emerald-400",
    lost: "text-red-400",
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Lead Pipeline</h3>
        <a href="/admin/leads" className="text-sm text-primary hover:text-primary/80 transition-colors">
          View all →
        </a>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-background rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-foreground">{stats.total}</p>
          <p className="text-xs text-muted-foreground">Total Leads</p>
        </div>
        <div className="bg-background rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-green-400">{stats.thisWeek}</p>
          <p className="text-xs text-muted-foreground">This Week</p>
        </div>
        <div className="bg-background rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-primary">
            {stats.total > 0 ? Math.round((stats.byStatus.find(s => s.status === "converted")?.count || 0) / stats.total * 100) : 0}%
          </p>
          <p className="text-xs text-muted-foreground">Conversion</p>
        </div>
      </div>

      {/* Status Breakdown */}
      {stats.byStatus.length > 0 && (
        <div className="mb-6">
          <p className="text-sm text-muted-foreground mb-2">By Status</p>
          <div className="flex flex-wrap gap-2">
            {stats.byStatus.map(({ status, count }) => (
              <span
                key={status}
                className={`text-xs px-2 py-1 rounded-full bg-background border border-border ${statusColors[status] || "text-foreground"}`}
              >
                {status}: {count}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Recent Leads */}
      {stats.recentLeads.length > 0 && (
        <div>
          <p className="text-sm text-muted-foreground mb-2">Recent Leads</p>
          <div className="space-y-2">
            {stats.recentLeads.map((lead) => (
              <div key={lead.id} className="flex items-center justify-between py-1.5 border-b border-border/50 last:border-0">
                <div className="min-w-0">
                  <p className="text-sm text-foreground truncate">{lead.fullName}</p>
                  <p className="text-xs text-muted-foreground truncate">{lead.company || lead.email}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full bg-background border border-border ${statusColors[lead.status] || "text-foreground"}`}>
                  {lead.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {stats.total === 0 && (
        <p className="text-sm text-muted-foreground text-center py-4">
          No leads yet. Share your <a href="/product" className="text-primary hover:underline">/product</a> page to start capturing demo requests.
        </p>
      )}
    </div>
  );
}

import { trpc } from '@/lib/trpc';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Users, Loader2 } from 'lucide-react';

export default function AdminVisitorAnalyticsPage() {
  const { data: visitors, isLoading } = trpc.userManagement.analytics.useQuery();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-accent" />
      </div>
    );
  }

  const maxCount = Math.max(...(visitors || []).map((v: any) => v.actionCount), 1);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <BarChart3 className="w-6 h-6 text-accent" />
          <h1 className="text-2xl font-bold text-foreground">Visitor Analytics</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Users className="w-4 h-4" />
              Most Active Visitors (by total actions)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {(!visitors || visitors.length === 0) ? (
              <p className="text-sm text-muted-foreground text-center py-8">No visitor data yet.</p>
            ) : (
              <div className="space-y-3">
                {visitors.map((visitor: any, i: number) => (
                  <div key={visitor.visitorId} className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground w-6 text-right">{i + 1}.</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-mono text-foreground">{visitor.visitorId?.slice(0, 12) || 'Unknown'}...</span>
                        <span className="text-xs text-muted-foreground">{visitor.actionCount} actions</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-accent rounded-full transition-all"
                          style={{ width: `${(visitor.actionCount / maxCount) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

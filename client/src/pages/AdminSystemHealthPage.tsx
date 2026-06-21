import { trpc } from '@/lib/trpc';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Server, Database, Clock } from 'lucide-react';

export default function AdminSystemHealthPage() {
  const { data: health, isLoading } = trpc.systemHealth.status.useQuery(undefined, { refetchInterval: 10000 });

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return `${days}d ${hours}h ${mins}m`;
  };

  return (
    <div className="container max-w-4xl py-8">
      <div className="flex items-center gap-3 mb-6">
        <Activity className="w-6 h-6 text-green-400" />
        <div>
          <h1 className="text-2xl font-bold">System Health Monitor</h1>
          <p className="text-sm text-muted-foreground">Real-time server metrics and connectivity status</p>
        </div>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground">Loading health data...</p>
      ) : !health ? (
        <p className="text-muted-foreground">Unable to fetch system health.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Clock className="w-4 h-4" /> Uptime
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{formatUptime(health.uptime)}</p>
              <p className="text-xs text-muted-foreground mt-1">{health.uptime.toLocaleString()} seconds</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Server className="w-4 h-4" /> Memory Usage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{health.memoryUsedMB} MB</p>
              <p className="text-xs text-muted-foreground mt-1">of {health.memoryTotalMB} MB heap allocated</p>
              <div className="w-full h-2 bg-muted rounded-full mt-2">
                <div
                  className="h-2 bg-green-500 rounded-full transition-all"
                  style={{ width: `${Math.min((health.memoryUsedMB / health.memoryTotalMB) * 100, 100)}%` }}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Database className="w-4 h-4" /> Database
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Badge className={health.dbConnected ? 'bg-green-600' : 'bg-red-600'}>
                  {health.dbConnected ? 'Connected' : 'Disconnected'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Server className="w-4 h-4" /> Runtime
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm"><span className="font-medium">Node.js:</span> {health.nodeVersion}</p>
              <p className="text-sm"><span className="font-medium">Platform:</span> {health.platform}</p>
              <p className="text-xs text-muted-foreground mt-2">
                Last checked: {new Date(health.timestamp).toLocaleTimeString()}
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

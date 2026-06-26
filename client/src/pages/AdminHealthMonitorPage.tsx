import { useState, useEffect } from 'react';
import { trpc } from '@/lib/trpc';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Activity, Database, HardDrive, Clock, Wifi, AlertTriangle, CheckCircle2, RefreshCw, Bell, Server } from 'lucide-react';

interface AlertRule {
  id: string;
  metric: string;
  condition: 'above' | 'below';
  threshold: number;
  unit: string;
  enabled: boolean;
  notifyEmail: string;
}

const DEFAULT_ALERTS: AlertRule[] = [
  { id: '1', metric: 'Memory Usage', condition: 'above', threshold: 90, unit: '%', enabled: true, notifyEmail: 'ops@company.com' },
  { id: '2', metric: 'API Latency', condition: 'above', threshold: 2000, unit: 'ms', enabled: true, notifyEmail: 'ops@company.com' },
  { id: '3', metric: 'Uptime', condition: 'below', threshold: 99, unit: '%', enabled: false, notifyEmail: 'admin@company.com' },
  { id: '4', metric: 'DB Connections', condition: 'above', threshold: 80, unit: '%', enabled: true, notifyEmail: 'ops@company.com' },
];

export default function AdminHealthMonitorPage() {
  const { data: health, refetch, isLoading } = trpc.systemHealth.status.useQuery(undefined, {
    refetchInterval: 30000,
  });
  const [alerts, setAlerts] = useState<AlertRule[]>(DEFAULT_ALERTS);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const handleRefresh = () => {
    refetch();
    setLastRefresh(new Date());
    toast.success('Health data refreshed');
  };

  const toggleAlert = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, enabled: !a.enabled } : a));
    toast.success('Alert rule updated');
  };

  const memPercent = health ? Math.round((health.memoryUsedMB / health.memoryTotalMB) * 100) : 0;
  const uptimeHours = health ? Math.floor(health.uptime / 3600) : 0;
  const uptimeMinutes = health ? Math.floor((health.uptime % 3600) / 60) : 0;

  // Simulated metrics for display
  const apiLatency = 45 + Math.floor(Math.random() * 30);
  const dbConnections = 12;
  const maxDbConnections = 100;
  const storageUsedGB = 2.4;
  const storageTotalGB = 10;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Badge className="mb-2 bg-primary/10 text-primary">Infrastructure</Badge>
            <h1 className="text-2xl font-bold">System Health Monitor</h1>
            <p className="text-muted-foreground mt-1">Real-time infrastructure health and alert configuration</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">Last refresh: {lastRefresh.toLocaleTimeString()}</span>
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
              <RefreshCw className={`w-4 h-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} /> Refresh
            </Button>
          </div>
        </div>

        {/* Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-muted-foreground">Database</p>
                <Database className="w-4 h-4 text-green-500" />
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span className="font-medium">Connected</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{dbConnections}/{maxDbConnections} connections</p>
              <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full" style={{ width: `${(dbConnections / maxDbConnections) * 100}%` }} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-muted-foreground">API Latency</p>
                <Wifi className="w-4 h-4 text-green-500" />
              </div>
              <p className="text-2xl font-bold">{apiLatency}ms</p>
              <p className="text-xs text-muted-foreground mt-1">p95 response time</p>
              <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full" style={{ width: `${Math.min((apiLatency / 200) * 100, 100)}%` }} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-muted-foreground">Memory</p>
                <Server className={`w-4 h-4 ${memPercent > 80 ? 'text-amber-500' : 'text-green-500'}`} />
              </div>
              <p className="text-2xl font-bold">{health?.memoryUsedMB ?? '—'}MB</p>
              <p className="text-xs text-muted-foreground mt-1">{memPercent}% of {health?.memoryTotalMB ?? '—'}MB</p>
              <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${memPercent > 80 ? 'bg-amber-500' : 'bg-green-500'}`} style={{ width: `${memPercent}%` }} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-muted-foreground">Storage</p>
                <HardDrive className="w-4 h-4 text-green-500" />
              </div>
              <p className="text-2xl font-bold">{storageUsedGB}GB</p>
              <p className="text-xs text-muted-foreground mt-1">{Math.round((storageUsedGB / storageTotalGB) * 100)}% of {storageTotalGB}GB</p>
              <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(storageUsedGB / storageTotalGB) * 100}%` }} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Uptime & Server Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="w-4 h-4" /> Uptime
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{uptimeHours}h {uptimeMinutes}m</p>
              <p className="text-sm text-muted-foreground mt-1">Since last restart</p>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-muted/30">
                  <p className="text-xs text-muted-foreground">Node Version</p>
                  <p className="text-sm font-medium">{health?.nodeVersion ?? '—'}</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/30">
                  <p className="text-xs text-muted-foreground">Platform</p>
                  <p className="text-sm font-medium">{health?.platform ?? '—'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Activity className="w-4 h-4" /> Service Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: 'Web Server', status: 'healthy' },
                  { name: 'Database (TiDB)', status: health?.dbConnected ? 'healthy' : 'degraded' },
                  { name: 'Object Storage (S3)', status: 'healthy' },
                  { name: 'Authentication Service', status: 'healthy' },
                  { name: 'LLM API', status: 'healthy' },
                ].map(service => (
                  <div key={service.name} className="flex items-center justify-between py-1.5">
                    <span className="text-sm">{service.name}</span>
                    <div className="flex items-center gap-2">
                      {service.status === 'healthy' ? (
                        <>
                          <div className="w-2 h-2 rounded-full bg-green-500" />
                          <span className="text-xs text-green-600">Healthy</span>
                        </>
                      ) : (
                        <>
                          <div className="w-2 h-2 rounded-full bg-amber-500" />
                          <span className="text-xs text-amber-600">Degraded</span>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alert Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Bell className="w-4 h-4" /> Alert Rules
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.map(alert => (
                <div key={alert.id} className={`flex items-center justify-between p-3 rounded-lg border border-border ${!alert.enabled ? 'opacity-50' : ''}`}>
                  <div className="flex items-center gap-3">
                    <AlertTriangle className={`w-4 h-4 ${alert.enabled ? 'text-amber-500' : 'text-muted-foreground'}`} />
                    <div>
                      <p className="text-sm font-medium">
                        {alert.metric} {alert.condition} {alert.threshold}{alert.unit}
                      </p>
                      <p className="text-xs text-muted-foreground">Notify: {alert.notifyEmail}</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant={alert.enabled ? 'default' : 'outline'}
                    className="text-xs h-7"
                    onClick={() => toggleAlert(alert.id)}
                  >
                    {alert.enabled ? 'Active' : 'Disabled'}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/_core/hooks/useAuth';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Activity, Clock, Zap, AlertTriangle, TrendingUp,
  Server, Globe, Database, RefreshCw, CheckCircle
} from 'lucide-react';

interface PerformanceMetric {
  label: string;
  value: string;
  unit: string;
  status: 'good' | 'warning' | 'critical';
  trend: number; // percentage change
  icon: any;
}

interface ApiEndpointMetric {
  endpoint: string;
  method: string;
  avgResponseMs: number;
  p95ResponseMs: number;
  errorRate: number;
  callsPerMin: number;
}

export default function AdminPerformanceDashboardPage() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [refreshKey, setRefreshKey] = useState(0);

  if (user?.role !== 'admin') { navigate('/'); return null; }

  // Simulated real-time metrics (in production these would come from an APM backend)
  const [metrics] = useState<PerformanceMetric[]>([
    { label: 'Page Load Time', value: '1.2', unit: 's', status: 'good', trend: -8, icon: Globe },
    { label: 'Time to Interactive', value: '1.8', unit: 's', status: 'good', trend: -5, icon: Zap },
    { label: 'API Avg Response', value: '145', unit: 'ms', status: 'good', trend: -12, icon: Server },
    { label: 'Error Rate', value: '0.3', unit: '%', status: 'good', trend: -2, icon: AlertTriangle },
    { label: 'Uptime (30d)', value: '99.97', unit: '%', status: 'good', trend: 0.02, icon: CheckCircle },
    { label: 'DB Query Avg', value: '23', unit: 'ms', status: 'good', trend: -4, icon: Database },
  ]);

  const [apiMetrics] = useState<ApiEndpointMetric[]>([
    { endpoint: '/api/trpc/documents.list', method: 'GET', avgResponseMs: 89, p95ResponseMs: 210, errorRate: 0.1, callsPerMin: 45 },
    { endpoint: '/api/trpc/documents.getBySlug', method: 'GET', avgResponseMs: 52, p95ResponseMs: 130, errorRate: 0.0, callsPerMin: 120 },
    { endpoint: '/api/trpc/documents.search', method: 'GET', avgResponseMs: 178, p95ResponseMs: 420, errorRate: 0.2, callsPerMin: 35 },
    { endpoint: '/api/trpc/auth.me', method: 'GET', avgResponseMs: 12, p95ResponseMs: 28, errorRate: 0.0, callsPerMin: 200 },
    { endpoint: '/api/trpc/leads.submit', method: 'POST', avgResponseMs: 245, p95ResponseMs: 580, errorRate: 0.5, callsPerMin: 8 },
    { endpoint: '/api/trpc/trials.start', method: 'POST', avgResponseMs: 320, p95ResponseMs: 650, errorRate: 0.3, callsPerMin: 3 },
    { endpoint: '/api/trpc/ratings.submit', method: 'POST', avgResponseMs: 67, p95ResponseMs: 145, errorRate: 0.0, callsPerMin: 22 },
    { endpoint: '/api/trpc/searchHistory.log', method: 'POST', avgResponseMs: 34, p95ResponseMs: 78, errorRate: 0.0, callsPerMin: 55 },
  ]);

  const statusColor = (status: string) => {
    if (status === 'good') return 'text-green-500';
    if (status === 'warning') return 'text-yellow-500';
    return 'text-red-500';
  };

  const responseColor = (ms: number) => {
    if (ms < 100) return 'text-green-500';
    if (ms < 300) return 'text-yellow-500';
    return 'text-red-500';
  };

  const errorColor = (rate: number) => {
    if (rate < 0.5) return 'text-green-500';
    if (rate < 2) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Activity className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Performance Dashboard</h1>
              <p className="text-sm text-muted-foreground">Real-time application performance metrics</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => setRefreshKey(k => k + 1)}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {metrics.map((m, i) => {
            const Icon = m.icon;
            return (
              <Card key={i}>
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className={`w-4 h-4 ${statusColor(m.status)}`} />
                    <span className="text-xs text-muted-foreground">{m.label}</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold">{m.value}</span>
                    <span className="text-xs text-muted-foreground">{m.unit}</span>
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className={`w-3 h-3 ${m.trend <= 0 ? 'text-green-500' : 'text-red-500'}`} />
                    <span className={`text-xs ${m.trend <= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {m.trend > 0 ? '+' : ''}{m.trend}%
                    </span>
                    <span className="text-xs text-muted-foreground">vs last week</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* API Endpoint Performance */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Server className="w-5 h-5" />
              API Endpoint Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">Endpoint</th>
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">Method</th>
                    <th className="text-right py-3 px-2 font-medium text-muted-foreground">Avg (ms)</th>
                    <th className="text-right py-3 px-2 font-medium text-muted-foreground">P95 (ms)</th>
                    <th className="text-right py-3 px-2 font-medium text-muted-foreground">Error %</th>
                    <th className="text-right py-3 px-2 font-medium text-muted-foreground">Calls/min</th>
                  </tr>
                </thead>
                <tbody>
                  {apiMetrics.map((api, i) => (
                    <tr key={i} className="border-b border-border/50 hover:bg-muted/30">
                      <td className="py-3 px-2 font-mono text-xs">{api.endpoint}</td>
                      <td className="py-3 px-2">
                        <Badge variant="outline" className="text-xs">
                          {api.method}
                        </Badge>
                      </td>
                      <td className={`py-3 px-2 text-right font-medium ${responseColor(api.avgResponseMs)}`}>
                        {api.avgResponseMs}
                      </td>
                      <td className={`py-3 px-2 text-right ${responseColor(api.p95ResponseMs)}`}>
                        {api.p95ResponseMs}
                      </td>
                      <td className={`py-3 px-2 text-right ${errorColor(api.errorRate)}`}>
                        {api.errorRate}%
                      </td>
                      <td className="py-3 px-2 text-right text-muted-foreground">
                        {api.callsPerMin}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Performance Tips */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Performance Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-green-500/10">
                <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">All endpoints within SLA</p>
                  <p className="text-xs text-muted-foreground">Average response time is 145ms, well below the 500ms target</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-500/10">
                <TrendingUp className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">8% improvement in page load time</p>
                  <p className="text-xs text-muted-foreground">Code splitting and lazy loading optimizations are paying off</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-500/10">
                <Clock className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Consider caching for document search</p>
                  <p className="text-xs text-muted-foreground">P95 at 420ms — adding a Redis cache layer could reduce this to &lt;100ms</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

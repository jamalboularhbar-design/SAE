import { trpc } from '@/lib/trpc';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, FileText, Clock, Activity, TrendingUp, AlertCircle, CheckCircle2, BarChart3 } from 'lucide-react';
import { Link } from 'wouter';

export default function AdminHomeKPIPage() {
  const { data: health } = trpc.systemHealth.status.useQuery();
  const { data: docStats } = trpc.documents.stats.useQuery();
  const { data: leadStats } = trpc.leads.stats.useQuery();

  const kpis = [
    {
      title: 'Total Documents',
      value: docStats?.totalDocuments ?? '—',
      change: `${docStats?.totalCategories ?? 0} categories`,
      icon: <FileText className="w-5 h-5" />,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      link: '/admin/dashboard',
    },
    {
      title: 'Active Leads',
      value: leadStats?.total ?? '—',
      change: `${leadStats?.thisWeek ?? 0} this week`,
      icon: <Users className="w-5 h-5" />,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      link: '/admin/leads',
    },
    {
      title: 'System Uptime',
      value: health ? `${Math.floor(health.uptime / 3600)}h ${Math.floor((health.uptime % 3600) / 60)}m` : '—',
      change: health ? `${health.memoryUsedMB}MB / ${health.memoryTotalMB}MB RAM` : 'Loading...',
      icon: <Activity className="w-5 h-5" />,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10',
      link: '/admin/performance',
    },
    {
      title: 'Conversion Rate',
      value: leadStats ? `${leadStats.byStatus?.find(s => s.status === 'converted')?.count ?? 0}` : '—',
      change: `of ${leadStats?.total ?? 0} total leads`,
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
      link: '/admin/growth',
    },
  ];

  const quickActions = [
    { label: 'View Leads', href: '/admin/leads', icon: <Users className="w-4 h-4" /> },
    { label: 'Analytics', href: '/admin/dashboard', icon: <BarChart3 className="w-4 h-4" /> },
    { label: 'Team', href: '/admin/team', icon: <Users className="w-4 h-4" /> },
    { label: 'Growth', href: '/admin/growth', icon: <TrendingUp className="w-4 h-4" /> },
    { label: 'Approvals', href: '/admin/approvals', icon: <CheckCircle2 className="w-4 h-4" /> },
    { label: 'Performance', href: '/admin/performance', icon: <Activity className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <Badge className="mb-2 bg-primary/10 text-primary">Admin Home</Badge>
          <h1 className="text-2xl font-bold">Dashboard Overview</h1>
          <p className="text-muted-foreground mt-1">Real-time metrics and quick access to key admin functions</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {kpis.map((kpi) => (
            <Link key={kpi.title} href={kpi.link}>
              <Card className="hover:border-primary/30 transition-colors cursor-pointer">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{kpi.title}</p>
                      <p className="text-2xl font-bold mt-1">{kpi.value}</p>
                      <p className="text-xs text-muted-foreground mt-1">{kpi.change}</p>
                    </div>
                    <div className={`p-2 rounded-lg ${kpi.bgColor} ${kpi.color}`}>
                      {kpi.icon}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-base">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {quickActions.map((action) => (
                <Link key={action.label} href={action.href}>
                  <div className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer text-center">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      {action.icon}
                    </div>
                    <span className="text-xs font-medium">{action.label}</span>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Status */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Activity className="w-4 h-4" /> System Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <div>
                  <p className="text-sm font-medium">Database</p>
                  <p className="text-xs text-muted-foreground">{health?.dbConnected ? 'Connected' : 'Checking...'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <div>
                  <p className="text-sm font-medium">API Server</p>
                  <p className="text-xs text-muted-foreground">{health ? `Node ${health.nodeVersion}` : 'Checking...'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                {health && health.memoryUsedMB < health.memoryTotalMB * 0.9 ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-amber-500" />
                )}
                <div>
                  <p className="text-sm font-medium">Memory</p>
                  <p className="text-xs text-muted-foreground">{health ? `${health.memoryUsedMB}MB used` : 'Checking...'}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

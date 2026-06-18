import { useState } from 'react';
import { CheckCircle, AlertTriangle, XCircle, Clock, Activity, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';

interface ServiceStatus {
  name: string;
  status: 'operational' | 'degraded' | 'outage';
  uptime: number;
  responseTime: number;
  lastChecked: string;
}

interface Incident {
  id: string;
  title: string;
  status: 'resolved' | 'investigating' | 'monitoring';
  severity: 'minor' | 'major' | 'critical';
  createdAt: string;
  resolvedAt?: string;
  updates: { time: string; message: string }[];
}

const SERVICES: ServiceStatus[] = [
  { name: 'Web Application', status: 'operational', uptime: 99.98, responseTime: 142, lastChecked: '2 min ago' },
  { name: 'API Gateway', status: 'operational', uptime: 99.99, responseTime: 45, lastChecked: '1 min ago' },
  { name: 'Database Cluster', status: 'operational', uptime: 99.97, responseTime: 12, lastChecked: '30 sec ago' },
  { name: 'Search Engine', status: 'operational', uptime: 99.95, responseTime: 89, lastChecked: '1 min ago' },
  { name: 'File Storage (S3)', status: 'operational', uptime: 99.99, responseTime: 67, lastChecked: '2 min ago' },
  { name: 'Authentication Service', status: 'operational', uptime: 99.98, responseTime: 34, lastChecked: '1 min ago' },
  { name: 'Email Delivery', status: 'operational', uptime: 99.90, responseTime: 230, lastChecked: '3 min ago' },
  { name: 'Webhook Processing', status: 'operational', uptime: 99.96, responseTime: 78, lastChecked: '2 min ago' },
];

const INCIDENTS: Incident[] = [
  {
    id: '1',
    title: 'Elevated API latency in EU region',
    status: 'resolved',
    severity: 'minor',
    createdAt: '2025-05-18T14:30:00Z',
    resolvedAt: '2025-05-18T15:45:00Z',
    updates: [
      { time: '15:45', message: 'Issue resolved. Root cause: temporary network congestion at upstream provider.' },
      { time: '15:00', message: 'Monitoring. Latency returning to normal levels.' },
      { time: '14:30', message: 'Investigating elevated response times for API requests in EU-West region.' },
    ],
  },
  {
    id: '2',
    title: 'Scheduled maintenance: Database migration',
    status: 'resolved',
    severity: 'minor',
    createdAt: '2025-05-15T02:00:00Z',
    resolvedAt: '2025-05-15T02:30:00Z',
    updates: [
      { time: '02:30', message: 'Maintenance complete. All services operational.' },
      { time: '02:00', message: 'Starting scheduled database schema migration. Expected duration: 30 minutes.' },
    ],
  },
];

const UPTIME_DAYS = Array.from({ length: 90 }, (_, i) => ({
  date: new Date(Date.now() - (89 - i) * 86400000).toLocaleDateString(),
  status: Math.random() > 0.02 ? 'operational' : 'degraded',
}));

export default function StatusPage() {
  const [expandedIncident, setExpandedIncident] = useState<string | null>(null);

  const overallStatus = SERVICES.every(s => s.status === 'operational') ? 'operational' : 
    SERVICES.some(s => s.status === 'outage') ? 'outage' : 'degraded';

  const avgUptime = (SERVICES.reduce((sum, s) => sum + s.uptime, 0) / SERVICES.length).toFixed(2);

  const statusIcon = (status: string) => {
    switch (status) {
      case 'operational': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'degraded': return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case 'outage': return <XCircle className="w-5 h-5 text-red-500" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/product">
                <Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4 mr-1" /> Back</Button>
              </Link>
              <Activity className="w-6 h-6 text-primary" />
              <h1 className="text-xl font-bold">System Status</h1>
            </div>
            <Badge className={overallStatus === 'operational' ? 'bg-green-500/20 text-green-500' : 'bg-amber-500/20 text-amber-500'}>
              {overallStatus === 'operational' ? 'All Systems Operational' : 'Degraded Performance'}
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Overall Status Banner */}
        <Card className={`border-2 ${overallStatus === 'operational' ? 'border-green-500/30 bg-green-500/5' : 'border-amber-500/30 bg-amber-500/5'}`}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {statusIcon(overallStatus)}
                <div>
                  <h2 className="text-lg font-semibold">
                    {overallStatus === 'operational' ? 'All Systems Operational' : 'Some Systems Degraded'}
                  </h2>
                  <p className="text-sm text-muted-foreground">Last updated: just now</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-green-500">{avgUptime}%</p>
                <p className="text-xs text-muted-foreground">30-day uptime</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 90-day Uptime Bar */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">90-Day Uptime History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-[2px]">
              {UPTIME_DAYS.map((day, i) => (
                <div
                  key={i}
                  className={`flex-1 h-8 rounded-sm ${day.status === 'operational' ? 'bg-green-500' : 'bg-amber-500'}`}
                  title={`${day.date}: ${day.status}`}
                />
              ))}
            </div>
            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
              <span>90 days ago</span>
              <span>Today</span>
            </div>
          </CardContent>
        </Card>

        {/* Services */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Service Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {SERVICES.map(service => (
                <div key={service.name} className="flex items-center justify-between p-3 rounded-lg border border-border">
                  <div className="flex items-center gap-3">
                    {statusIcon(service.status)}
                    <span className="font-medium">{service.name}</span>
                  </div>
                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <span>{service.responseTime}ms</span>
                    <span className="text-green-500 font-medium">{service.uptime}%</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {service.lastChecked}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* SLA Guarantees */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">SLA Guarantees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              {[
                { tier: 'Starter', sla: '99.5%', support: '48h response' },
                { tier: 'Professional', sla: '99.9%', support: '4h response' },
                { tier: 'Enterprise', sla: '99.99%', support: '1h response + dedicated CSM' },
              ].map(t => (
                <div key={t.tier} className="p-4 rounded-lg border border-border text-center">
                  <p className="text-sm text-muted-foreground">{t.tier}</p>
                  <p className="text-2xl font-bold text-primary mt-1">{t.sla}</p>
                  <p className="text-xs text-muted-foreground mt-1">{t.support}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Incidents */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Incidents</CardTitle>
          </CardHeader>
          <CardContent>
            {INCIDENTS.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No incidents in the last 30 days</p>
            ) : (
              <div className="space-y-4">
                {INCIDENTS.map(incident => (
                  <div key={incident.id} className="border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between cursor-pointer" onClick={() => setExpandedIncident(expandedIncident === incident.id ? null : incident.id)}>
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className={
                          incident.severity === 'critical' ? 'border-red-500 text-red-500' :
                          incident.severity === 'major' ? 'border-amber-500 text-amber-500' :
                          'border-blue-500 text-blue-500'
                        }>
                          {incident.severity}
                        </Badge>
                        <span className="font-medium">{incident.title}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={incident.status === 'resolved' ? 'bg-green-500/20 text-green-500' : 'bg-amber-500/20 text-amber-500'}>
                          {incident.status}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(incident.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    {expandedIncident === incident.id && (
                      <div className="mt-4 pl-4 border-l-2 border-border space-y-3">
                        {incident.updates.map((update, i) => (
                          <div key={i} className="text-sm">
                            <span className="text-muted-foreground font-mono">{update.time}</span>
                            <span className="ml-3">{update.message}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Subscribe */}
        <div className="text-center py-6">
          <p className="text-sm text-muted-foreground mb-3">Subscribe to status updates</p>
          <div className="flex items-center justify-center gap-3">
            <input
              type="email"
              placeholder="your@email.com"
              className="px-4 py-2 rounded-lg bg-card border border-border text-sm w-64"
            />
            <Button size="sm">Subscribe</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Bell, AlertTriangle, AlertCircle, CheckCircle2, Settings, Trash2, Plus } from 'lucide-react';
import { toast } from 'sonner';

interface Alert {
  id: string;
  type: 'sla_breach' | 'quality_drop' | 'capacity' | 'booking_anomaly' | 'response_time';
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  provider?: string;
  triggered: string;
  status: 'active' | 'acknowledged' | 'resolved';
}

const SAMPLE_ALERTS: Alert[] = [
  {
    id: '1',
    type: 'sla_breach',
    title: 'SLA Compliance Below Threshold',
    description: 'La Mamounia SLA compliance dropped to 94% (target: 96%)',
    severity: 'high',
    provider: 'La Mamounia',
    triggered: '2 hours ago',
    status: 'active',
  },
  {
    id: '2',
    type: 'response_time',
    title: 'Response Time Critical',
    description: 'Kasbah Tamadot response time exceeded 35 minutes (target: 20 min)',
    severity: 'critical',
    provider: 'Kasbah Tamadot',
    triggered: '45 minutes ago',
    status: 'active',
  },
  {
    id: '3',
    type: 'quality_drop',
    title: 'Guest Satisfaction Declining',
    description: 'Riad Yasmine guest satisfaction dropped 8 points to 78% (trend: ↓)',
    severity: 'high',
    provider: 'Riad Yasmine',
    triggered: '6 hours ago',
    status: 'acknowledged',
  },
  {
    id: '4',
    type: 'capacity',
    title: 'Capacity Alert',
    description: 'Royal Mansour approaching 95% occupancy for next 3 weeks',
    severity: 'medium',
    provider: 'Royal Mansour',
    triggered: '1 day ago',
    status: 'acknowledged',
  },
  {
    id: '5',
    type: 'booking_anomaly',
    title: 'Booking Pattern Anomaly',
    description: '40% drop in bookings vs. historical average for this period',
    severity: 'medium',
    triggered: '2 days ago',
    status: 'resolved',
  },
];

const ALERT_ICONS: Record<string, any> = {
  sla_breach: <AlertTriangle className="w-5 h-5 text-red-400" />,
  quality_drop: <AlertCircle className="w-5 h-5 text-orange-400" />,
  capacity: <Bell className="w-5 h-5 text-amber-400" />,
  booking_anomaly: <AlertCircle className="w-5 h-5 text-blue-400" />,
  response_time: <AlertTriangle className="w-5 h-5 text-red-400" />,
};

export default function AlertSystemPage() {
  const [, navigate] = useLocation();
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'acknowledged' | 'resolved'>('active');
  const [alerts, setAlerts] = useState<Alert[]>(SAMPLE_ALERTS);

  const filtered = alerts.filter(a => statusFilter === 'all' || a.status === statusFilter);

  const acknowledgeAlert = (id: string) => {
    setAlerts(alerts.map(a => a.id === id ? { ...a, status: 'acknowledged' as const } : a));
    toast.success('Alert acknowledged');
  };

  const resolveAlert = (id: string) => {
    setAlerts(alerts.map(a => a.id === id ? { ...a, status: 'resolved' as const } : a));
    toast.success('Alert resolved');
  };

  const deleteAlert = (id: string) => {
    setAlerts(alerts.filter(a => a.id !== id));
    toast.success('Alert deleted');
  };

  const activeCount = alerts.filter(a => a.status === 'active').length;
  const criticalCount = alerts.filter(a => a.severity === 'critical' && a.status !== 'resolved').length;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Bell className="w-6 h-6 text-amber-400" />
              Automated Alert System
            </h1>
            <p className="text-sm text-muted-foreground">SLA breaches, quality drops, capacity issues, and booking anomalies</p>
          </div>
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-1" /> Configure
          </Button>
        </div>

        {/* Alert Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className={activeCount > 0 ? 'border-red-500/30' : ''}>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-red-400">{activeCount}</p>
              <p className="text-xs text-muted-foreground">Active Alerts</p>
            </CardContent>
          </Card>
          <Card className={criticalCount > 0 ? 'border-red-500/50' : ''}>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-red-500">{criticalCount}</p>
              <p className="text-xs text-muted-foreground">Critical</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-amber-400">{alerts.filter(a => a.status === 'acknowledged').length}</p>
              <p className="text-xs text-muted-foreground">Acknowledged</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-green-400">{alerts.filter(a => a.status === 'resolved').length}</p>
              <p className="text-xs text-muted-foreground">Resolved</p>
            </CardContent>
          </Card>
        </div>

        {/* Status Filter */}
        <div className="flex gap-1 mb-4">
          {(['all', 'active', 'acknowledged', 'resolved'] as const).map(s => (
            <Button
              key={s}
              variant={statusFilter === s ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter(s)}
              className="text-xs capitalize"
            >
              {s}
            </Button>
          ))}
        </div>

        {/* Alerts List */}
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-green-400" />
                <p>No alerts to display.</p>
              </CardContent>
            </Card>
          ) : (
            filtered.map(alert => (
              <Card key={alert.id} className={alert.severity === 'critical' ? 'border-red-500/40' : alert.severity === 'high' ? 'border-orange-500/30' : ''}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="mt-1">{ALERT_ICONS[alert.type]}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-sm">{alert.title}</h3>
                        <Badge className={alert.severity === 'critical' ? 'bg-red-500/20 text-red-300' : alert.severity === 'high' ? 'bg-orange-500/20 text-orange-300' : alert.severity === 'medium' ? 'bg-amber-500/20 text-amber-300' : 'bg-blue-500/20 text-blue-300'}>
                          {alert.severity}
                        </Badge>
                        <Badge variant="outline" className="text-xs">{alert.status}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{alert.description}</p>
                      <div className="flex gap-3 mt-2 text-xs text-muted-foreground">
                        {alert.provider && <span>Provider: {alert.provider}</span>}
                        <span>Triggered: {alert.triggered}</span>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {alert.status === 'active' && (
                        <Button size="sm" variant="outline" className="text-xs h-8" onClick={() => acknowledgeAlert(alert.id)}>
                          Acknowledge
                        </Button>
                      )}
                      {(alert.status === 'active' || alert.status === 'acknowledged') && (
                        <Button size="sm" className="text-xs h-8 bg-green-600 hover:bg-green-700" onClick={() => resolveAlert(alert.id)}>
                          Resolve
                        </Button>
                      )}
                      <Button size="sm" variant="ghost" className="text-xs h-8 text-red-400 hover:text-red-300" onClick={() => deleteAlert(alert.id)}>
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

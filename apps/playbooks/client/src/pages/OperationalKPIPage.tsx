import { useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, BarChart3, Plane, Palette, TrendingUp, TrendingDown, Minus, Target } from 'lucide-react';

type Persona = 'riad-routes' | 'artkech';

interface KPIMetric {
  id: string;
  name: string;
  value: string;
  target: string;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  trendValue: string;
  status: 'on-track' | 'at-risk' | 'behind';
  category: string;
}

const RR_KPIS: KPIMetric[] = [
  { id: 'rr-bookings', name: 'Monthly Bookings', value: '47', target: '50', unit: 'trips', trend: 'up', trendValue: '+8% vs last month', status: 'at-risk', category: 'Revenue' },
  { id: 'rr-commission', name: 'Avg Commission/Booking', value: '3,200', target: '3,000', unit: 'MAD', trend: 'up', trendValue: '+7% vs target', status: 'on-track', category: 'Revenue' },
  { id: 'rr-revenue', name: 'Monthly Revenue', value: '150K', target: '150K', unit: 'MAD', trend: 'up', trendValue: 'On target', status: 'on-track', category: 'Revenue' },
  { id: 'rr-nps', name: 'Guest Satisfaction (NPS)', value: '72', target: '75', unit: 'score', trend: 'stable', trendValue: 'Stable vs last quarter', status: 'at-risk', category: 'Guest Experience' },
  { id: 'rr-review', name: 'Online Review Score', value: '4.7', target: '4.8', unit: '/5', trend: 'up', trendValue: '+0.1 vs last month', status: 'at-risk', category: 'Guest Experience' },
  { id: 'rr-response', name: 'Inquiry Response Time', value: '12', target: '15', unit: 'min', trend: 'down', trendValue: '-3 min improvement', status: 'on-track', category: 'Guest Experience' },
  { id: 'rr-provider-response', name: 'Provider Response Time', value: '25', target: '30', unit: 'min', trend: 'down', trendValue: '-5 min improvement', status: 'on-track', category: 'Provider Collaboration' },
  { id: 'rr-provider-quality', name: 'Provider Quality Score', value: '4.5', target: '4.6', unit: '/5', trend: 'up', trendValue: '+0.2 vs last quarter', status: 'at-risk', category: 'Provider Collaboration' },
  { id: 'rr-prearrivals', name: 'Pre-Arrival Coordination', value: '91', target: '95', unit: '%', trend: 'up', trendValue: '+3% vs last month', status: 'at-risk', category: 'Provider Collaboration' },
  { id: 'rr-repeat', name: 'Repeat Guest Rate', value: '28', target: '30', unit: '%', trend: 'up', trendValue: '+4% vs last year', status: 'at-risk', category: 'Loyalty' },
  { id: 'rr-upsell', name: 'Experience Upsell Rate', value: '35', target: '30', unit: '%', trend: 'up', trendValue: '+5% above target', status: 'on-track', category: 'Revenue' },
  { id: 'rr-anticipatory', name: 'Anticipatory Actions Taken', value: '82', target: '85', unit: '%', trend: 'up', trendValue: '+6% vs last month', status: 'at-risk', category: 'Service Excellence' },
];

const AK_KPIS: KPIMetric[] = [
  { id: 'ak-delivery', name: 'On-Time Delivery', value: '87', target: '90', unit: '%', trend: 'up', trendValue: '+5% vs last quarter', status: 'at-risk', category: 'Delivery' },
  { id: 'ak-utilization', name: 'Team Utilization', value: '76', target: '75', unit: '%', trend: 'stable', trendValue: 'On target', status: 'on-track', category: 'Efficiency' },
  { id: 'ak-billable', name: 'Billable Hours Ratio', value: '68', target: '70', unit: '%', trend: 'up', trendValue: '+3% vs last month', status: 'at-risk', category: 'Efficiency' },
  { id: 'ak-retention', name: 'Client Retention Rate', value: '92', target: '90', unit: '%', trend: 'up', trendValue: '+2% above target', status: 'on-track', category: 'Client' },
  { id: 'ak-nps', name: 'Client NPS Score', value: '68', target: '70', unit: 'score', trend: 'up', trendValue: '+4 vs last quarter', status: 'at-risk', category: 'Client' },
  { id: 'ak-revision', name: 'Avg Revision Rounds', value: '2.3', target: '2.0', unit: 'rounds', trend: 'down', trendValue: '-0.5 vs last quarter', status: 'at-risk', category: 'Quality' },
  { id: 'ak-revenue', name: 'Monthly Revenue', value: '185K', target: '200K', unit: 'MAD', trend: 'up', trendValue: '+12% vs last month', status: 'at-risk', category: 'Revenue' },
  { id: 'ak-pipeline', name: 'Pipeline Value', value: '450K', target: '400K', unit: 'MAD', trend: 'up', trendValue: '+13% above target', status: 'on-track', category: 'Revenue' },
  { id: 'ak-conversion', name: 'Proposal Win Rate', value: '42', target: '40', unit: '%', trend: 'up', trendValue: '+2% above target', status: 'on-track', category: 'Sales' },
  { id: 'ak-avg-project', name: 'Avg Project Value', value: '28K', target: '25K', unit: 'MAD', trend: 'up', trendValue: '+12% vs target', status: 'on-track', category: 'Revenue' },
  { id: 'ak-freelancer', name: 'Freelancer Reliability', value: '85', target: '90', unit: '%', trend: 'down', trendValue: '-3% vs last month', status: 'behind', category: 'Team' },
  { id: 'ak-quality', name: 'First-Pass Approval', value: '61', target: '65', unit: '%', trend: 'up', trendValue: '+4% vs last quarter', status: 'at-risk', category: 'Quality' },
];

export default function OperationalKPIPage() {
  const [, navigate] = useLocation();
  const [activePersona, setActivePersona] = useState<Persona>('riad-routes');

  const kpis = activePersona === 'riad-routes' ? RR_KPIS : AK_KPIS;

  const categories = Array.from(new Set(kpis.map(k => k.category)));

  const statusColor = (s: string) => {
    if (s === 'on-track') return 'bg-green-500/10 text-green-400';
    if (s === 'at-risk') return 'bg-amber-500/10 text-amber-400';
    return 'bg-red-500/10 text-red-400';
  };

  const trendIcon = (t: string) => {
    if (t === 'up') return <TrendingUp className="w-3 h-3 text-green-400" />;
    if (t === 'down') return <TrendingDown className="w-3 h-3 text-blue-400" />;
    return <Minus className="w-3 h-3 text-muted-foreground" />;
  };

  const onTrackCount = kpis.filter(k => k.status === 'on-track').length;
  const atRiskCount = kpis.filter(k => k.status === 'at-risk').length;
  const behindCount = kpis.filter(k => k.status === 'behind').length;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/50">
        <div className="container h-14 flex items-center gap-3">
          <button onClick={() => navigate('/')} className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <BarChart3 className="w-5 h-5 text-accent" />
          <h1 className="text-lg font-bold">Operational KPI Scorecards</h1>
        </div>
      </header>

      <main className="container py-8 space-y-6">
        {/* Persona Toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => setActivePersona('riad-routes')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm transition-colors ${activePersona === 'riad-routes' ? 'bg-accent text-accent-foreground border-accent' : 'border-border hover:border-accent/50'}`}
          >
            <Plane className="w-4 h-4" /> Horizon Concierge
          </button>
          <button
            onClick={() => setActivePersona('artkech')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm transition-colors ${activePersona === 'artkech' ? 'bg-accent text-accent-foreground border-accent' : 'border-border hover:border-accent/50'}`}
          >
            <Palette className="w-4 h-4" /> Meridian Creative Studio
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-3">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-green-400">{onTrackCount}</p>
              <p className="text-xs text-muted-foreground">On Track</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-amber-400">{atRiskCount}</p>
              <p className="text-xs text-muted-foreground">At Risk</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-red-400">{behindCount}</p>
              <p className="text-xs text-muted-foreground">Behind</p>
            </CardContent>
          </Card>
        </div>

        {/* KPIs by Category */}
        {categories.map(cat => (
          <div key={cat} className="space-y-3">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">{cat}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {kpis.filter(k => k.category === cat).map(kpi => (
                <Card key={kpi.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">{kpi.name}</p>
                        <div className="flex items-baseline gap-1 mt-1">
                          <span className="text-2xl font-bold">{kpi.value}</span>
                          <span className="text-sm text-muted-foreground">{kpi.unit}</span>
                        </div>
                      </div>
                      <Badge className={statusColor(kpi.status)}>{kpi.status.replace('-', ' ')}</Badge>
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Target className="w-3 h-3" />
                        Target: {kpi.target}{kpi.unit}
                      </div>
                      <div className="flex items-center gap-1 text-xs">
                        {trendIcon(kpi.trend)}
                        <span className="text-muted-foreground">{kpi.trendValue}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}

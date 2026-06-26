import { useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Lightbulb, TrendingUp, AlertTriangle, CheckCircle2, Zap } from 'lucide-react';

interface Insight {
  id: string;
  type: 'opportunity' | 'trend' | 'anomaly' | 'recommendation';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  action?: string;
}

const INSIGHTS: Insight[] = [
  {
    id: '1',
    type: 'opportunity',
    title: 'Untapped Peak Season Capacity',
    description: 'July-August occupancy can be increased from 85% to 95% by offering early-bird discounts 8 weeks in advance',
    impact: 'high',
    action: 'Create early-bird campaign',
  },
  {
    id: '2',
    type: 'trend',
    title: 'Rising Demand for Wellness Packages',
    description: 'Wellness-focused bookings increased 23% YoY. Vista Resort captures 40% of this segment.',
    impact: 'high',
    action: 'Develop wellness partnerships',
  },
  {
    id: '3',
    type: 'anomaly',
    title: 'Booking Cancellation Spike',
    description: 'Cancellations for May-June jumped 15% vs. historical average. May indicate external factor.',
    impact: 'medium',
    action: 'Investigate root cause',
  },
  {
    id: '4',
    type: 'recommendation',
    title: 'Optimize Provider Mix',
    description: 'Highland Retreat underperforming (65% occupancy). Consider shifting focus to high-performers or renegotiating terms.',
    impact: 'medium',
    action: 'Review provider contracts',
  },
  {
    id: '5',
    type: 'trend',
    title: 'Guest Preference Shift',
    description: 'Garden-view rooms now preferred 2x more than city-view. Adjust provider recommendations accordingly.',
    impact: 'medium',
    action: 'Update preference profiles',
  },
  {
    id: '6',
    type: 'opportunity',
    title: 'Repeat Guest Monetization',
    description: 'VIP guests (5+ stays) have 40% higher lifetime value. Implement loyalty program to increase retention.',
    impact: 'high',
    action: 'Launch VIP program',
  },
  {
    id: '7',
    type: 'anomaly',
    title: 'Provider Response Time Degradation',
    description: 'Riverside Luxury Hotel response time increased from 20m to 28m over past month. Quality concerns emerging.',
    impact: 'medium',
    action: 'Schedule provider review',
  },
  {
    id: '8',
    type: 'recommendation',
    title: 'Seasonal Pricing Adjustment',
    description: 'Competitor analysis shows 8-12% price increase opportunity during peak season without occupancy impact.',
    impact: 'high',
    action: 'Implement dynamic pricing',
  },
];

const TYPE_ICONS: Record<string, any> = {
  opportunity: <Zap className="w-5 h-5 text-green-400" />,
  trend: <TrendingUp className="w-5 h-5 text-blue-400" />,
  anomaly: <AlertTriangle className="w-5 h-5 text-orange-400" />,
  recommendation: <Lightbulb className="w-5 h-5 text-purple-400" />,
};

export default function OperationalInsightsPage() {
  const [, navigate] = useLocation();
  const [filterType, setFilterType] = useState<'all' | 'opportunity' | 'trend' | 'anomaly' | 'recommendation'>('all');

  const filtered = filterType === 'all' ? INSIGHTS : INSIGHTS.filter(i => i.type === filterType);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Lightbulb className="w-6 h-6 text-purple-400" />
              Operational Insights Dashboard
            </h1>
            <p className="text-sm text-muted-foreground">AI-generated insights: trends, anomalies, and recommendations</p>
          </div>
        </div>

        {/* Filter */}
        <div className="flex gap-1 mb-6 overflow-x-auto">
          {(['all', 'opportunity', 'trend', 'anomaly', 'recommendation'] as const).map(type => (
            <Button
              key={type}
              variant={filterType === type ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterType(type)}
              className="text-xs capitalize whitespace-nowrap"
            >
              {type}
            </Button>
          ))}
        </div>

        {/* Insights Grid */}
        <div className="space-y-3">
          {filtered.map(insight => (
            <Card key={insight.id} className={insight.impact === 'high' ? 'border-amber-500/30' : ''}>
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="mt-1">{TYPE_ICONS[insight.type]}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-sm">{insight.title}</h3>
                      <Badge className={insight.impact === 'high' ? 'bg-amber-500/20 text-amber-300' : insight.impact === 'medium' ? 'bg-blue-500/20 text-blue-300' : 'bg-zinc-700'}>
                        {insight.impact} impact
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{insight.description}</p>
                  </div>
                  {insight.action && (
                    <Button size="sm" className="text-xs h-8 bg-purple-600 hover:bg-purple-700 shrink-0">
                      {insight.action}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Summary */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-base">Insights Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Total Insights</p>
                <p className="text-2xl font-bold">{INSIGHTS.length}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">High Impact</p>
                <p className="text-2xl font-bold text-amber-400">{INSIGHTS.filter(i => i.impact === 'high').length}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Opportunities</p>
                <p className="text-2xl font-bold text-green-400">{INSIGHTS.filter(i => i.type === 'opportunity').length}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Anomalies</p>
                <p className="text-2xl font-bold text-orange-400">{INSIGHTS.filter(i => i.type === 'anomaly').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

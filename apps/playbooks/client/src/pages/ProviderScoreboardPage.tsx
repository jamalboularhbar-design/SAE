import { useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, TrendingUp, AlertTriangle, CheckCircle2, Clock, Star, Building2, BarChart3 } from 'lucide-react';

interface ProviderMetric {
  providerId: string;
  name: string;
  tier: string;
  responseTime: number; // minutes
  guestSatisfaction: number; // 0-100
  slaCompliance: number; // 0-100
  bookingAccuracy: number; // 0-100
  trend: 'up' | 'down' | 'stable';
  alerts: string[];
}

const PROVIDER_METRICS: ProviderMetric[] = [
  {
    providerId: '1',
    name: 'Royal Mansour',
    tier: 'Platinum',
    responseTime: 12,
    guestSatisfaction: 96,
    slaCompliance: 98,
    bookingAccuracy: 99,
    trend: 'up',
    alerts: [],
  },
  {
    providerId: '2',
    name: 'La Mamounia',
    tier: 'Gold',
    responseTime: 28,
    guestSatisfaction: 89,
    slaCompliance: 94,
    bookingAccuracy: 95,
    trend: 'down',
    alerts: ['Response time trending up', 'SLA compliance below target'],
  },
  {
    providerId: '3',
    name: 'Selman Marrakech',
    tier: 'Platinum',
    responseTime: 15,
    guestSatisfaction: 92,
    slaCompliance: 96,
    bookingAccuracy: 97,
    trend: 'stable',
    alerts: [],
  },
  {
    providerId: '4',
    name: 'Kasbah Tamadot',
    tier: 'Gold',
    responseTime: 35,
    guestSatisfaction: 85,
    slaCompliance: 88,
    bookingAccuracy: 92,
    trend: 'down',
    alerts: ['Response time critical', 'SLA compliance at risk', 'Guest satisfaction declining'],
  },
  {
    providerId: '5',
    name: 'Riad Yasmine',
    tier: 'Silver',
    responseTime: 42,
    guestSatisfaction: 78,
    slaCompliance: 82,
    bookingAccuracy: 88,
    trend: 'down',
    alerts: ['Multiple SLA breaches', 'Booking accuracy below threshold'],
  },
];

const getScoreColor = (score: number) => {
  if (score >= 95) return 'text-green-400';
  if (score >= 85) return 'text-amber-400';
  if (score >= 75) return 'text-orange-400';
  return 'text-red-400';
};

const getScoreBg = (score: number) => {
  if (score >= 95) return 'bg-green-500/20';
  if (score >= 85) return 'bg-amber-500/20';
  if (score >= 75) return 'bg-orange-500/20';
  return 'bg-red-500/20';
};

export default function ProviderScoreboardPage() {
  const [, navigate] = useLocation();
  const [sortBy, setSortBy] = useState<'satisfaction' | 'sla' | 'response'>('satisfaction');

  const sorted = [...PROVIDER_METRICS].sort((a, b) => {
    if (sortBy === 'satisfaction') return b.guestSatisfaction - a.guestSatisfaction;
    if (sortBy === 'sla') return b.slaCompliance - a.slaCompliance;
    return a.responseTime - b.responseTime;
  });

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
              <BarChart3 className="w-6 h-6 text-cyan-400" />
              Provider Performance Scoreboard
            </h1>
            <p className="text-sm text-muted-foreground">Real-time metrics and SLA tracking for all partners</p>
          </div>
        </div>

        {/* Sort Controls */}
        <div className="flex gap-2 mb-6">
          {(['satisfaction', 'sla', 'response'] as const).map(option => (
            <Button
              key={option}
              variant={sortBy === option ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy(option)}
              className="text-xs capitalize"
            >
              {option === 'satisfaction' ? 'Guest Satisfaction' : option === 'sla' ? 'SLA Compliance' : 'Response Time'}
            </Button>
          ))}
        </div>

        {/* Metrics Grid */}
        <div className="space-y-3">
          {sorted.map(provider => (
            <Card key={provider.providerId} className={provider.alerts.length > 0 ? 'border-red-500/30' : ''}>
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-start">
                  {/* Provider Info */}
                  <div className="md:col-span-1">
                    <div className="flex items-start gap-2">
                      <Building2 className="w-5 h-5 text-muted-foreground mt-1 shrink-0" />
                      <div>
                        <p className="text-sm font-medium">{provider.name}</p>
                        <Badge variant="outline" className="text-xs mt-1">{provider.tier}</Badge>
                      </div>
                    </div>
                  </div>

                  {/* Guest Satisfaction */}
                  <div className="md:col-span-1">
                    <p className="text-xs text-muted-foreground mb-1">Guest Satisfaction</p>
                    <div className="flex items-center gap-2">
                      <p className={`text-lg font-bold ${getScoreColor(provider.guestSatisfaction)}`}>{provider.guestSatisfaction}%</p>
                      {provider.trend === 'up' && <TrendingUp className="w-4 h-4 text-green-400" />}
                      {provider.trend === 'down' && <TrendingUp className="w-4 h-4 text-red-400 rotate-180" />}
                    </div>
                  </div>

                  {/* SLA Compliance */}
                  <div className="md:col-span-1">
                    <p className="text-xs text-muted-foreground mb-1">SLA Compliance</p>
                    <p className={`text-lg font-bold ${getScoreColor(provider.slaCompliance)}`}>{provider.slaCompliance}%</p>
                  </div>

                  {/* Response Time */}
                  <div className="md:col-span-1">
                    <p className="text-xs text-muted-foreground mb-1">Response Time</p>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <p className={`text-lg font-bold ${provider.responseTime > 30 ? 'text-red-400' : provider.responseTime > 20 ? 'text-amber-400' : 'text-green-400'}`}>
                        {provider.responseTime}m
                      </p>
                    </div>
                  </div>

                  {/* Booking Accuracy */}
                  <div className="md:col-span-1">
                    <p className="text-xs text-muted-foreground mb-1">Booking Accuracy</p>
                    <p className={`text-lg font-bold ${getScoreColor(provider.bookingAccuracy)}`}>{provider.bookingAccuracy}%</p>
                  </div>

                  {/* Alerts */}
                  <div className="md:col-span-1">
                    {provider.alerts.length > 0 ? (
                      <div className="flex items-start gap-1">
                        <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5 shrink-0" />
                        <div className="flex-1">
                          <p className="text-xs font-medium text-red-400">{provider.alerts.length} Alert{provider.alerts.length > 1 ? 's' : ''}</p>
                          <div className="text-xs text-muted-foreground mt-1 space-y-0.5">
                            {provider.alerts.map((alert, idx) => (
                              <p key={idx}>• {alert}</p>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        <CheckCircle2 className="w-5 h-5 text-green-400" />
                        <p className="text-xs text-green-400">All Clear</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Legend */}
        <Card className="mt-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Scoring Legend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-green-500" />
                <span>Excellent (≥95%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-amber-500" />
                <span>Good (85-94%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-orange-500" />
                <span>Fair (75-84%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-red-500" />
                <span>At Risk (&lt;75%)</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

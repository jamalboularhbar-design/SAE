import { useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Target, Clock, CheckCircle2, XCircle, AlertTriangle, TrendingUp } from 'lucide-react';

interface SLAMetric {
  id: string;
  name: string;
  description: string;
  target: string;
  currentPerformance: string;
  status: 'met' | 'at-risk' | 'breached';
  category: string;
}

const PROVIDER_SLA_METRICS: SLAMetric[] = [
  { id: 'sla1', name: 'Booking Confirmation Time', description: 'Provider must confirm reservation within timeframe', target: '< 2 hours', currentPerformance: '1.5 hours avg', status: 'met', category: 'Responsiveness' },
  { id: 'sla2', name: 'Room Readiness', description: 'Room must be ready by agreed check-in time', target: '100% by 2:00 PM', currentPerformance: '96% on time', status: 'at-risk', category: 'Operations' },
  { id: 'sla3', name: 'Special Request Fulfillment', description: 'Dietary, pillow, temperature preferences fulfilled', target: '> 95%', currentPerformance: '98% fulfilled', status: 'met', category: 'Guest Experience' },
  { id: 'sla4', name: 'Issue Resolution Time', description: 'Guest-reported issues resolved within timeframe', target: '< 30 minutes', currentPerformance: '22 min avg', status: 'met', category: 'Operations' },
  { id: 'sla5', name: 'Communication Response', description: 'Provider responds to concierge messages within timeframe', target: '< 15 minutes (during hours)', currentPerformance: '12 min avg', status: 'met', category: 'Responsiveness' },
  { id: 'sla6', name: 'Guest Satisfaction Score', description: 'Average guest rating for provider stays', target: '> 4.5/5', currentPerformance: '4.3/5', status: 'at-risk', category: 'Guest Experience' },
  { id: 'sla7', name: 'Last-Minute Cancellation Rate', description: 'Provider cancellations within 48 hours of check-in', target: '< 1%', currentPerformance: '0.5%', status: 'met', category: 'Reliability' },
  { id: 'sla8', name: 'Maintenance Standards', description: 'Property passes quarterly quality audit', target: '> 90% score', currentPerformance: '87% avg', status: 'at-risk', category: 'Quality' },
  { id: 'sla9', name: 'Invoice Accuracy', description: 'Correct billing without disputes', target: '> 99%', currentPerformance: '99.2%', status: 'met', category: 'Finance' },
  { id: 'sla10', name: 'Emergency Protocol Compliance', description: 'Provider follows agreed emergency procedures', target: '100%', currentPerformance: '100%', status: 'met', category: 'Safety' },
  { id: 'sla11', name: 'VIP Upgrade Availability', description: 'Complimentary upgrade available for VIP guests when requested', target: '> 80%', currentPerformance: '75%', status: 'at-risk', category: 'Guest Experience' },
  { id: 'sla12', name: 'Photo Accuracy', description: 'Property matches marketing photos within reasonable expectation', target: '> 95% match', currentPerformance: '2% complaints', status: 'breached', category: 'Quality' },
];

const STATUS_CONFIG = {
  met: { label: 'Met', icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50 border-green-200' },
  'at-risk': { label: 'At Risk', icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' },
  breached: { label: 'Breached', icon: XCircle, color: 'text-red-600', bg: 'bg-red-50 border-red-200' },
};

export default function ProviderSLAPage() {
  const [, navigate] = useLocation();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const categories = Array.from(new Set(PROVIDER_SLA_METRICS.map(m => m.category)));

  const filtered = PROVIDER_SLA_METRICS.filter(m => {
    if (filterStatus !== 'all' && m.status !== filterStatus) return false;
    if (filterCategory !== 'all' && m.category !== filterCategory) return false;
    return true;
  });

  const summary = {
    met: PROVIDER_SLA_METRICS.filter(m => m.status === 'met').length,
    atRisk: PROVIDER_SLA_METRICS.filter(m => m.status === 'at-risk').length,
    breached: PROVIDER_SLA_METRICS.filter(m => m.status === 'breached').length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-stone-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate('/')} className="p-2 rounded-lg hover:bg-white/60 transition">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Target className="w-6 h-6 text-blue-600" /> Provider SLA Dashboard
            </h1>
            <p className="text-slate-500 text-sm">Service Level Agreement tracking for accommodation partners</p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card className="border-green-200 bg-green-50/50">
            <CardContent className="p-4 text-center">
              <CheckCircle2 className="w-6 h-6 text-green-600 mx-auto mb-1" />
              <p className="text-2xl font-bold text-green-700">{summary.met}</p>
              <p className="text-xs text-green-600">SLAs Met</p>
            </CardContent>
          </Card>
          <Card className="border-amber-200 bg-amber-50/50">
            <CardContent className="p-4 text-center">
              <AlertTriangle className="w-6 h-6 text-amber-600 mx-auto mb-1" />
              <p className="text-2xl font-bold text-amber-700">{summary.atRisk}</p>
              <p className="text-xs text-amber-600">At Risk</p>
            </CardContent>
          </Card>
          <Card className="border-red-200 bg-red-50/50">
            <CardContent className="p-4 text-center">
              <XCircle className="w-6 h-6 text-red-600 mx-auto mb-1" />
              <p className="text-2xl font-bold text-red-700">{summary.breached}</p>
              <p className="text-xs text-red-600">Breached</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex gap-3 mb-6 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-500">Status:</span>
            {['all', 'met', 'at-risk', 'breached'].map(s => (
              <button key={s} onClick={() => setFilterStatus(s)} className={`px-3 py-1 rounded-full text-xs font-medium transition ${filterStatus === s ? 'bg-slate-800 text-white' : 'bg-white text-slate-600 hover:bg-slate-100'}`}>
                {s === 'all' ? 'All' : s === 'at-risk' ? 'At Risk' : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 ml-4">
            <span className="text-sm text-slate-500">Category:</span>
            {['all', ...categories].map(c => (
              <button key={c} onClick={() => setFilterCategory(c)} className={`px-3 py-1 rounded-full text-xs font-medium transition ${filterCategory === c ? 'bg-slate-800 text-white' : 'bg-white text-slate-600 hover:bg-slate-100'}`}>
                {c === 'all' ? 'All' : c}
              </button>
            ))}
          </div>
        </div>

        {/* SLA Metrics */}
        <div className="space-y-3">
          {filtered.map(metric => {
            const statusConfig = STATUS_CONFIG[metric.status];
            const StatusIcon = statusConfig.icon;
            return (
              <Card key={metric.id} className={`border ${statusConfig.bg}`}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <StatusIcon className={`w-5 h-5 ${statusConfig.color}`} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-slate-900">{metric.name}</h3>
                        <Badge variant="outline" className="text-xs">{metric.category}</Badge>
                      </div>
                      <p className="text-xs text-slate-500">{metric.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-sm">
                        <Target className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-medium text-slate-700">{metric.target}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm mt-1">
                        <TrendingUp className="w-3.5 h-3.5 text-slate-400" />
                        <span className={statusConfig.color}>{metric.currentPerformance}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

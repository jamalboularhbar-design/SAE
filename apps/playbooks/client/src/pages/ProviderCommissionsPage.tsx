import { useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, DollarSign, Percent, TrendingUp, Calendar, Building2 } from 'lucide-react';

interface CommissionTier {
  tier: string;
  baseRate: string;
  peakRate: string;
  lowSeasonRate: string;
  paymentTerms: string;
  notes: string;
}

interface ProviderCommission {
  id: string;
  providerName: string;
  tier: string;
  type: string;
  monthlyBookings: number;
  commissionRate: string;
  estimatedMonthly: string;
  paymentStatus: 'paid' | 'pending' | 'overdue';
  lastPayment: string;
}

const COMMISSION_TIERS: CommissionTier[] = [
  { tier: 'Platinum', baseRate: '18-22%', peakRate: '20-25%', lowSeasonRate: '15-18%', paymentTerms: 'Net 15', notes: 'Priority allocation, guaranteed availability, marketing inclusion' },
  { tier: 'Gold', baseRate: '15-18%', peakRate: '18-20%', lowSeasonRate: '12-15%', paymentTerms: 'Net 30', notes: 'Standard allocation, preferred listing, seasonal promotions' },
  { tier: 'Silver', baseRate: '10-15%', peakRate: '12-15%', lowSeasonRate: '8-12%', paymentTerms: 'Net 45', notes: 'Basic allocation, standard listing, volume-based bonuses' },
];

const SAMPLE_COMMISSIONS: ProviderCommission[] = [
  { id: 'c1', providerName: 'Garden Court Hotel', tier: 'platinum', type: 'riad', monthlyBookings: 12, commissionRate: '20%', estimatedMonthly: '€4,800', paymentStatus: 'paid', lastPayment: '2026-05-01' },
  { id: 'c2', providerName: 'Riverside Luxury Hotel Suite', tier: 'platinum', type: 'hotel', monthlyBookings: 8, commissionRate: '22%', estimatedMonthly: '€7,200', paymentStatus: 'paid', lastPayment: '2026-05-01' },
  { id: 'c3', providerName: 'Cedar Boutique Hotel', tier: 'gold', type: 'riad', monthlyBookings: 15, commissionRate: '17%', estimatedMonthly: '€3,400', paymentStatus: 'pending', lastPayment: '2026-04-15' },
  { id: 'c4', providerName: 'Villa Oasis Palmeraie', tier: 'gold', type: 'villa', monthlyBookings: 4, commissionRate: '16%', estimatedMonthly: '€2,100', paymentStatus: 'paid', lastPayment: '2026-05-05' },
  { id: 'c5', providerName: 'Dar El Sadaka', tier: 'silver', type: 'riad', monthlyBookings: 6, commissionRate: '12%', estimatedMonthly: '€1,200', paymentStatus: 'overdue', lastPayment: '2026-03-20' },
  { id: 'c6', providerName: 'Highland Retreat', tier: 'platinum', type: 'hotel', monthlyBookings: 5, commissionRate: '20%', estimatedMonthly: '€5,500', paymentStatus: 'paid', lastPayment: '2026-05-01' },
];

const PAYMENT_STATUS_COLORS = {
  paid: 'bg-green-100 text-green-800',
  pending: 'bg-yellow-100 text-yellow-800',
  overdue: 'bg-red-100 text-red-800',
};

export default function ProviderCommissionsPage() {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<'overview' | 'tiers' | 'tracker'>('overview');

  const totalMonthly = SAMPLE_COMMISSIONS.reduce((sum, c) => {
    const val = parseFloat(c.estimatedMonthly.replace(/[€,]/g, ''));
    return sum + val;
  }, 0);

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
              <DollarSign className="w-6 h-6 text-green-600" /> Provider Commissions
            </h1>
            <p className="text-slate-500 text-sm">Commission structures, rates, and payment tracking</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { key: 'overview', label: 'Overview' },
            { key: 'tiers', label: 'Commission Tiers' },
            { key: 'tracker', label: 'Payment Tracker' },
          ].map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key as any)} className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === tab.key ? 'bg-slate-800 text-white' : 'bg-white text-slate-600 hover:bg-slate-100'}`}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <DollarSign className="w-6 h-6 text-green-600 mx-auto mb-1" />
                  <p className="text-2xl font-bold text-slate-900">€{totalMonthly.toLocaleString()}</p>
                  <p className="text-xs text-slate-500">Est. Monthly Revenue</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Building2 className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                  <p className="text-2xl font-bold text-slate-900">{SAMPLE_COMMISSIONS.length}</p>
                  <p className="text-xs text-slate-500">Active Partners</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Percent className="w-6 h-6 text-purple-600 mx-auto mb-1" />
                  <p className="text-2xl font-bold text-slate-900">17.8%</p>
                  <p className="text-xs text-slate-500">Avg Commission Rate</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Calendar className="w-6 h-6 text-amber-600 mx-auto mb-1" />
                  <p className="text-2xl font-bold text-slate-900">50</p>
                  <p className="text-xs text-slate-500">Monthly Bookings</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader><CardTitle>Provider Revenue Breakdown</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {SAMPLE_COMMISSIONS.sort((a, b) => parseFloat(b.estimatedMonthly.replace(/[€,]/g, '')) - parseFloat(a.estimatedMonthly.replace(/[€,]/g, ''))).map(c => (
                    <div key={c.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-slate-900">{c.providerName}</p>
                        <p className="text-xs text-slate-500">{c.monthlyBookings} bookings/month · {c.commissionRate} rate</p>
                      </div>
                      <Badge className={`${c.tier === 'platinum' ? 'bg-purple-100 text-purple-800' : c.tier === 'gold' ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-800'}`}>
                        {c.tier}
                      </Badge>
                      <span className="font-semibold text-slate-900">{c.estimatedMonthly}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Commission Tiers */}
        {activeTab === 'tiers' && (
          <div className="space-y-4">
            {COMMISSION_TIERS.map(tier => (
              <Card key={tier.tier}>
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <Badge className={`${tier.tier === 'Platinum' ? 'bg-purple-100 text-purple-800' : tier.tier === 'Gold' ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-800'} text-sm px-3 py-1`}>
                      {tier.tier}
                    </Badge>
                    <span className="text-sm text-slate-500">Payment: {tier.paymentTerms}</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                    <div className="bg-slate-50 rounded-lg p-3">
                      <p className="text-xs text-slate-500 mb-1">Base Rate</p>
                      <p className="text-lg font-bold text-slate-900">{tier.baseRate}</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3">
                      <p className="text-xs text-green-600 mb-1">Peak Season</p>
                      <p className="text-lg font-bold text-green-700">{tier.peakRate}</p>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3">
                      <p className="text-xs text-blue-600 mb-1">Low Season</p>
                      <p className="text-lg font-bold text-blue-700">{tier.lowSeasonRate}</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600">{tier.notes}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Payment Tracker */}
        {activeTab === 'tracker' && (
          <div className="space-y-3">
            {SAMPLE_COMMISSIONS.map(c => (
              <Card key={c.id}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-slate-900">{c.providerName}</h3>
                        <Badge variant="outline" className="text-xs">{c.type}</Badge>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">Last payment: {c.lastPayment}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-slate-900">{c.estimatedMonthly}</p>
                      <Badge className={PAYMENT_STATUS_COLORS[c.paymentStatus]}>
                        {c.paymentStatus}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

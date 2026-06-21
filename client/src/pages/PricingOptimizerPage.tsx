import { useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, TrendingUp, DollarSign, AlertTriangle, CheckCircle2, Building2 } from 'lucide-react';
import { toast } from 'sonner';

interface PricingRecommendation {
  provider: string;
  currentRate: number;
  recommendedRate: number;
  change: number;
  reason: string;
  factors: string[];
  confidence: number;
}

const PRICING_RECOMMENDATIONS: PricingRecommendation[] = [
  {
    provider: 'Grand Palace Hotel',
    currentRate: 350,
    recommendedRate: 385,
    change: 10,
    reason: 'High demand + 95% occupancy + premium positioning',
    factors: ['Occupancy: 95%', 'Demand: ↑ 12%', 'Competitor avg: €380', 'Season: Peak'],
    confidence: 92,
  },
  {
    provider: 'Riverside Luxury Hotel',
    currentRate: 280,
    recommendedRate: 310,
    change: 11,
    reason: 'Strong bookings + low price elasticity + market positioning',
    factors: ['Occupancy: 88%', 'Demand: ↑ 8%', 'Competitor avg: €315', 'Season: High'],
    confidence: 88,
  },
  {
    provider: 'Vista Resort',
    currentRate: 320,
    recommendedRate: 320,
    change: 0,
    reason: 'Optimal pricing - maintain current rate',
    factors: ['Occupancy: 82%', 'Demand: Stable', 'Competitor avg: €325', 'Season: High'],
    confidence: 85,
  },
  {
    provider: 'Highland Retreat',
    currentRate: 250,
    recommendedRate: 235,
    change: -6,
    reason: 'Declining bookings - strategic discount to boost demand',
    factors: ['Occupancy: 65%', 'Demand: ↓ 5%', 'Competitor avg: €240', 'Season: Shoulder'],
    confidence: 79,
  },
];

export default function PricingOptimizerPage() {
  const [, navigate] = useLocation();
  const [selectedProvider, setSelectedProvider] = useState<PricingRecommendation | null>(PRICING_RECOMMENDATIONS[0]);

  const applyRecommendation = () => {
    toast.success(`Rate updated to €${selectedProvider?.recommendedRate}/night`);
  };

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
              <TrendingUp className="w-6 h-6 text-green-400" />
              Dynamic Pricing Optimizer
            </h1>
            <p className="text-sm text-muted-foreground">AI-powered rate recommendations based on demand, occupancy, and competition</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Provider List */}
          <div>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-green-400" /> Providers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {PRICING_RECOMMENDATIONS.map(rec => (
                    <button
                      key={rec.provider}
                      onClick={() => setSelectedProvider(rec)}
                      className={`w-full text-left p-3 rounded border transition-all ${
                        selectedProvider?.provider === rec.provider
                          ? 'border-green-500/50 bg-green-500/10'
                          : 'border-border hover:border-green-500/30'
                      }`}
                    >
                      <p className="text-sm font-medium">{rec.provider}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        €{rec.currentRate} → €{rec.recommendedRate}
                      </p>
                      <Badge className={rec.change > 0 ? 'bg-green-500/20 text-green-300 text-xs mt-1' : rec.change < 0 ? 'bg-orange-500/20 text-orange-300 text-xs mt-1' : 'bg-zinc-700 text-xs mt-1'}>
                        {rec.change > 0 ? '+' : ''}{rec.change}%
                      </Badge>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recommendation Details */}
          {selectedProvider && (
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {/* Current vs Recommended */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{selectedProvider.provider}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Current Rate</p>
                        <p className="text-2xl font-bold">€{selectedProvider.currentRate}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Recommended Rate</p>
                        <p className="text-2xl font-bold text-green-400">€{selectedProvider.recommendedRate}</p>
                      </div>
                    </div>
                    <div className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded">
                      <p className="text-sm text-green-300">
                        <CheckCircle2 className="w-4 h-4 inline mr-1" />
                        {selectedProvider.change > 0 ? `Increase by ${selectedProvider.change}% to maximize revenue` : selectedProvider.change < 0 ? `Decrease by ${Math.abs(selectedProvider.change)}% to boost occupancy` : 'Maintain current rate for optimal balance'}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Reason */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-400" /> Why This Recommendation
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{selectedProvider.reason}</p>
                  </CardContent>
                </Card>

                {/* Factors */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Key Factors</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {selectedProvider.factors.map((factor, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                          <span>{factor}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Confidence & Action */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium">Confidence Score</span>
                      <Badge className="bg-green-500/20 text-green-300">{selectedProvider.confidence}%</Badge>
                    </div>
                    <div className="w-full bg-zinc-800 rounded-full h-2 mb-4">
                      <div className="h-full rounded-full bg-green-500" style={{ width: `${selectedProvider.confidence}%` }} />
                    </div>
                    <Button onClick={applyRecommendation} className="w-full bg-green-600 hover:bg-green-700">
                      <DollarSign className="w-4 h-4 mr-1" /> Apply Recommendation
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, DollarSign, Calendar, TrendingUp, Info } from 'lucide-react';

type Season = 'low' | 'mid' | 'high' | 'peak';

interface ProviderRate {
  provider: string;
  tier: string;
  low: number;
  mid: number;
  high: number;
  peak: number;
  commission: number;
}

const SEASON_MONTHS: Record<Season, string> = {
  low: 'Jun-Aug',
  mid: 'Sep-Nov',
  high: 'Dec-Feb',
  peak: 'Mar-May (+ NYE, Ramadan)',
};

const SEASON_COLORS: Record<Season, string> = {
  low: 'text-blue-400',
  mid: 'text-amber-400',
  high: 'text-orange-400',
  peak: 'text-red-400',
};

const PROVIDER_RATES: ProviderRate[] = [
  { provider: 'Royal Mansour', tier: 'Ultra-Luxury', low: 1200, mid: 1600, high: 2200, peak: 3000, commission: 12 },
  { provider: 'La Mamounia', tier: 'Ultra-Luxury', low: 800, mid: 1100, high: 1500, peak: 2200, commission: 10 },
  { provider: 'Selman Marrakech', tier: 'Luxury', low: 600, mid: 850, high: 1200, peak: 1800, commission: 12 },
  { provider: 'Kasbah Tamadot', tier: 'Luxury', low: 550, mid: 750, high: 1100, peak: 1600, commission: 15 },
  { provider: 'Riad Kniza', tier: 'Boutique', low: 280, mid: 380, high: 520, peak: 700, commission: 15 },
  { provider: 'Riad Yasmine', tier: 'Boutique', low: 250, mid: 350, high: 480, peak: 650, commission: 18 },
  { provider: 'Dar Anika', tier: 'Boutique', low: 220, mid: 300, high: 420, peak: 580, commission: 18 },
  { provider: 'Riad 72', tier: 'Boutique', low: 200, mid: 280, high: 380, peak: 520, commission: 20 },
];

const MARKUP_TIERS = [
  { label: 'Standard', markup: 15, description: 'Basic booking with standard service' },
  { label: 'Premium', markup: 25, description: 'Enhanced service with concierge coordination' },
  { label: 'VIP', markup: 35, description: 'Full concierge with anticipatory service' },
];

export default function PricingMatrixPage() {
  const [, navigate] = useLocation();
  const [selectedSeason, setSelectedSeason] = useState<Season>('high');
  const [markupTier, setMarkupTier] = useState(25);

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
              <DollarSign className="w-6 h-6 text-green-400" />
              Seasonal Pricing Matrix
            </h1>
            <p className="text-sm text-muted-foreground">Provider rate cards by season with markup calculations</p>
          </div>
        </div>

        {/* Season Selector */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {(Object.keys(SEASON_MONTHS) as Season[]).map(season => (
            <Card key={season} className={`cursor-pointer transition-colors ${selectedSeason === season ? 'border-accent' : 'hover:border-accent/30'}`} onClick={() => setSelectedSeason(season)}>
              <CardContent className="p-4 text-center">
                <Calendar className={`w-5 h-5 mx-auto mb-1 ${SEASON_COLORS[season]}`} />
                <p className="text-sm font-semibold capitalize">{season} Season</p>
                <p className="text-xs text-muted-foreground">{SEASON_MONTHS[season]}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Markup Tier */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
              <p className="text-sm font-medium">Service Markup Tier</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {MARKUP_TIERS.map(tier => (
                <Button key={tier.label} variant={markupTier === tier.markup ? 'default' : 'outline'} className="h-auto py-3 flex-col" onClick={() => setMarkupTier(tier.markup)}>
                  <span className="font-semibold">{tier.label} (+{tier.markup}%)</span>
                  <span className="text-xs text-muted-foreground">{tier.description}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pricing Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              Rate Card — <span className={`capitalize ${SEASON_COLORS[selectedSeason]}`}>{selectedSeason} Season</span>
              <Badge variant="outline">+{markupTier}% markup</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-2">Provider</th>
                    <th className="text-left py-3 px-2">Tier</th>
                    <th className="text-right py-3 px-2">Base Rate/Night</th>
                    <th className="text-right py-3 px-2">Commission</th>
                    <th className="text-right py-3 px-2">Your Markup</th>
                    <th className="text-right py-3 px-2 font-bold">Client Price</th>
                    <th className="text-right py-3 px-2">Your Margin</th>
                  </tr>
                </thead>
                <tbody>
                  {PROVIDER_RATES.map(rate => {
                    const baseRate = rate[selectedSeason];
                    const commissionAmt = baseRate * (rate.commission / 100);
                    const markupAmt = baseRate * (markupTier / 100);
                    const clientPrice = baseRate + markupAmt;
                    const totalMargin = commissionAmt + markupAmt;
                    return (
                      <tr key={rate.provider} className="border-b border-border/50 hover:bg-card/50">
                        <td className="py-3 px-2 font-medium">{rate.provider}</td>
                        <td className="py-3 px-2"><Badge variant="outline" className="text-xs">{rate.tier}</Badge></td>
                        <td className="py-3 px-2 text-right">${baseRate}</td>
                        <td className="py-3 px-2 text-right text-amber-400">{rate.commission}% (${Math.round(commissionAmt)})</td>
                        <td className="py-3 px-2 text-right text-blue-400">{markupTier}% (${Math.round(markupAmt)})</td>
                        <td className="py-3 px-2 text-right font-bold text-green-400">${Math.round(clientPrice)}</td>
                        <td className="py-3 px-2 text-right font-semibold text-emerald-400">${Math.round(totalMargin)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex items-start gap-2 text-xs text-muted-foreground">
              <Info className="w-4 h-4 mt-0.5 shrink-0" />
              <p>Rates are per night in EUR equivalent. Commission is paid by provider to RR. Markup is added to client-facing price. Total margin = commission + markup.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

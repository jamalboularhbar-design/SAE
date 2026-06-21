import { useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Building2, TrendingUp, Star, DollarSign, MapPin, AlertCircle } from 'lucide-react';

interface Competitor {
  name: string;
  tier: string;
  avgPrice: number;
  guestRating: number;
  reviewCount: number;
  occupancy: number;
  specialties: string[];
  strengths: string[];
  weaknesses: string[];
  marketShare: number;
}

const COMPETITORS: Competitor[] = [
  {
    name: 'Grand Palace Hotel',
    tier: 'Platinum',
    avgPrice: 350,
    guestRating: 4.8,
    reviewCount: 1240,
    occupancy: 95,
    specialties: ['Luxury suites', 'Spa', 'Fine dining'],
    strengths: ['Iconic brand', 'Premium positioning', 'Excellent service'],
    weaknesses: ['High price point', 'Limited availability'],
    marketShare: 18,
  },
  {
    name: 'Riverside Luxury Hotel',
    tier: 'Gold',
    avgPrice: 280,
    guestRating: 4.6,
    reviewCount: 980,
    occupancy: 88,
    specialties: ['Historic charm', 'Gardens', 'Cultural tours'],
    strengths: ['Brand heritage', 'Beautiful grounds', 'Good value'],
    weaknesses: ['Aging infrastructure', 'Mixed reviews on service'],
    marketShare: 14,
  },
  {
    name: 'Vista Resort',
    tier: 'Platinum',
    avgPrice: 320,
    guestRating: 4.7,
    reviewCount: 850,
    occupancy: 82,
    specialties: ['Wellness', 'Spa', 'Pools'],
    strengths: ['Modern design', 'Wellness focus', 'Excellent spa'],
    weaknesses: ['Premium pricing', 'Limited dining options'],
    marketShare: 12,
  },
  {
    name: 'Highland Retreat',
    tier: 'Gold',
    avgPrice: 250,
    guestRating: 4.5,
    reviewCount: 620,
    occupancy: 65,
    specialties: ['Adventure', 'Mountain views', 'Trekking'],
    strengths: ['Unique location', 'Adventure programs', 'Budget-friendly'],
    weaknesses: ['Remote location', 'Limited amenities', 'Declining bookings'],
    marketShare: 8,
  },
];

export default function CompetitorIntelPage() {
  const [, navigate] = useLocation();
  const [selectedCompetitor, setSelectedCompetitor] = useState<Competitor | null>(COMPETITORS[0]);

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
              <Building2 className="w-6 h-6 text-red-400" />
              Competitor Intelligence
            </h1>
            <p className="text-sm text-muted-foreground">Track competitor offerings, pricing, reviews, and market positioning</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Competitor List */}
          <div>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Market Players</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {COMPETITORS.map(comp => (
                    <button
                      key={comp.name}
                      onClick={() => setSelectedCompetitor(comp)}
                      className={`w-full text-left p-3 rounded border transition-all ${
                        selectedCompetitor?.name === comp.name
                          ? 'border-red-500/50 bg-red-500/10'
                          : 'border-border hover:border-red-500/30'
                      }`}
                    >
                      <p className="text-sm font-medium">{comp.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">{comp.tier}</Badge>
                        <span className="text-xs text-muted-foreground">€{comp.avgPrice}</span>
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                        <span className="text-xs">{comp.guestRating}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Competitor Details */}
          {selectedCompetitor && (
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {/* Overview */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{selectedCompetitor.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Avg Price</p>
                        <p className="font-bold text-lg">€{selectedCompetitor.avgPrice}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Guest Rating</p>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                          <p className="font-bold">{selectedCompetitor.guestRating}/5</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Reviews</p>
                        <p className="font-bold">{selectedCompetitor.reviewCount}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Occupancy</p>
                        <p className="font-bold text-green-400">{selectedCompetitor.occupancy}%</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Market Position */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Market Position</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground mb-1">Market Share</p>
                        <div className="w-full bg-zinc-800 rounded-full h-2">
                          <div className="h-full rounded-full bg-red-500" style={{ width: `${selectedCompetitor.marketShare}%` }} />
                        </div>
                      </div>
                      <p className="text-lg font-bold text-red-400">{selectedCompetitor.marketShare}%</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Specialties */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Specialties</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {selectedCompetitor.specialties.map((spec, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">{spec}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Strengths */}
                <Card className="border-green-500/30">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2 text-green-400">
                      <TrendingUp className="w-4 h-4" /> Strengths
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1">
                      {selectedCompetitor.strengths.map((strength, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground">✓ {strength}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Weaknesses */}
                <Card className="border-orange-500/30">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2 text-orange-400">
                      <AlertCircle className="w-4 h-4" /> Weaknesses
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1">
                      {selectedCompetitor.weaknesses.map((weakness, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground">⚠ {weakness}</li>
                      ))}
                    </ul>
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

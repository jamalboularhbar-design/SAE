import { useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Sparkles, Building2, Star, MapPin, DollarSign, Zap } from 'lucide-react';

interface Recommendation {
  rank: number;
  provider: string;
  score: number;
  matchReason: string;
  tier: string;
  location: string;
  avgPrice: string;
  guestSatisfaction: number;
  specialties: string[];
}

const SAMPLE_RECOMMENDATIONS: Recommendation[] = [
  {
    rank: 1,
    provider: 'Grand Palace Hotel',
    score: 98,
    matchReason: 'Perfect match for luxury couples retreat with romantic ambiance',
    tier: 'Platinum',
    location: 'Medina, Marrakech',
    avgPrice: '€350-400/night',
    guestSatisfaction: 96,
    specialties: ['Romantic setups', 'Luxury suites', 'Fine dining', 'Spa services'],
  },
  {
    rank: 2,
    provider: 'Vista Resort',
    score: 94,
    matchReason: 'Excellent wellness focus matches guest preference for spa experiences',
    tier: 'Platinum',
    location: 'Palmeraie, Marrakech',
    avgPrice: '€320-380/night',
    guestSatisfaction: 92,
    specialties: ['Wellness', 'Spa', 'Private pools', 'Garden views'],
  },
  {
    rank: 3,
    provider: 'Riverside Luxury Hotel',
    score: 91,
    matchReason: 'Historic luxury property with excellent guest satisfaction history',
    tier: 'Gold',
    location: 'Medina, Marrakech',
    avgPrice: '€280-340/night',
    guestSatisfaction: 89,
    specialties: ['Historic charm', 'Gardens', 'Cultural experiences', 'Fine dining'],
  },
  {
    rank: 4,
    provider: 'Highland Retreat',
    score: 87,
    matchReason: 'Adventure-focused but offers luxury accommodations for mixed preferences',
    tier: 'Gold',
    location: 'Atlas Mountains',
    avgPrice: '€250-300/night',
    guestSatisfaction: 85,
    specialties: ['Mountain views', 'Adventure tours', 'Trekking', 'Local culture'],
  },
];

export default function ProviderRecommendationPage() {
  const [, navigate] = useLocation();
  const [selectedGuest] = useState('New Guest: Sophie & Marc (Honeymoon)');
  const [preferences] = useState({
    budget: 'Luxury (€300-400)',
    style: 'Romantic couples retreat',
    activities: 'Spa, fine dining, cultural tours',
    specialRequests: 'Rose petals, champagne, private dinner',
  });

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
              <Sparkles className="w-6 h-6 text-cyan-400" />
              Provider Recommendation Engine
            </h1>
            <p className="text-sm text-muted-foreground">AI-powered matching based on guest preferences and history</p>
          </div>
        </div>

        {/* Guest Profile */}
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">{selectedGuest}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Budget</p>
                <p className="font-medium">{preferences.budget}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Travel Style</p>
                <p className="font-medium">{preferences.style}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Activities</p>
                <p className="font-medium">{preferences.activities}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Special Requests</p>
                <p className="font-medium">{preferences.specialRequests}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recommendations */}
        <div className="space-y-4">
          {SAMPLE_RECOMMENDATIONS.map(rec => (
            <Card key={rec.rank} className={rec.rank === 1 ? 'border-cyan-500/40' : ''}>
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-start">
                  {/* Rank & Provider */}
                  <div className="md:col-span-1">
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${rec.rank === 1 ? 'bg-cyan-500/20 text-cyan-300' : rec.rank === 2 ? 'bg-amber-500/20 text-amber-300' : 'bg-zinc-700 text-zinc-300'}`}>
                        {rec.rank}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{rec.provider}</p>
                        <Badge variant="outline" className="text-xs mt-1">{rec.tier}</Badge>
                      </div>
                    </div>
                  </div>

                  {/* Match Score */}
                  <div className="md:col-span-1">
                    <p className="text-xs text-muted-foreground mb-1">Match Score</p>
                    <div className="flex items-center gap-2">
                      <p className="text-lg font-bold text-cyan-400">{rec.score}%</p>
                      <div className="flex-1 bg-zinc-800 rounded-full h-2">
                        <div className="h-full rounded-full bg-cyan-500" style={{ width: `${rec.score}%` }} />
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="md:col-span-1">
                    <p className="text-xs text-muted-foreground mb-1">Details</p>
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-muted-foreground" />
                        <span>{rec.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-3 h-3 text-muted-foreground" />
                        <span>{rec.avgPrice}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-amber-400" />
                        <span>{rec.guestSatisfaction}% satisfaction</span>
                      </div>
                    </div>
                  </div>

                  {/* Match Reason */}
                  <div className="md:col-span-1">
                    <p className="text-xs text-muted-foreground mb-1">Why This Match</p>
                    <p className="text-xs text-cyan-300">{rec.matchReason}</p>
                  </div>

                  {/* Specialties & Action */}
                  <div className="md:col-span-1">
                    <p className="text-xs text-muted-foreground mb-2">Specialties</p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {rec.specialties.slice(0, 2).map((s, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">{s}</Badge>
                      ))}
                    </div>
                    <Button size="sm" className="w-full text-xs h-7 bg-cyan-600 hover:bg-cyan-700">
                      <Zap className="w-3 h-3 mr-1" /> Book
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Insights */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-base">Recommendation Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p>• <span className="text-muted-foreground">Top 2 providers match 96% of guest preferences</span></p>
              <p>• <span className="text-muted-foreground">All recommendations have 85%+ guest satisfaction</span></p>
              <p>• <span className="text-muted-foreground">Price range aligns with budget preferences</span></p>
              <p>• <span className="text-muted-foreground">All offer romantic setup capabilities</span></p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

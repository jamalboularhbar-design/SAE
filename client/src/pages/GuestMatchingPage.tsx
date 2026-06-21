import { useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Users, Star, MapPin, Sparkles, Heart, DollarSign } from 'lucide-react';
import { trpc } from '@/lib/trpc';

interface GuestProfile {
  travelStyle: string;
  budget: string;
  groupType: string;
  interests: string[];
  specialNeeds: string[];
}

const TRAVEL_STYLES = ['Luxury & Relaxation', 'Cultural Immersion', 'Adventure & Active', 'Romantic Getaway', 'Family Friendly', 'Business & Wellness'];
const BUDGETS = ['€100-200/night', '€200-400/night', '€400-800/night', '€800+/night'];
const GROUP_TYPES = ['Solo', 'Couple', 'Family with kids', 'Group of friends', 'Business group', 'Multi-generational'];
const INTERESTS = ['Pool/Swimming', 'Spa/Hammam', 'Fine Dining', 'Cooking Classes', 'Rooftop Terrace', 'Traditional Architecture', 'Modern Design', 'Mountain Views', 'Medina Location', 'Garden/Nature', 'Photography Spots', 'Art/Culture', 'Yoga/Wellness', 'Nightlife Proximity', 'Privacy/Seclusion'];
const SPECIAL_NEEDS = ['Wheelchair accessible', 'Elevator required', 'Ground floor', 'Halal kitchen', 'Vegan options', 'Pet friendly', 'Baby facilities', 'Late check-in', 'Airport transfer', 'Private pool'];

export default function GuestMatchingPage() {
  const [, navigate] = useLocation();
  const [profile, setProfile] = useState<GuestProfile>({
    travelStyle: '',
    budget: '',
    groupType: '',
    interests: [],
    specialNeeds: [],
  });
  const [showResults, setShowResults] = useState(false);

  const { data: providers } = trpc.providerPartners.list.useQuery({});
  const activeProviders = (providers || []).filter((p: any) => p.status === 'active');

  const toggleInterest = (interest: string) => {
    setProfile(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const toggleNeed = (need: string) => {
    setProfile(prev => ({
      ...prev,
      specialNeeds: prev.specialNeeds.includes(need)
        ? prev.specialNeeds.filter(n => n !== need)
        : [...prev.specialNeeds, need]
    }));
  };

  // Simple matching algorithm based on profile
  const getMatchScore = (provider: any): number => {
    let score = 0;
    const specs: string[] = (() => { try { return JSON.parse(provider.specialties || '[]'); } catch { return []; } })();

    // Budget matching
    if (profile.budget === '€800+/night' && provider.tier === 'platinum') score += 30;
    else if (profile.budget === '€400-800/night' && (provider.tier === 'platinum' || provider.tier === 'gold')) score += 25;
    else if (profile.budget === '€200-400/night' && (provider.tier === 'gold' || provider.tier === 'silver')) score += 25;
    else if (profile.budget === '€100-200/night' && provider.tier === 'silver') score += 25;

    // Interest matching
    profile.interests.forEach(interest => {
      const lower = interest.toLowerCase();
      if (specs.some((s: string) => s.toLowerCase().includes(lower.split('/')[0].trim()))) score += 10;
      if (provider.notes?.toLowerCase().includes(lower.split('/')[0].trim())) score += 5;
    });

    // Group type matching
    if (profile.groupType === 'Couple' && (provider.roomCount || 0) <= 10) score += 10;
    if (profile.groupType === 'Family with kids' && (provider.roomCount || 0) >= 20) score += 10;
    if (profile.groupType === 'Group of friends' && (provider.roomCount || 0) >= 5) score += 5;

    // Travel style matching
    if (profile.travelStyle === 'Luxury & Relaxation' && provider.tier === 'platinum') score += 15;
    if (profile.travelStyle === 'Cultural Immersion' && provider.type === 'riad') score += 15;
    if (profile.travelStyle === 'Adventure & Active' && provider.location?.includes('Atlas')) score += 15;
    if (profile.travelStyle === 'Romantic Getaway' && (provider.roomCount || 0) <= 10) score += 10;

    // Quality bonus
    score += (provider.qualityScore || 0) * 5;

    return Math.min(score, 100);
  };

  const rankedProviders = activeProviders
    .map((p: any) => ({ ...p, matchScore: getMatchScore(p) }))
    .sort((a: any, b: any) => b.matchScore - a.matchScore);

  const tierColor = (tier: string) => {
    if (tier === 'platinum') return 'bg-purple-500/10 text-purple-400';
    if (tier === 'gold') return 'bg-amber-500/10 text-amber-400';
    return 'bg-slate-500/10 text-slate-400';
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/50">
        <div className="container h-14 flex items-center gap-3">
          <button onClick={() => navigate('/')} className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <Sparkles className="w-5 h-5 text-accent" />
          <h1 className="text-lg font-bold">Guest-Provider Matching</h1>
        </div>
      </header>

      <main className="container py-8 space-y-8">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-display mb-2">Find the Perfect Provider</h2>
          <p className="text-muted-foreground text-sm">Enter guest preferences to get intelligent provider recommendations ranked by compatibility.</p>
        </div>

        {/* Guest Profile Builder */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Heart className="w-4 h-4 text-pink-400" /> Travel Style
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {TRAVEL_STYLES.map(style => (
                  <button
                    key={style}
                    onClick={() => setProfile(prev => ({ ...prev, travelStyle: style }))}
                    className={`p-2 rounded-lg border text-xs text-left transition-all ${profile.travelStyle === style ? 'border-accent bg-accent/10 text-accent' : 'border-border hover:border-accent/30'}`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-green-400" /> Budget & Group
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Budget per night</label>
                <div className="grid grid-cols-2 gap-2">
                  {BUDGETS.map(b => (
                    <button
                      key={b}
                      onClick={() => setProfile(prev => ({ ...prev, budget: b }))}
                      className={`p-2 rounded-lg border text-xs transition-all ${profile.budget === b ? 'border-accent bg-accent/10 text-accent' : 'border-border hover:border-accent/30'}`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Group type</label>
                <div className="grid grid-cols-2 gap-2">
                  {GROUP_TYPES.map(g => (
                    <button
                      key={g}
                      onClick={() => setProfile(prev => ({ ...prev, groupType: g }))}
                      className={`p-2 rounded-lg border text-xs transition-all ${profile.groupType === g ? 'border-accent bg-accent/10 text-accent' : 'border-border hover:border-accent/30'}`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-400" /> Interests & Preferences
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {INTERESTS.map(interest => (
                  <button
                    key={interest}
                    onClick={() => toggleInterest(interest)}
                    className={`px-3 py-1.5 rounded-full text-xs border transition-all ${profile.interests.includes(interest) ? 'border-accent bg-accent/10 text-accent' : 'border-border text-muted-foreground hover:border-accent/30'}`}
                  >
                    {interest}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Match Button */}
        <button
          onClick={() => setShowResults(true)}
          disabled={!profile.travelStyle && !profile.budget}
          className="w-full sm:w-auto px-6 py-3 rounded-lg bg-accent text-accent-foreground font-medium disabled:opacity-50 flex items-center gap-2 justify-center"
        >
          <Sparkles className="w-4 h-4" /> Find Best Matches
        </button>

        {/* Results */}
        {showResults && (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Users className="w-5 h-5 text-accent" />
              Recommended Providers ({rankedProviders.length})
            </h3>
            {rankedProviders.map((p: any, idx: number) => {
              let specs: string[] = [];
              try { specs = JSON.parse(p.specialties || '[]'); } catch {}
              return (
                <Card key={p.id} className={`${idx === 0 ? 'border-accent/50 bg-accent/5' : ''}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          {idx === 0 && <Badge className="bg-accent text-accent-foreground text-xs">Best Match</Badge>}
                          <h4 className="font-medium">{p.name}</h4>
                          <Badge variant="outline" className={`text-xs ${tierColor(p.tier)}`}>{p.tier}</Badge>
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{p.location}</span>
                          <span className="capitalize">{p.type}</span>
                          <span>{p.priceRange}</span>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {specs.slice(0, 4).map((s: string, i: number) => (
                            <span key={i} className="text-xs bg-muted px-1.5 py-0.5 rounded">{s}</span>
                          ))}
                        </div>
                        {p.notes && <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{p.notes}</p>}
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-accent">{p.matchScore}%</div>
                        <p className="text-xs text-muted-foreground">match</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="w-3 h-3 text-amber-400" />
                          <span className="text-xs font-medium">{p.qualityScore?.toFixed(1)}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

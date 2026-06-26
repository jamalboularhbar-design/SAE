import { useState, useMemo } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, BarChart3, Star, Clock, TrendingUp, Award } from 'lucide-react';
import { trpc } from '@/lib/trpc';

export default function ProviderComparePage() {
  const [, navigate] = useLocation();
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const { data: providers } = trpc.providerPartners.list.useQuery({});

  const activeProviders = (providers || []).filter((p: any) => p.status === 'active');

  const toggleProvider = (id: number) => {
    setSelectedIds(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id);
      if (prev.length >= 4) return prev; // max 4 comparisons
      return [...prev, id];
    });
  };

  const selected = activeProviders.filter((p: any) => selectedIds.includes(p.id));

  const tierColor = (tier: string) => {
    if (tier === 'platinum') return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
    if (tier === 'gold') return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
  };

  const scoreColor = (score: number) => {
    if (score >= 4.5) return 'text-green-400';
    if (score >= 4.0) return 'text-amber-400';
    return 'text-red-400';
  };

  const responseColor = (mins: number) => {
    if (mins <= 15) return 'text-green-400';
    if (mins <= 30) return 'text-amber-400';
    return 'text-red-400';
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/50">
        <div className="container h-14 flex items-center gap-3">
          <button onClick={() => navigate('/')} className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <BarChart3 className="w-5 h-5 text-accent" />
          <h1 className="text-lg font-bold">Provider Performance Comparison</h1>
        </div>
      </header>

      <main className="container py-8 space-y-6">
        <p className="text-sm text-muted-foreground">Select up to 4 providers to compare side-by-side.</p>

        {/* Provider Selection */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {activeProviders.map((p: any) => (
            <button
              key={p.id}
              onClick={() => toggleProvider(p.id)}
              className={`p-3 rounded-lg border text-left text-sm transition-all ${selectedIds.includes(p.id) ? 'border-accent bg-accent/10' : 'border-border hover:border-accent/30'}`}
            >
              <p className="font-medium truncate">{p.name}</p>
              <div className="flex items-center gap-1 mt-1">
                <Badge variant="outline" className={`text-xs ${tierColor(p.tier)}`}>{p.tier}</Badge>
              </div>
            </button>
          ))}
        </div>

        {/* Comparison Table */}
        {selected.length >= 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-accent" />
                Side-by-Side Comparison
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-2 text-muted-foreground font-medium">Metric</th>
                      {selected.map((p: any) => (
                        <th key={p.id} className="text-center py-3 px-2 font-medium">{p.name}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border/50">
                      <td className="py-3 px-2 text-muted-foreground flex items-center gap-1"><Award className="w-3 h-3" /> Tier</td>
                      {selected.map((p: any) => (
                        <td key={p.id} className="text-center py-3 px-2">
                          <Badge variant="outline" className={tierColor(p.tier)}>{p.tier}</Badge>
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 px-2 text-muted-foreground flex items-center gap-1"><Star className="w-3 h-3" /> Quality Score</td>
                      {selected.map((p: any) => (
                        <td key={p.id} className={`text-center py-3 px-2 font-bold ${scoreColor(p.qualityScore || 0)}`}>
                          {p.qualityScore?.toFixed(1) || 'N/A'}/5
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 px-2 text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" /> Avg Response</td>
                      {selected.map((p: any) => (
                        <td key={p.id} className={`text-center py-3 px-2 font-bold ${responseColor(p.responseTimeAvg || 999)}`}>
                          {p.responseTimeAvg ? `${p.responseTimeAvg} min` : 'N/A'}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 px-2 text-muted-foreground">Type</td>
                      {selected.map((p: any) => (
                        <td key={p.id} className="text-center py-3 px-2 capitalize">{p.type}</td>
                      ))}
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 px-2 text-muted-foreground">Rooms</td>
                      {selected.map((p: any) => (
                        <td key={p.id} className="text-center py-3 px-2">{p.roomCount || 'N/A'}</td>
                      ))}
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 px-2 text-muted-foreground">Price Range</td>
                      {selected.map((p: any) => (
                        <td key={p.id} className="text-center py-3 px-2 text-xs">{p.priceRange || 'N/A'}</td>
                      ))}
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 px-2 text-muted-foreground">Location</td>
                      {selected.map((p: any) => (
                        <td key={p.id} className="text-center py-3 px-2 text-xs">{p.location || 'N/A'}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3 px-2 text-muted-foreground">Specialties</td>
                      {selected.map((p: any) => {
                        let specs: string[] = [];
                        try { specs = JSON.parse(p.specialties || '[]'); } catch {}
                        return (
                          <td key={p.id} className="text-center py-3 px-2">
                            <div className="flex flex-wrap gap-1 justify-center">
                              {specs.slice(0, 3).map((s, i) => (
                                <span key={i} className="text-xs bg-accent/10 text-accent px-1.5 py-0.5 rounded">{s}</span>
                              ))}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {selected.length < 2 && activeProviders.length > 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>Select at least 2 providers to compare</p>
          </div>
        )}
      </main>
    </div>
  );
}

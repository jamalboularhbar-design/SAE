import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { ArrowLeft, TrendingUp, TrendingDown, Minus, BarChart3, Plus, Loader2 } from 'lucide-react';
import { useLocation } from 'wouter';

export default function AdminPerformanceBenchmarksPage() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const isAdmin = user?.role === 'admin';
  const { data: benchmarks, isLoading, refetch } = trpc.benchmarks.list.useQuery(undefined, { enabled: isAdmin });
  const saveMut = trpc.benchmarks.save.useMutation({
    onSuccess: () => { refetch(); toast.success('Benchmark saved'); setShowForm(false); },
    onError: () => toast.error('Failed to save benchmark'),
  });
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ metricKey: '', metricLabel: '', baselineValue: 0, currentValue: 0, periodStart: '', periodEnd: '', trend: 'stable' });

  if (!isAdmin) return <div className="p-8 text-center text-muted-foreground">Admin access required</div>;

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (trend === 'down') return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <Minus className="w-4 h-4 text-muted-foreground" />;
  };

  const getChangePercent = (baseline: number, current: number) => {
    if (!baseline) return '—';
    const pct = ((current - baseline) / baseline * 100).toFixed(1);
    return `${Number(pct) > 0 ? '+' : ''}${pct}%`;
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/50">
        <div className="container h-14 flex items-center gap-3">
          <button onClick={() => navigate('/')} className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <BarChart3 className="w-5 h-5 text-accent" />
          <h1 className="text-lg font-bold text-foreground">Performance Benchmarks</h1>
          <div className="ml-auto">
            <Button onClick={() => setShowForm(!showForm)} size="sm" variant="outline">
              <Plus className="w-4 h-4 mr-2" /> Add Benchmark
            </Button>
          </div>
        </div>
      </header>
      <div className="container py-8 max-w-4xl">
        {showForm && (
          <Card className="mb-6">
            <CardHeader><CardTitle className="text-lg">New Benchmark</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <input placeholder="Metric Key (e.g., avg-load-time)" value={form.metricKey} onChange={e => setForm({ ...form, metricKey: e.target.value })} className="col-span-1 px-3 py-2 rounded-lg bg-muted/50 border border-border text-sm text-foreground" />
                <input placeholder="Metric Label" value={form.metricLabel} onChange={e => setForm({ ...form, metricLabel: e.target.value })} className="col-span-1 px-3 py-2 rounded-lg bg-muted/50 border border-border text-sm text-foreground" />
                <input type="number" placeholder="Baseline Value" value={form.baselineValue || ''} onChange={e => setForm({ ...form, baselineValue: Number(e.target.value) })} className="px-3 py-2 rounded-lg bg-muted/50 border border-border text-sm text-foreground" />
                <input type="number" placeholder="Current Value" value={form.currentValue || ''} onChange={e => setForm({ ...form, currentValue: Number(e.target.value) })} className="px-3 py-2 rounded-lg bg-muted/50 border border-border text-sm text-foreground" />
                <input type="date" placeholder="Period Start" value={form.periodStart} onChange={e => setForm({ ...form, periodStart: e.target.value })} className="px-3 py-2 rounded-lg bg-muted/50 border border-border text-sm text-foreground" />
                <input type="date" placeholder="Period End" value={form.periodEnd} onChange={e => setForm({ ...form, periodEnd: e.target.value })} className="px-3 py-2 rounded-lg bg-muted/50 border border-border text-sm text-foreground" />
                <select value={form.trend} onChange={e => setForm({ ...form, trend: e.target.value })} className="px-3 py-2 rounded-lg bg-muted/50 border border-border text-sm text-foreground">
                  <option value="up">Up</option>
                  <option value="down">Down</option>
                  <option value="stable">Stable</option>
                </select>
                <Button onClick={() => saveMut.mutate(form)} disabled={saveMut.isPending || !form.metricKey || !form.metricLabel}>
                  {saveMut.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                  Save
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
        {isLoading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-accent" /></div>
        ) : benchmarks && benchmarks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {benchmarks.map((b: any) => (
              <Card key={b.id}>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-sm text-foreground">{b.metricLabel}</h3>
                    {getTrendIcon(b.trend)}
                  </div>
                  <div className="flex items-end gap-4">
                    <div>
                      <p className="text-2xl font-bold text-foreground">{b.currentValue}</p>
                      <p className="text-xs text-muted-foreground">Current</p>
                    </div>
                    <div>
                      <p className="text-lg text-muted-foreground">{b.baselineValue}</p>
                      <p className="text-xs text-muted-foreground">Baseline</p>
                    </div>
                    <Badge variant={b.trend === 'up' ? 'default' : b.trend === 'down' ? 'destructive' : 'secondary'} className="ml-auto">
                      {getChangePercent(b.baselineValue, b.currentValue)}
                    </Badge>
                  </div>
                  {b.periodStart && b.periodEnd && (
                    <p className="text-xs text-muted-foreground mt-3">
                      {new Date(b.periodStart).toLocaleDateString()} — {new Date(b.periodEnd).toLocaleDateString()}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-muted-foreground">
            <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p>No benchmarks recorded yet. Add a benchmark to start tracking performance.</p>
          </div>
        )}
      </div>
    </div>
  );
}

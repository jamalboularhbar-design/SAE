import { useState } from 'react';
import { useLocation, Link } from 'wouter';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import { ArrowLeft, Leaf, Clock, AlertTriangle, Loader2 } from 'lucide-react';

function getFreshnessLabel(days: number) {
  if (days <= 7) return { label: 'Fresh', color: 'text-emerald-400 bg-emerald-500/10', icon: '🟢' };
  if (days <= 30) return { label: 'Recent', color: 'text-blue-400 bg-blue-500/10', icon: '🔵' };
  if (days <= 90) return { label: 'Aging', color: 'text-amber-400 bg-amber-500/10', icon: '🟡' };
  return { label: 'Stale', color: 'text-red-400 bg-red-500/10', icon: '🔴' };
}

export default function AdminFreshnessReportPage() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const { data, isLoading } = trpc.batch21.freshnessReport.useQuery(undefined, { enabled: isAdmin });
  const [filter, setFilter] = useState<'all' | 'fresh' | 'recent' | 'aging' | 'stale'>('all');

  if (!isAdmin) {
    return <div className="min-h-screen bg-background flex items-center justify-center"><p className="text-muted-foreground">Admin access required.</p></div>;
  }

  const docs = (data || []).map((d: any) => ({
    ...d,
    freshness: getFreshnessLabel(Number(d.daysSinceUpdate)),
  }));

  const filtered = docs.filter((d: any) => {
    if (filter === 'fresh') return Number(d.daysSinceUpdate) <= 7;
    if (filter === 'recent') return Number(d.daysSinceUpdate) > 7 && Number(d.daysSinceUpdate) <= 30;
    if (filter === 'aging') return Number(d.daysSinceUpdate) > 30 && Number(d.daysSinceUpdate) <= 90;
    if (filter === 'stale') return Number(d.daysSinceUpdate) > 90;
    return true;
  });

  const freshCount = docs.filter((d: any) => Number(d.daysSinceUpdate) <= 7).length;
  const recentCount = docs.filter((d: any) => Number(d.daysSinceUpdate) > 7 && Number(d.daysSinceUpdate) <= 30).length;
  const agingCount = docs.filter((d: any) => Number(d.daysSinceUpdate) > 30 && Number(d.daysSinceUpdate) <= 90).length;
  const staleCount = docs.filter((d: any) => Number(d.daysSinceUpdate) > 90).length;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/50">
        <div className="container h-14 flex items-center gap-3">
          <button onClick={() => navigate('/admin/editor')} className="text-muted-foreground hover:text-foreground"><ArrowLeft className="w-5 h-5" /></button>
          <Leaf className="w-5 h-5 text-[#d4af37]" />
          <h1 className="text-lg font-bold text-foreground">Content Freshness Report</h1>
        </div>
      </header>
      <div className="container py-6 max-w-6xl">
        <div className="grid grid-cols-4 gap-3 mb-6">
          {[
            { key: 'fresh' as const, label: 'Fresh (≤7d)', count: freshCount, color: 'border-emerald-500/30 text-emerald-400' },
            { key: 'recent' as const, label: 'Recent (8-30d)', count: recentCount, color: 'border-blue-500/30 text-blue-400' },
            { key: 'aging' as const, label: 'Aging (31-90d)', count: agingCount, color: 'border-amber-500/30 text-amber-400' },
            { key: 'stale' as const, label: 'Stale (90d+)', count: staleCount, color: 'border-red-500/30 text-red-400' },
          ].map((f) => (
            <button key={f.key} onClick={() => setFilter(filter === f.key ? 'all' : f.key)}
              className={`p-3 rounded-xl border transition-colors ${filter === f.key ? `bg-card/80 ${f.color}` : 'bg-card/40 border-border/50 hover:border-border'}`}>
              <div className={`text-xl font-bold ${f.color.split(' ')[1]}`}>{f.count}</div>
              <div className="text-[10px] text-muted-foreground">{f.label}</div>
            </button>
          ))}
        </div>
        {isLoading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="text-muted-foreground border-b border-border/50">
                <th className="text-left py-2 px-2 text-xs font-medium">Status</th>
                <th className="text-left py-2 px-2 text-xs font-medium">Document</th>
                <th className="text-left py-2 px-2 text-xs font-medium">Category</th>
                <th className="text-right py-2 px-2 text-xs font-medium">Days Since Update</th>
              </tr></thead>
              <tbody>
                {filtered.slice(0, 100).map((d: any) => (
                  <tr key={d.slug} className="border-b border-border/30 hover:bg-card/60">
                    <td className="py-2 px-2"><span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${d.freshness.color}`}>{d.freshness.icon} {d.freshness.label}</span></td>
                    <td className="py-2 px-2"><Link href={`/docs/${d.slug}`} className="text-foreground hover:text-[#d4af37] text-xs">{d.title?.slice(0, 60) || d.slug}</Link></td>
                    <td className="py-2 px-2 text-xs text-muted-foreground">{d.category}</td>
                    <td className="py-2 px-2 text-right text-xs font-mono">{Number(d.daysSinceUpdate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length > 100 && <p className="text-xs text-muted-foreground mt-3 text-center">Showing first 100 of {filtered.length} documents</p>}
          </div>
        )}
      </div>
    </div>
  );
}

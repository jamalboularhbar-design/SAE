import { useState } from 'react';
import { useLocation, Link } from 'wouter';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import { ArrowLeft, ShieldCheck, AlertTriangle, Play, Loader2, CheckCircle } from 'lucide-react';

export default function AdminQualityAuditPage() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const { data: audits, isLoading, refetch } = trpc.batch21.qualityAudits.useQuery(undefined, { enabled: isAdmin });
  const runAudit = trpc.batch21.runQualityAudit.useMutation({ onSuccess: () => refetch() });
  const [filter, setFilter] = useState<'all' | 'critical' | 'warning' | 'good'>('all');

  if (!isAdmin) {
    return <div className="min-h-screen bg-background flex items-center justify-center"><p className="text-muted-foreground">Admin access required.</p></div>;
  }

  const parsed = (audits || []).map((a: any) => ({
    ...a,
    issueList: (() => { try { return JSON.parse(a.issues); } catch { return []; } })(),
  }));

  const filtered = parsed.filter((a: any) => {
    if (filter === 'critical') return a.score < 50;
    if (filter === 'warning') return a.score >= 50 && a.score < 80;
    if (filter === 'good') return a.score >= 80;
    return true;
  });

  const criticalCount = parsed.filter((a: any) => a.score < 50).length;
  const warningCount = parsed.filter((a: any) => a.score >= 50 && a.score < 80).length;
  const goodCount = parsed.filter((a: any) => a.score >= 80).length;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/50">
        <div className="container h-14 flex items-center gap-3">
          <button onClick={() => navigate('/admin/editor')} className="text-muted-foreground hover:text-foreground"><ArrowLeft className="w-5 h-5" /></button>
          <ShieldCheck className="w-5 h-5 text-[#d4af37]" />
          <h1 className="text-lg font-bold text-foreground">Document Quality Audit</h1>
          <button onClick={() => runAudit.mutate()} disabled={runAudit.isPending}
            className="ml-auto flex items-center gap-2 px-3 py-1.5 bg-[#d4af37]/10 border border-[#d4af37]/30 rounded-lg text-sm text-[#d4af37] hover:bg-[#d4af37]/20 disabled:opacity-50">
            {runAudit.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            Run Audit
          </button>
        </div>
      </header>
      <div className="container py-6 max-w-6xl">
        {/* Summary */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <button onClick={() => setFilter('critical')} className={`p-4 rounded-xl border transition-colors ${filter === 'critical' ? 'bg-red-500/10 border-red-500/30' : 'bg-card/60 border-border/50 hover:border-red-500/20'}`}>
            <div className="text-2xl font-bold text-red-400">{criticalCount}</div>
            <div className="text-xs text-muted-foreground">Critical (score &lt; 50)</div>
          </button>
          <button onClick={() => setFilter('warning')} className={`p-4 rounded-xl border transition-colors ${filter === 'warning' ? 'bg-amber-500/10 border-amber-500/30' : 'bg-card/60 border-border/50 hover:border-amber-500/20'}`}>
            <div className="text-2xl font-bold text-amber-400">{warningCount}</div>
            <div className="text-xs text-muted-foreground">Warning (50-79)</div>
          </button>
          <button onClick={() => setFilter('good')} className={`p-4 rounded-xl border transition-colors ${filter === 'good' ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-card/60 border-border/50 hover:border-emerald-500/20'}`}>
            <div className="text-2xl font-bold text-emerald-400">{goodCount}</div>
            <div className="text-xs text-muted-foreground">Good (80+)</div>
          </button>
        </div>
        {filter !== 'all' && (
          <button onClick={() => setFilter('all')} className="mb-4 text-xs text-muted-foreground hover:text-foreground">Clear filter</button>
        )}
        {isLoading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12">
            <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
            <p className="text-muted-foreground">{parsed.length === 0 ? 'No audits run yet. Click "Run Audit" to start.' : 'No documents match this filter.'}</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((a: any) => (
              <div key={a.id} className="flex items-start gap-4 p-4 bg-card/60 border border-border/50 rounded-lg">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold ${
                  a.score < 50 ? 'bg-red-500/15 text-red-400' : a.score < 80 ? 'bg-amber-500/15 text-amber-400' : 'bg-emerald-500/15 text-emerald-400'
                }`}>{a.score}</div>
                <div className="flex-1 min-w-0">
                  <Link href={`/docs/${a.documentSlug}`} className="text-sm font-medium text-foreground hover:text-[#d4af37] truncate block">{a.documentSlug}</Link>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {a.issueList.map((issue: string, i: number) => (
                      <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-500/10 text-red-300 text-[10px] rounded-full">
                        <AlertTriangle className="w-2.5 h-2.5" />{issue}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

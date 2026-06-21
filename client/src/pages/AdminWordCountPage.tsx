import { trpc } from '@/lib/trpc';
import { useLocation } from 'wouter';
import { ArrowLeft, BarChart3, Loader2 } from 'lucide-react';
import ContextualHelp from '@/components/ContextualHelp';

export default function AdminWordCountPage() {
  const [, navigate] = useLocation();
  const { data, isLoading } = trpc.wordCountAnalytics.get.useQuery();

  const totalWords = data?.reduce((sum, c) => sum + (c.totalWords || 0), 0) || 0;
  const totalDocs = data?.reduce((sum, c) => sum + (c.docCount || 0), 0) || 0;
  const maxCategoryWords = data?.[0]?.totalWords || 1;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/50">
        <div className="container h-14 flex items-center gap-3">
          <button onClick={() => navigate('/')} className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <BarChart3 className="w-5 h-5 text-accent" />
          <h1 className="text-lg font-bold text-foreground">Word Count Analytics</h1>
          <ContextualHelp title="Word Count Analytics" description="Shows total word count distribution across all categories. Use this to identify content gaps and balance documentation coverage." />
        </div>
      </header>

      <div className="container py-8 max-w-4xl">
        {isLoading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-accent" /></div>
        ) : (
          <>
            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="p-4 rounded-xl border border-border/50 bg-card/30 text-center">
                <p className="text-2xl font-bold text-accent">{totalWords.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground mt-1">Total Words</p>
              </div>
              <div className="p-4 rounded-xl border border-border/50 bg-card/30 text-center">
                <p className="text-2xl font-bold text-accent">{totalDocs}</p>
                <p className="text-xs text-muted-foreground mt-1">Total Documents</p>
              </div>
              <div className="p-4 rounded-xl border border-border/50 bg-card/30 text-center">
                <p className="text-2xl font-bold text-accent">{totalDocs > 0 ? Math.round(totalWords / totalDocs).toLocaleString() : 0}</p>
                <p className="text-xs text-muted-foreground mt-1">Avg Words/Doc</p>
              </div>
            </div>

            {/* Category Breakdown */}
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">By Category</h2>
            <div className="space-y-3">
              {data?.map(cat => (
                <div key={cat.category} className="p-4 rounded-xl border border-border/50 bg-card/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">{cat.category}</span>
                    <span className="text-xs text-muted-foreground">{cat.docCount} docs</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-6 bg-muted/20 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-accent/70 rounded-full transition-all"
                        style={{ width: `${((cat.totalWords || 0) / maxCategoryWords) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs font-mono text-foreground w-20 text-right">{(cat.totalWords || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex gap-4 mt-2 text-[10px] text-muted-foreground">
                    <span>Avg: {(cat.avgWords || 0).toLocaleString()}</span>
                    <span>Min: {(cat.minWords || 0).toLocaleString()}</span>
                    <span>Max: {(cat.maxWords || 0).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

import { useState } from 'react';
import { useLocation } from 'wouter';
import { trpc } from '@/lib/trpc';
import { ArrowLeft, Search, TrendingUp, AlertTriangle, BarChart3 } from 'lucide-react';

export default function SearchAnalytics() {
  const [, navigate] = useLocation();

  const { data: popular, isLoading: loadingPopular } = trpc.searchAnalytics.popular.useQuery({ limit: 20 });
  const { data: summary, isLoading: loadingSummary } = trpc.searchAnalytics.summary.useQuery();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/50">
        <div className="container h-14 flex items-center gap-3">
          <button onClick={() => navigate('/')} className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <BarChart3 className="w-5 h-5 text-accent" />
          <h1 className="text-lg font-bold text-foreground">Search Analytics</h1>
        </div>
      </header>

      <div className="container py-6 sm:py-8 max-w-4xl mx-auto">
        {/* Summary Stats */}
        {loadingSummary ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            {[1,2,3,4].map(i => <div key={i} className="h-20 rounded-lg bg-card/30 animate-pulse" />)}
          </div>
        ) : summary && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            <div className="p-4 rounded-lg bg-card/30 border border-border/50 text-center">
              <p className="text-2xl font-bold text-foreground">{summary.totalSearches}</p>
              <p className="text-xs text-muted-foreground mt-1">Total Searches</p>
            </div>
            <div className="p-4 rounded-lg bg-card/30 border border-border/50 text-center">
              <p className="text-2xl font-bold text-foreground">{summary.uniqueQueries}</p>
              <p className="text-xs text-muted-foreground mt-1">Unique Queries</p>
            </div>
            <div className="p-4 rounded-lg bg-card/30 border border-border/50 text-center">
              <p className="text-2xl font-bold text-foreground">{summary.avgResultCount}</p>
              <p className="text-xs text-muted-foreground mt-1">Avg Results</p>
            </div>
            <div className="p-4 rounded-lg bg-card/30 border border-border/50 text-center">
              <p className="text-2xl font-bold text-foreground">{summary.zeroResultQueries?.length || 0}</p>
              <p className="text-xs text-muted-foreground mt-1">Zero-Result Queries</p>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {/* Popular Searches */}
          <div>
            <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-accent" />
              Popular Searches
            </h2>
            <div className="rounded-lg border border-border/50 overflow-hidden">
              {loadingPopular ? (
                <div className="p-8 text-center text-muted-foreground text-sm">Loading...</div>
              ) : popular && popular.length > 0 ? (
                <div className="divide-y divide-border/30">
                  {popular.map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-3 hover:bg-card/30 transition-colors">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-xs text-muted-foreground w-5">{i + 1}.</span>
                        <Search className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                        <span className="text-sm text-foreground truncate">{item.query}</span>
                      </div>
                      <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">{item.searchCount}x</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-muted-foreground text-sm">No search data yet.</div>
              )}
            </div>
          </div>

          {/* Zero-Result Queries */}
          <div>
            <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-500" />
              Zero-Result Queries (Content Gaps)
            </h2>
            <div className="rounded-lg border border-border/50 overflow-hidden">
              {summary?.zeroResultQueries && summary.zeroResultQueries.length > 0 ? (
                <div className="divide-y divide-border/30">
                  {summary.zeroResultQueries.map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-3 hover:bg-card/30 transition-colors">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-xs text-muted-foreground w-5">{i + 1}.</span>
                        <span className="text-sm text-foreground truncate">{item.query}</span>
                      </div>
                      <span className="text-xs text-red-400 ml-2 flex-shrink-0">{item.searchCount}x</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-muted-foreground text-sm">No zero-result queries yet.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

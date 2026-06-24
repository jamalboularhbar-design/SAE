import { useMemo, useState } from 'react';
import { useLocation, useSearch } from 'wouter';
import { trpc } from '@/lib/trpc';
import { ArrowLeft, Network, Loader2, Search, Filter, X } from 'lucide-react';
import Header from '@/components/Header';
import KnowledgeGraphView from '@/components/KnowledgeGraphView';
import { useIsMobile } from '@/hooks/useMobile';

export default function DocumentGraphPage() {
  const [, navigate] = useLocation();
  const search = useSearch();
  const isMobile = useIsMobile();
  const focusSlug = useMemo(() => new URLSearchParams(search).get('focus'), [search]);
  const { data, isLoading } = trpc.documentGraph.get.useQuery();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const graphHeight = isMobile ? 360 : 620;

  const categories = useMemo(() => {
    if (!data) return [];
    return Array.from(new Set(data.nodes.map((n) => n.group).filter(Boolean))) as string[];
  }, [data]);

  const stats = useMemo(() => {
    if (!data) return { docs: 0, deps: 0, refs: 0 };
    return {
      docs: data.nodes.length,
      deps: data.edges.filter((e) => e.type === 'dependency').length,
      refs: data.edges.filter((e) => e.type !== 'dependency').length,
    };
  }, [data]);

  return (
    <div className="min-h-screen bg-background">
      {!isMobile && <Header />}

      <div className="border-b border-border/50 bg-muted/20">
        <div className="container py-3 sm:py-4 flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="text-foreground/60 hover:text-foreground transition-colors shrink-0"
            aria-label="Back to library"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <Network className="w-5 h-5 text-accent shrink-0 hidden sm:block" />
          <div className="min-w-0 flex-1">
            <h1 className="text-base sm:text-lg font-bold text-foreground leading-tight truncate">Knowledge Graph</h1>
            {!isMobile && (
              <p className="text-xs text-muted-foreground">
                Explore document dependencies and cross-references across the library
              </p>
            )}
          </div>
          <div className="flex shrink-0 gap-2 text-[10px] sm:text-xs text-muted-foreground">
            <span>{stats.docs} docs</span>
          </div>
        </div>
      </div>

      <div className="container py-4 sm:py-6 pb-24 sm:pb-28">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-3 sm:mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/45" />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 bg-card border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/50 hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-foreground/45 shrink-0 hidden sm:block" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="flex-1 sm:flex-none bg-card border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {(searchQuery || selectedCategory !== 'all') && (
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
              className="px-3 py-2 text-sm text-accent border border-accent/30 rounded-lg hover:bg-accent/5 transition-colors"
            >
              Reset
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-accent" />
          </div>
        ) : data && data.nodes.length > 0 ? (
          <KnowledgeGraphView
            nodes={data.nodes}
            edges={data.edges}
            searchQuery={searchQuery}
            selectedCategory={selectedCategory}
            height={graphHeight}
            initialFocusSlug={focusSlug}
          />
        ) : (
          <div className="text-center py-16 text-muted-foreground rounded-xl border border-border">
            <Network className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="font-medium text-foreground mb-1">No graph data yet</p>
            <p className="text-sm">Document dependencies and cross-references will appear here as the library grows.</p>
          </div>
        )}
      </div>
    </div>
  );
}

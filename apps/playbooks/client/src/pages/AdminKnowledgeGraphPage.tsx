import { useMemo, useState } from 'react';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import { ArrowLeft, Share2, Loader2, Search, Filter, X } from 'lucide-react';
import { useLocation } from 'wouter';
import KnowledgeGraphView from '@/components/KnowledgeGraphView';

export default function AdminKnowledgeGraphPage() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const isAdmin = user?.role === 'admin';
  const { data, isLoading } = trpc.knowledgeGraph.data.useQuery(undefined, { enabled: isAdmin });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

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

  if (!isAdmin) {
    return <div className="p-8 text-center text-muted-foreground">Admin access required</div>;
  }

  return (
    <div className="min-h-screen bg-background pb-28">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container h-14 flex items-center gap-3">
          <button onClick={() => navigate('/')} className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <Share2 className="w-5 h-5 text-accent" />
          <div>
            <h1 className="text-lg font-bold text-foreground leading-tight">Knowledge Graph</h1>
            <p className="text-[11px] text-muted-foreground">Documents, dependencies & cross-references</p>
          </div>
        </div>
      </header>

      <div className="container py-6">
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by document name or slug..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2 bg-card border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-card border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
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
              className="px-3 py-2 text-sm text-accent hover:text-accent/80 border border-accent/30 rounded-lg transition-colors"
            >
              Reset
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
          <span>{stats.docs} documents</span>
          <span>{stats.deps} dependencies</span>
          <span>{stats.refs} cross-references</span>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-accent" /></div>
        ) : data && data.nodes.length > 0 ? (
          <KnowledgeGraphView
            nodes={data.nodes}
            edges={data.edges}
            searchQuery={searchQuery}
            selectedCategory={selectedCategory}
            height={640}
          />
        ) : (
          <div className="text-center py-16 text-muted-foreground rounded-xl border border-border">
            <Share2 className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p>No documents or relationships found.</p>
            <p className="text-xs mt-2">Add document dependencies or cross-references to populate the graph.</p>
          </div>
        )}
      </div>
    </div>
  );
}

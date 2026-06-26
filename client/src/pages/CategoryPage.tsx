import { useState, useMemo } from 'react';
import { useParams, useLocation } from 'wouter';
import { trpc } from '@/lib/trpc';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, FileText, Clock, Search, ArrowUpDown } from 'lucide-react';
import SubscribeButton from '@/components/SubscribeButton';

export default function CategoryPage() {
  const params = useParams<{ category: string }>();
  const [, navigate] = useLocation();
  const category = decodeURIComponent(params.category || '');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<'alpha' | 'reading_time' | 'newest'>('alpha');

  const { data, isLoading } = trpc.documents.list.useQuery(
    { category, limit: 600, sort, search: search || undefined },
    { enabled: !!category }
  );

  const documents = useMemo(() => data?.documents ?? [], [data]);
  const total = data?.total ?? 0;

  // Calculate category stats
  const totalWords = useMemo(() => documents.reduce((sum, d) => sum + (d.wordCount || 0), 0), [documents]);
  const avgReadingTime = useMemo(() => documents.length > 0 ? Math.ceil(totalWords / documents.length / 200) : 0, [totalWords, documents.length]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/50">
        <div className="container h-14 flex items-center gap-3">
          <button onClick={() => navigate('/')} className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="min-w-0">
            <h1 className="text-lg font-bold text-foreground truncate">{category}</h1>
          </div>
        </div>
      </header>

      <div className="container py-6 sm:py-8">
        {/* Category Cover Image & Subscribe */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Category Overview</h2>
          </div>
          <SubscribeButton targetType="category" targetValue={category} />
        </div>

        {/* Category Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="p-4 rounded-lg bg-card/30 border border-border/50 text-center">
            <p className="text-2xl font-bold text-accent">{total}</p>
            <p className="text-xs text-muted-foreground mt-1">Documents</p>
          </div>
          <div className="p-4 rounded-lg bg-card/30 border border-border/50 text-center">
            <p className="text-2xl font-bold text-accent">{totalWords.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-1">Total Words</p>
          </div>
          <div className="p-4 rounded-lg bg-card/30 border border-border/50 text-center">
            <p className="text-2xl font-bold text-accent">{avgReadingTime}</p>
            <p className="text-xs text-muted-foreground mt-1">Avg. Min Read</p>
          </div>
        </div>

        {/* Word Cloud */}
        {!search && documents.length > 0 && (
          <div className="mb-8">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Frequent Terms</h2>
            <div className="flex flex-wrap gap-2 p-4 rounded-xl bg-card/30 border border-border/50">
              {(() => {
                const stopWords = new Set(['the','a','an','is','are','was','were','be','been','being','have','has','had','do','does','did','will','would','could','should','may','might','shall','can','need','dare','to','of','in','for','on','with','at','by','from','as','into','through','during','before','after','above','below','between','out','off','over','under','again','further','then','once','here','there','when','where','why','how','all','each','every','both','few','more','most','other','some','such','no','nor','not','only','own','same','so','than','too','very','just','because','and','but','or','if','while','that','this','it','its','they','them','their','we','our','you','your','he','she','his','her','i','me','my','what','which','who','whom']);
                const wordCounts: Record<string, number> = {};
                documents.forEach(doc => {
                  const words = (doc.title + ' ' + (doc.snippet || '')).toLowerCase().replace(/[^a-z\s]/g, '').split(/\s+/);
                  words.forEach(w => {
                    if (w.length > 3 && !stopWords.has(w)) {
                      wordCounts[w] = (wordCounts[w] || 0) + 1;
                    }
                  });
                });
                const sorted = Object.entries(wordCounts).sort((a, b) => b[1] - a[1]).slice(0, 30);
                const maxCount = sorted[0]?.[1] || 1;
                return sorted.map(([word, count]) => {
                  const size = 12 + Math.round((count / maxCount) * 16);
                  const opacity = 0.5 + (count / maxCount) * 0.5;
                  return (
                    <span key={word} style={{ fontSize: `${size}px`, opacity }} className="text-accent font-medium">
                      {word}
                    </span>
                  );
                });
              })()}
            </div>
          </div>
        )}

        {/* Featured Documents */}
        {!search && documents.length > 3 && (
          <div className="mb-8">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Featured Documents</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {documents.slice(0, 3).map(doc => (
                <button
                  key={doc.slug}
                  onClick={() => navigate(`/docs/${doc.slug}`)}
                  className="p-4 rounded-xl border border-accent/20 bg-accent/5 hover:bg-accent/10 transition-colors text-left group"
                >
                  <FileText className="w-5 h-5 text-accent mb-2" />
                  <p className="text-sm font-medium text-foreground line-clamp-2 group-hover:text-accent transition-colors">{doc.title}</p>
                  {doc.wordCount && (
                    <p className="text-[10px] text-muted-foreground mt-2">{Math.ceil(doc.wordCount / 200)} min read</p>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Search and Sort */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={`Search within ${category}...`}
              className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-card/50 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent/50 text-sm"
            />
          </div>
          <select
            value={sort}
            onChange={e => setSort(e.target.value as typeof sort)}
            className="px-3 py-2 rounded-md border border-border bg-card text-foreground text-sm"
          >
            <option value="alpha">A-Z</option>
            <option value="reading_time">Reading Time</option>
            <option value="newest">Newest</option>
          </select>
        </div>

        {/* Document List */}
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-16 rounded-lg bg-card/20 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {documents.map(doc => (
              <button
                key={doc.slug}
                onClick={() => navigate(`/docs/${doc.slug}`)}
                className="w-full flex items-center gap-3 p-3 sm:p-4 rounded-lg border border-border/50 bg-card/30 hover:border-accent/30 active:bg-card/50 transition-all text-left group"
              >
                <FileText className="w-4 h-4 text-muted-foreground flex-shrink-0 group-hover:text-accent transition-colors" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate group-hover:text-accent transition-colors">{doc.title}</p>
                  <div className="flex items-center gap-3 mt-1">
                    {doc.wordCount && (
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {Math.ceil(doc.wordCount / 200)} min
                      </span>
                    )}
                    {doc.wordCount && (
                      <span className="text-[10px] text-muted-foreground">
                        {doc.wordCount.toLocaleString()} words
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {documents.length === 0 && !isLoading && (
          <div className="text-center py-12 text-muted-foreground">
            <p>No documents found{search ? ` matching "${search}"` : ''}.</p>
          </div>
        )}
      </div>
    </div>
  );
}

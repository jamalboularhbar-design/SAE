import { useState, useMemo, useEffect } from 'react';
import { useLocation, Link } from 'wouter';
import { trpc } from '@/lib/trpc';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Search, Clock, Filter, X, Tag } from 'lucide-react';
import SavedSearchFilters from '@/components/SavedSearchFilters';

export default function SearchResultsPage() {
  const [location, setLocation] = useLocation();
  const params = new URLSearchParams(window.location.search);
  const initialQuery = params.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sort, setSort] = useState<'alpha' | 'reading_time' | 'newest'>('alpha');
  const [minReadingTime, setMinReadingTime] = useState<number | undefined>();
  const [maxReadingTime, setMaxReadingTime] = useState<number | undefined>();
  const [showFilters, setShowFilters] = useState(false);
  const [useRelevance, setUseRelevance] = useState(true);
  const [locale, setLocale] = useState<string>('');

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(timer);
  }, [query]);

  // Update URL when query changes
  useEffect(() => {
    if (debouncedQuery) {
      window.history.replaceState({}, '', `/search?q=${encodeURIComponent(debouncedQuery)}`);
    }
  }, [debouncedQuery]);

  // Use relevance search when enabled
  const { data: relevanceResults } = trpc.relevanceSearch.search.useQuery({
    query: debouncedQuery,
    category: selectedCategory || undefined,
    locale: locale || undefined,
    limit: 50,
  }, { enabled: useRelevance && debouncedQuery.length >= 1 });

  const { data: standardResults, isLoading } = trpc.documents.list.useQuery({
    search: debouncedQuery || undefined,
    category: selectedCategory || undefined,
    sort,
    limit: 50,
    offset: 0,
    tags: selectedTags.length > 0 ? selectedTags : undefined,
    minReadingTime,
    maxReadingTime,
  }, { enabled: !useRelevance && debouncedQuery.length >= 1 });

  // Merge results based on mode
  const results = useRelevance && relevanceResults
    ? { documents: relevanceResults, total: relevanceResults.length }
    : standardResults;

  const { data: categories } = trpc.documents.categories.useQuery();
  const { data: allTags } = trpc.tags.all.useQuery();

  const logMutation = trpc.searchAnalytics.log.useMutation();
  const saveHistoryMut = trpc.searchHistory.save.useMutation();

  useEffect(() => {
    if (debouncedQuery && results) {
      logMutation.mutate({ query: debouncedQuery, resultCount: results.total });
      saveHistoryMut.mutate({ query: debouncedQuery, resultCount: results.total });
    }
  }, [debouncedQuery, results?.total]);

  const HighlightText = ({ text, highlight }: { text: string; highlight: string }) => {
    if (!highlight.trim()) return <span>{text}</span>;
    const regex = new RegExp(`(${highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return (
      <span>
        {parts.map((part, i) =>
          regex.test(part) ? <mark key={i} className="bg-amber-500/30 text-inherit rounded px-0.5">{part}</mark> : <span key={i}>{part}</span>
        )}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => setLocation('/')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search documents..."
              className="pl-10 bg-muted/50"
              autoFocus
            />
          </div>
          <Button
            variant={showFilters ? 'default' : 'outline'}
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-4 h-4 mr-1" />
            Filters
          </Button>
        </div>

        {/* Saved Search Filters */}
        <div className="max-w-6xl mx-auto px-4 py-2 border-t border-border/30">
          <SavedSearchFilters
            currentFilterConfig={JSON.stringify({
              category: selectedCategory,
              tags: selectedTags,
              sort,
              minReadingTime,
              maxReadingTime,
              locale,
              useRelevance,
            })}
            onApplyFilter={(config) => {
              try {
                const parsed = JSON.parse(config);
                if (parsed.category !== undefined) setSelectedCategory(parsed.category || '');
                if (parsed.tags !== undefined) setSelectedTags(parsed.tags || []);
                if (parsed.sort !== undefined) setSort(parsed.sort || 'alpha');
                if (parsed.minReadingTime !== undefined) setMinReadingTime(parsed.minReadingTime || undefined);
                if (parsed.maxReadingTime !== undefined) setMaxReadingTime(parsed.maxReadingTime || undefined);
                if (parsed.locale !== undefined) setLocale(parsed.locale || '');
                if (parsed.useRelevance !== undefined) setUseRelevance(parsed.useRelevance);
              } catch (e) { /* ignore parse errors */ }
            }}
          />
        </div>

        {/* Faceted Filters */}
        {showFilters && (
          <div className="max-w-6xl mx-auto px-4 pb-3 space-y-3 border-t border-border pt-3">
            {/* Category filter */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Category</label>
              <div className="flex flex-wrap gap-1.5">
                <Badge
                  variant={selectedCategory === '' ? 'default' : 'outline'}
                  className="cursor-pointer text-xs"
                  onClick={() => setSelectedCategory('')}
                >
                  All
                </Badge>
                {categories?.map(cat => (
                  <Badge
                    key={cat.category}
                    variant={selectedCategory === cat.category ? 'default' : 'outline'}
                    className="cursor-pointer text-xs"
                    onClick={() => setSelectedCategory(cat.category === selectedCategory ? '' : cat.category)}
                  >
                    {cat.category} ({cat.count})
                  </Badge>
                ))}
              </div>
            </div>

            {/* Tags filter */}
            {allTags && allTags.length > 0 && (
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Tags</label>
                <div className="flex flex-wrap gap-1.5">
                  {allTags.slice(0, 15).map(t => (
                    <Badge
                      key={t.tag}
                      variant={selectedTags.includes(t.tag) ? 'default' : 'outline'}
                      className="cursor-pointer text-xs"
                      onClick={() => setSelectedTags(prev =>
                        prev.includes(t.tag) ? prev.filter(x => x !== t.tag) : [...prev, t.tag]
                      )}
                    >
                      <Tag className="w-3 h-3 mr-1" />
                      {t.tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Reading time + Sort */}
            <div className="flex flex-wrap gap-4 items-end">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Reading Time (min)</label>
                <div className="flex gap-2 items-center">
                  <Input
                    type="number"
                    placeholder="Min"
                    className="w-20 h-8 text-xs"
                    value={minReadingTime || ''}
                    onChange={(e) => setMinReadingTime(e.target.value ? Number(e.target.value) : undefined)}
                  />
                  <span className="text-muted-foreground text-xs">to</span>
                  <Input
                    type="number"
                    placeholder="Max"
                    className="w-20 h-8 text-xs"
                    value={maxReadingTime || ''}
                    onChange={(e) => setMaxReadingTime(e.target.value ? Number(e.target.value) : undefined)}
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Sort</label>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as any)}
                  className="h-8 text-xs rounded border border-border bg-background px-2"
                  disabled={useRelevance}
                >
                  <option value="alpha">A-Z</option>
                  <option value="reading_time">Reading Time</option>
                  <option value="newest">Newest</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Language</label>
                <select
                  value={locale}
                  onChange={(e) => setLocale(e.target.value)}
                  className="h-8 text-xs rounded border border-border bg-background px-2"
                >
                  <option value="">All</option>
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                  <option value="ja">Japanese</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-xs font-medium text-muted-foreground">Relevance</label>
                <button
                  onClick={() => setUseRelevance(!useRelevance)}
                  className={`w-9 h-5 rounded-full transition-colors ${useRelevance ? 'bg-[#d4af37]' : 'bg-gray-600'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${useRelevance ? 'translate-x-4.5' : 'translate-x-0.5'}`} />
                </button>
              </div>
              {(selectedCategory || selectedTags.length > 0 || minReadingTime || maxReadingTime) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedCategory('');
                    setSelectedTags([]);
                    setMinReadingTime(undefined);
                    setMaxReadingTime(undefined);
                  }}
                >
                  <X className="w-3 h-3 mr-1" /> Clear all
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        {!debouncedQuery && (
          <div className="text-center py-16 text-muted-foreground">
            <Search className="w-12 h-12 mx-auto mb-4 opacity-40" />
            <p className="text-lg">Type a query to search 525+ documents</p>
          </div>
        )}

        {debouncedQuery && isLoading && (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse bg-muted/30 rounded-lg h-24" />
            ))}
          </div>
        )}

        {debouncedQuery && results && (
          <>
            <p className="text-sm text-muted-foreground mb-4">
              {results.total} result{results.total !== 1 ? 's' : ''} for "<strong>{debouncedQuery}</strong>"
              {selectedCategory && <> in <Badge variant="outline" className="ml-1 text-xs">{selectedCategory}</Badge></>}
            </p>

            {results.documents.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <p>No documents found matching your criteria.</p>
                <p className="text-sm mt-2">Try adjusting your filters or search terms.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {results.documents.map((doc: any) => (
                  <Link key={doc.slug} href={`/docs/${doc.slug}`}>
                    <div className="block p-4 rounded-lg border border-border hover:border-amber-500/50 hover:bg-muted/30 transition-colors cursor-pointer">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-foreground truncate">
                            <HighlightText text={doc.title} highlight={debouncedQuery} />
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">{doc.category}</Badge>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {Math.ceil((doc.wordCount || 0) / 200)} min read
                            </span>
                            {doc.pinned === 1 && <Badge className="text-xs bg-amber-500/20 text-amber-400">Pinned</Badge>}
                          </div>
                          {doc.snippet && (
                            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                              <HighlightText text={doc.snippet} highlight={debouncedQuery} />
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

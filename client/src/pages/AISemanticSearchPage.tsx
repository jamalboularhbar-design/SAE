import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Search, Sparkles, Loader2, FileText, ArrowRight } from 'lucide-react';
import { Link } from 'wouter';

export default function AISemanticSearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ slug: string; title: string; relevance: number; explanation: string }[]>([]);
  const [searchedQuery, setSearchedQuery] = useState('');

  const search = trpc.ai.semanticSearch.useMutation({
    onSuccess: (data) => {
      setResults(data.results);
      setSearchedQuery(data.intent);
      if (data.results.length === 0) toast.info('No relevant documents found');
    },
    onError: () => toast.error('Search failed'),
  });

  const handleSearch = () => {
    if (query.trim().length < 2) { toast.error('Enter at least 2 characters'); return; }
    search.mutate({ query });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-8">
          <Badge className="mb-2 bg-blue-500/10 text-blue-600">AI Services</Badge>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Search className="w-6 h-6 text-blue-500" /> AI Semantic Search
          </h1>
          <p className="text-muted-foreground mt-1">Search documents using natural language — AI understands intent, not just keywords</p>
        </div>

        {/* Search Bar */}
        <Card className="mb-6">
          <CardContent className="pt-5">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSearch()}
                  placeholder="Ask in natural language... e.g. 'How do we handle VIP client escalations?'"
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-muted/30 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                />
              </div>
              <Button onClick={handleSearch} disabled={search.isPending} className="bg-blue-600 hover:bg-blue-700">
                {search.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {searchedQuery && (
          <p className="text-sm text-muted-foreground mb-4">
            Showing results for: <span className="font-medium text-foreground">"{searchedQuery}"</span>
          </p>
        )}

        {results.length > 0 && (
          <div className="space-y-3">
            {results.map((r, i) => (
              <Card key={i} className="hover:border-blue-500/30 transition-colors">
                <CardContent className="py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <FileText className="w-4 h-4 text-blue-500" />
                        <span className="font-medium text-sm">{r.title || r.slug.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{r.explanation}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className={`text-lg font-bold ${r.relevance >= 70 ? 'text-green-500' : r.relevance >= 40 ? 'text-amber-500' : 'text-muted-foreground'}`}>
                          {r.relevance}%
                        </div>
                        <p className="text-[10px] text-muted-foreground">relevance</p>
                      </div>
                      <Link href={`/docs/${r.slug}`}>
                        <Button variant="ghost" size="sm"><ArrowRight className="w-4 h-4" /></Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {searchedQuery && results.length === 0 && !search.isPending && (
          <Card className="border-dashed">
            <CardContent className="py-8 text-center">
              <Search className="w-8 h-8 mx-auto text-muted-foreground/50 mb-2" />
              <p className="text-sm text-muted-foreground">No documents matched your query. Try rephrasing.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

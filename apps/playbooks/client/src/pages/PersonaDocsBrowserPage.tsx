import { useState, useMemo } from 'react';
import { useParams, useLocation } from 'wouter';
import { trpc } from '@/lib/trpc';
import { Link } from 'wouter';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, FileText, Clock, Search, BookOpen, Plane, Palette, ChevronRight, Filter } from 'lucide-react';

const PERSONA_CONFIG: Record<string, { title: string; subtitle: string; category: string; icon: typeof Plane; color: string }> = {
  'riad-routes': {
    title: 'Riad & Routes',
    subtitle: 'Hospitality & Travel Operations',
    category: 'Riad & Routes',
    icon: Plane,
    color: 'text-amber-500'
  },
  'artkech': {
    title: 'ArtKech Design Studio',
    subtitle: 'Creative Studio Operations',
    category: 'ArtKech Design Studio',
    icon: Palette,
    color: 'text-purple-500'
  }
};

export default function PersonaDocsBrowserPage() {
  const params = useParams<{ persona: string }>();
  const [, navigate] = useLocation();
  const persona = params.persona || '';
  const config = PERSONA_CONFIG[persona];
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<'alpha' | 'reading_time' | 'newest'>('alpha');

  const { data, isLoading } = trpc.documents.list.useQuery(
    { category: config?.category || '', limit: 600, sort, search: search || undefined },
    { enabled: !!config }
  );

  const documents = useMemo(() => data?.documents ?? [], [data]);

  // Group documents by subcategory based on title patterns
  const groupedDocs = useMemo(() => {
    if (!documents.length) return {};
    const groups: Record<string, typeof documents> = {};
    documents.forEach(doc => {
      // Derive subcategory from title keywords
      let subcategory = 'General Operations';
      const title = doc.title.toLowerCase();
      if (persona === 'riad-routes') {
        if (title.includes('guest') || title.includes('check-in') || title.includes('checkout') || title.includes('departure') || title.includes('vip')) subcategory = 'Guest Services';
        else if (title.includes('housekeeping') || title.includes('hammam') || title.includes('spa') || title.includes('provider')) subcategory = 'Provider Coordination';
        else if (title.includes('tour') || title.includes('medina') || title.includes('driver') || title.includes('fleet')) subcategory = 'Tours & Transport';
        else if (title.includes('food') || title.includes('beverage') || title.includes('f&b')) subcategory = 'Food & Beverage';
        else if (title.includes('staff') || title.includes('training') || title.includes('night audit') || title.includes('security') || title.includes('commission')) subcategory = 'Team & Operations';
        else if (title.includes('pricing') || title.includes('revenue') || title.includes('supplier') || title.includes('payment') || title.includes('procurement')) subcategory = 'Finance & Procurement';
        else if (title.includes('whatsapp') || title.includes('reputation') || title.includes('review') || title.includes('complaint')) subcategory = 'Communication & Reputation';
      } else if (persona === 'artkech') {
        if (title.includes('brief') || title.includes('onboarding') || title.includes('kickoff')) subcategory = 'Client Onboarding';
        else if (title.includes('design') || title.includes('review') || title.includes('brand') || title.includes('identity')) subcategory = 'Design & Creative';
        else if (title.includes('print') || title.includes('production') || title.includes('quality') || title.includes('preflight')) subcategory = 'Production & QA';
        else if (title.includes('social') || title.includes('content') || title.includes('photography') || title.includes('portfolio')) subcategory = 'Content & Media';
        else if (title.includes('pricing') || title.includes('quotation') || title.includes('financial') || title.includes('invoice')) subcategory = 'Finance & Pricing';
        else if (title.includes('freelancer') || title.includes('contractor') || title.includes('daily') || title.includes('time') || title.includes('file') || title.includes('asset')) subcategory = 'Operations & Resources';
        else if (title.includes('feedback') || title.includes('revision') || title.includes('lead') || title.includes('business')) subcategory = 'Client Relations';
      }
      if (!groups[subcategory]) groups[subcategory] = [];
      groups[subcategory].push(doc);
    });
    return groups;
  }, [documents, persona]);

  if (!config) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">Persona not found</h2>
          <button onClick={() => navigate('/')} className="text-accent hover:underline">Return home</button>
        </div>
      </div>
    );
  }

  const Icon = config.icon;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/50">
        <div className="container h-14 flex items-center gap-3">
          <button onClick={() => navigate('/')} className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <Icon className={`w-5 h-5 ${config.color}`} />
          <div className="min-w-0">
            <h1 className="text-lg font-bold text-foreground truncate">{config.title} — Process Documents</h1>
          </div>
          <Badge variant="secondary" className="ml-auto">{documents.length} docs</Badge>
        </div>
      </header>

      <main className="container py-8 space-y-8">
        {/* Hero */}
        <div className="space-y-2">
          <h2 className="font-display text-2xl sm:text-3xl">{config.title}</h2>
          <p className="text-muted-foreground text-lg">{config.subtitle} — Standard Operating Procedures & Process Guides</p>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder={`Search ${config.title} processes...`}
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <select
              value={sort}
              onChange={e => setSort(e.target.value as 'alpha' | 'reading_time' | 'newest')}
              className="px-3 py-2 rounded-lg border border-border bg-card text-foreground text-sm"
            >
              <option value="alpha">A-Z</option>
              <option value="newest">Newest</option>
              <option value="reading_time">Reading Time</option>
            </select>
          </div>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-32 rounded-lg bg-muted/30 animate-pulse" />
            ))}
          </div>
        )}

        {/* Grouped Documents */}
        {!isLoading && Object.entries(groupedDocs).map(([subcategory, docs]) => (
          <div key={subcategory} className="space-y-4">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-accent" />
              <h3 className="font-semibold text-lg">{subcategory}</h3>
              <Badge variant="outline" className="text-xs">{docs.length}</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {docs.map(doc => (
                <Link key={doc.id} href={`/docs/${doc.slug}`}>
                  <Card className="card-premium hover:border-accent/50 transition-colors cursor-pointer group h-full">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium group-hover:text-accent transition-colors flex items-start gap-2">
                        <FileText className="w-4 h-4 mt-0.5 flex-shrink-0 text-muted-foreground" />
                        <span>{doc.title}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {Math.ceil((doc.wordCount || 0) / 200)} min read
                        </span>
                        <span>{doc.wordCount?.toLocaleString() || '—'} words</span>
                        <ChevronRight className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        ))}

        {/* Empty state */}
        {!isLoading && documents.length === 0 && (
          <div className="text-center py-16">
            <Icon className={`w-12 h-12 mx-auto mb-4 ${config.color} opacity-50`} />
            <h3 className="text-lg font-semibold mb-2">No documents found</h3>
            <p className="text-muted-foreground">No process documents match your search criteria.</p>
          </div>
        )}
      </main>
    </div>
  );
}

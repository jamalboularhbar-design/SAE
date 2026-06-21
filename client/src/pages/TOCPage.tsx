import { useMemo } from 'react';
import { useLocation } from 'wouter';
import { trpc } from '@/lib/trpc';
import { ArrowLeft, FileText, Clock, BookOpen } from 'lucide-react';

export default function TOCPage() {
  const [, navigate] = useLocation();
  const { data, isLoading } = trpc.documents.list.useQuery({ limit: 600, sort: 'alpha' });

  const grouped = useMemo(() => {
    if (!data?.documents) return {};
    const groups: Record<string, typeof data.documents> = {};
    for (const doc of data.documents) {
      if (!groups[doc.category]) groups[doc.category] = [];
      groups[doc.category].push(doc);
    }
    return groups;
  }, [data]);

  const categories = Object.keys(grouped).sort();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/50">
        <div className="container h-14 flex items-center gap-3">
          <button onClick={() => navigate('/')} className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <BookOpen className="w-5 h-5 text-accent" />
          <h1 className="text-lg font-bold text-foreground">Table of Contents</h1>
          {data && <span className="text-xs text-muted-foreground ml-2">({data.total} documents)</span>}
        </div>
      </header>

      <div className="container py-6 sm:py-8 max-w-4xl mx-auto">
        {/* Quick nav */}
        <nav className="mb-8 p-4 rounded-lg bg-card/30 border border-border/50">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Jump to Category</h2>
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <a
                key={cat}
                href={`#cat-${cat.replace(/\s+/g, '-')}`}
                className="px-2.5 py-1 rounded-md bg-accent/10 text-accent text-xs hover:bg-accent/20 transition-colors"
              >
                {cat} ({grouped[cat].length})
              </a>
            ))}
          </div>
        </nav>

        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-32 rounded-lg bg-card/20 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-8">
            {categories.map(cat => (
              <section key={cat} id={`cat-${cat.replace(/\s+/g, '-')}`}>
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border/30">
                  <h2 className="text-base font-bold text-foreground">{cat}</h2>
                  <span className="text-xs text-muted-foreground">({grouped[cat].length})</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {grouped[cat].map((doc, i) => (
                    <button
                      key={doc.slug}
                      onClick={() => navigate(`/docs/${doc.slug}`)}
                      className="flex items-center gap-2.5 p-2.5 rounded-md hover:bg-card/50 transition-colors text-left group"
                    >
                      <span className="text-[10px] text-muted-foreground/50 w-5 text-right flex-shrink-0">{i + 1}.</span>
                      <FileText className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0 group-hover:text-accent transition-colors" />
                      <span className="text-xs text-foreground truncate group-hover:text-accent transition-colors flex-1">{doc.title}</span>
                      {doc.wordCount && (
                        <span className="text-[10px] text-muted-foreground flex items-center gap-0.5 flex-shrink-0">
                          <Clock className="w-2.5 h-2.5" />
                          {Math.ceil(doc.wordCount / 200)}m
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

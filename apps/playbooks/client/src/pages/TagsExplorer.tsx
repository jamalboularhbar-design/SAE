import { useState } from 'react';
import { useLocation } from 'wouter';
import { trpc } from '@/lib/trpc';
import { ArrowLeft, Tag, FileText } from 'lucide-react';

export default function TagsExplorer() {
  const [, navigate] = useLocation();
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const { data: allTags, isLoading } = trpc.tags.all.useQuery();
  const { data: tagDocs } = trpc.tags.documentsByTag.useQuery(
    { tag: selectedTag! },
    { enabled: selectedTag !== null }
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/50">
        <div className="container h-14 flex items-center gap-3">
          <button onClick={() => navigate('/')} className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <Tag className="w-5 h-5 text-accent" />
          <h1 className="text-lg font-bold text-foreground">Tags Explorer</h1>
        </div>
      </header>

      <div className="container py-6 sm:py-8 max-w-4xl mx-auto">
        {isLoading ? (
          <div className="flex flex-wrap gap-2">
            {[1,2,3,4,5,6,7,8].map(i => (
              <div key={i} className="h-8 w-20 rounded-full bg-card/30 animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            {/* Tag Cloud */}
            <div className="mb-8">
              <h2 className="text-sm font-semibold text-foreground mb-3">All Tags ({allTags?.length || 0})</h2>
              <div className="flex flex-wrap gap-2">
                {allTags?.map(({ tag, docCount }) => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-colors ${
                      selectedTag === tag
                        ? 'bg-accent text-accent-foreground'
                        : 'bg-card/30 text-foreground border border-border/50 hover:border-accent/50'
                    }`}
                  >
                    <Tag className="w-3 h-3" />
                    {tag}
                    <span className="text-xs opacity-70">({docCount})</span>
                  </button>
                ))}
              </div>
              {(!allTags || allTags.length === 0) && (
                <p className="text-sm text-muted-foreground mt-4">No tags yet. Add tags to documents from their detail pages.</p>
              )}
            </div>

            {/* Documents for selected tag */}
            {selectedTag && (
              <div>
                <h2 className="text-sm font-semibold text-foreground mb-3">
                  Documents tagged "{selectedTag}" ({tagDocs?.length || 0})
                </h2>
                <div className="space-y-2">
                  {tagDocs?.map(doc => (
                    <button
                      key={doc.slug}
                      onClick={() => navigate(`/docs/${doc.slug}`)}
                      className="w-full text-left p-3 rounded-lg bg-card/30 border border-border/50 hover:border-accent/30 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-accent flex-shrink-0" />
                        <span className="text-sm text-foreground font-medium truncate">{doc.title}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1 ml-6">
                        <span className="text-xs text-muted-foreground">{doc.category}</span>
                        {doc.wordCount && (
                          <span className="text-xs text-muted-foreground">· {Math.ceil((doc.wordCount || 0) / 200)} min read</span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

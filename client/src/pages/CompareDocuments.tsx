import { useState, useMemo } from 'react';
import { useLocation } from 'wouter';
import { trpc } from '@/lib/trpc';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ArrowLeft, X, Plus, Search, FileText, Columns } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function CompareDocuments() {
  const [, navigate] = useLocation();
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showPicker, setShowPicker] = useState(false);

  // Search for documents to add
  const { data: searchResults } = trpc.documents.list.useQuery(
    { search: searchQuery, limit: 10 },
    { enabled: searchQuery.length >= 2 }
  );

  // Fetch selected documents
  const doc1 = trpc.documents.getBySlug.useQuery(
    { slug: selectedSlugs[0] || '' },
    { enabled: !!selectedSlugs[0] }
  );
  const doc2 = trpc.documents.getBySlug.useQuery(
    { slug: selectedSlugs[1] || '' },
    { enabled: !!selectedSlugs[1] }
  );

  const documents = [doc1.data, doc2.data].filter(Boolean);

  const addDocument = (slug: string) => {
    if (selectedSlugs.length < 2 && !selectedSlugs.includes(slug)) {
      setSelectedSlugs([...selectedSlugs, slug]);
    }
    setShowPicker(false);
    setSearchQuery('');
  };

  const removeDocument = (slug: string) => {
    setSelectedSlugs(selectedSlugs.filter(s => s !== slug));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/50">
        <div className="container h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/')} className="text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <Columns className="w-4 h-4 text-accent" />
              <h1 className="text-lg font-bold text-foreground">Compare Documents</h1>
            </div>
          </div>
          {selectedSlugs.length < 2 && (
            <button
              onClick={() => setShowPicker(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent/10 text-accent hover:bg-accent/20 transition-colors text-sm"
            >
              <Plus className="w-4 h-4" />
              Add Document ({selectedSlugs.length}/2)
            </button>
          )}
        </div>
      </header>

      {/* Document Picker Modal */}
      {showPicker && (
        <>
          <div className="fixed inset-0 z-50 bg-black/50" onClick={() => setShowPicker(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md bg-card border border-border rounded-xl shadow-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-foreground">Select Document</h3>
              <button onClick={() => setShowPicker(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search documents..."
                className="w-full pl-9 pr-4 py-2 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent/50 text-sm"
                autoFocus
              />
            </div>
            <div className="max-h-60 overflow-y-auto space-y-1">
              {(searchResults?.documents ?? []).filter(d => !selectedSlugs.includes(d.slug)).map(doc => (
                <button
                  key={doc.slug}
                  onClick={() => addDocument(doc.slug)}
                  className="w-full flex items-center gap-2.5 p-2.5 rounded-lg hover:bg-muted/50 transition-colors text-left"
                >
                  <FileText className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm truncate text-foreground">{doc.title}</p>
                    <p className="text-[10px] text-muted-foreground">{doc.category}</p>
                  </div>
                </button>
              ))}
              {searchQuery.length >= 2 && searchResults?.documents.length === 0 && (
                <p className="text-center text-sm text-muted-foreground py-4">No documents found</p>
              )}
              {searchQuery.length < 2 && (
                <p className="text-center text-sm text-muted-foreground py-4">Type at least 2 characters to search</p>
              )}
            </div>
          </div>
        </>
      )}

      {/* Comparison View */}
      <div className="container py-6">
        {selectedSlugs.length === 0 ? (
          <div className="text-center py-20">
            <Columns className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-foreground mb-2">Side-by-Side Comparison</h2>
            <p className="text-muted-foreground text-sm mb-4">Select up to 2 documents to compare them side by side.</p>
            <button
              onClick={() => setShowPicker(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-accent-foreground hover:bg-accent/90 transition-colors text-sm"
            >
              <Plus className="w-4 h-4" /> Add First Document
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {selectedSlugs.map((slug, idx) => {
              const doc = idx === 0 ? doc1.data : doc2.data;
              const loading = idx === 0 ? doc1.isLoading : doc2.isLoading;
              return (
                <div key={slug} className="border border-border/50 rounded-xl overflow-hidden bg-card/20">
                  <div className="flex items-center justify-between p-3 border-b border-border/50 bg-card/50">
                    <div className="min-w-0 flex-1">
                      {doc && (
                        <>
                          <p className="text-sm font-medium text-foreground truncate">{doc.title}</p>
                          <Badge variant="outline" className="text-[10px] mt-1">{doc.category}</Badge>
                        </>
                      )}
                    </div>
                    <button
                      onClick={() => removeDocument(slug)}
                      className="ml-2 p-1 rounded text-muted-foreground hover:text-red-400 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="p-4 max-h-[70vh] overflow-y-auto">
                    {loading ? (
                      <div className="animate-pulse space-y-3">
                        {Array.from({ length: 6 }).map((_, i) => (
                          <div key={i} className="h-4 bg-muted/30 rounded" style={{ width: `${60 + Math.random() * 40}%` }} />
                        ))}
                      </div>
                    ) : doc?.content ? (
                      <div className="prose prose-sm prose-invert max-w-none">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{doc.content}</ReactMarkdown>
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-sm">Document not found</p>
                    )}
                  </div>
                </div>
              );
            })}
            {selectedSlugs.length === 1 && (
              <button
                onClick={() => setShowPicker(true)}
                className="border-2 border-dashed border-border/50 rounded-xl flex flex-col items-center justify-center py-20 hover:border-accent/30 transition-colors"
              >
                <Plus className="w-8 h-8 text-muted-foreground/50 mb-2" />
                <p className="text-sm text-muted-foreground">Add second document</p>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

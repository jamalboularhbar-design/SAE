import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Archive, RotateCcw, Loader2, CheckSquare, Square } from 'lucide-react';

export default function AdminArchivePage() {
  const { data, isLoading } = trpc.documents.list.useQuery({ status: 'draft', limit: 100, offset: 0 });
  const restoreMutation = trpc.archive.restore.useMutation();
  const utils = trpc.useUtils();
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggleSelect = (slug: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  };

  const handleRestore = async (status: 'draft' | 'review' | 'published') => {
    if (selected.size === 0) return;
    await restoreMutation.mutateAsync({ slugs: Array.from(selected), status });
    setSelected(new Set());
    utils.documents.list.invalidate();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-accent" />
      </div>
    );
  }

  const docs = data?.documents || [];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Archive className="w-6 h-6 text-accent" />
            <h1 className="text-2xl font-bold text-foreground">Archived Documents</h1>
          </div>
          {selected.size > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">{selected.size} selected</span>
              <Button size="sm" onClick={() => handleRestore('published')} disabled={restoreMutation.isPending}>
                <RotateCcw className="w-3.5 h-3.5 mr-1" /> Restore as Published
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleRestore('draft')} disabled={restoreMutation.isPending}>
                Restore as Draft
              </Button>
            </div>
          )}
        </div>

        <p className="text-sm text-muted-foreground mb-4">
          Documents in "draft" status that were archived. Select and restore them to make them visible again.
        </p>

        <div className="space-y-2">
          {docs.map((doc: any) => (
            <Card key={doc.slug} className={selected.has(doc.slug) ? 'ring-1 ring-accent' : ''}>
              <CardContent className="py-3">
                <div className="flex items-center gap-3">
                  <button onClick={() => toggleSelect(doc.slug)} className="text-muted-foreground hover:text-accent transition-colors">
                    {selected.has(doc.slug) ? <CheckSquare className="w-4 h-4 text-accent" /> : <Square className="w-4 h-4" />}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{doc.title}</p>
                    <p className="text-xs text-muted-foreground">{doc.category} · {doc.wordCount} words</p>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {doc.createdAt ? new Date(doc.createdAt).toLocaleDateString() : ''}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
          {docs.length === 0 && (
            <p className="text-center text-muted-foreground py-12">No archived documents.</p>
          )}
        </div>
      </div>
    </div>
  );
}

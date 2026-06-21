import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { FileText, ArrowRight } from 'lucide-react';

type DocStatus = 'draft' | 'review' | 'published';

const statusConfig: Record<DocStatus, { label: string; color: string; bg: string }> = {
  draft: { label: 'Draft', color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/30' },
  review: { label: 'In Review', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/30' },
  published: { label: 'Published', color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/30' },
};

export default function KanbanBoard() {
  const { data: drafts, refetch: refetchDrafts } = trpc.documents.list.useQuery({ status: 'draft', limit: 50 });
  const { data: reviews, refetch: refetchReviews } = trpc.documents.list.useQuery({ status: 'review' as any, limit: 50 });
  const { data: published, refetch: refetchPublished } = trpc.documents.list.useQuery({ status: 'published', limit: 50 });

  const batchStatusMutation = trpc.documents.batchUpdateStatus.useMutation({
    onSuccess: () => {
      refetchDrafts();
      refetchReviews();
      refetchPublished();
      toast.success('Status updated');
    },
    onError: (err) => toast.error(err.message),
  });

  const [draggingSlug, setDraggingSlug] = useState<string | null>(null);

  const handleDrop = (targetStatus: DocStatus) => {
    if (draggingSlug) {
      batchStatusMutation.mutate({ slugs: [draggingSlug], status: targetStatus });
      setDraggingSlug(null);
    }
  };

  const moveDoc = (slug: string, targetStatus: DocStatus) => {
    batchStatusMutation.mutate({ slugs: [slug], status: targetStatus });
  };

  const columns: Array<{ status: DocStatus; data: any }> = [
    { status: 'draft', data: drafts },
    { status: 'review', data: reviews },
    { status: 'published', data: published },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {columns.map(({ status, data }) => {
        const config = statusConfig[status];
        const docs = data?.documents || [];
        return (
          <div
            key={status}
            className={`rounded-lg border p-4 min-h-[300px] ${config.bg}`}
            onDragOver={e => e.preventDefault()}
            onDrop={() => handleDrop(status)}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className={`font-semibold text-sm ${config.color}`}>{config.label}</h3>
              <Badge variant="secondary" className="text-xs">{docs.length}</Badge>
            </div>
            <div className="space-y-2">
              {docs.map((doc: any) => (
                <Card
                  key={doc.slug}
                  className="cursor-grab active:cursor-grabbing bg-card/80 hover:bg-card transition-colors"
                  draggable
                  onDragStart={() => setDraggingSlug(doc.slug)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-start gap-2">
                      <FileText className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{doc.title}</p>
                        <p className="text-xs text-muted-foreground">{doc.category}</p>
                      </div>
                    </div>
                    <div className="flex gap-1 mt-2">
                      {status !== 'draft' && (
                        <button
                          onClick={() => moveDoc(doc.slug, 'draft')}
                          className="text-xs text-yellow-400 hover:underline"
                        >
                          → Draft
                        </button>
                      )}
                      {status !== 'review' && (
                        <button
                          onClick={() => moveDoc(doc.slug, 'review')}
                          className="text-xs text-blue-400 hover:underline"
                        >
                          → Review
                        </button>
                      )}
                      {status !== 'published' && (
                        <button
                          onClick={() => moveDoc(doc.slug, 'published')}
                          className="text-xs text-green-400 hover:underline"
                        >
                          → Publish
                        </button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
              {docs.length === 0 && (
                <p className="text-xs text-muted-foreground text-center py-8 italic">
                  No documents in {config.label.toLowerCase()}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Sparkles, Loader2, CheckCircle } from 'lucide-react';

export default function AdminBatchSummarizePage() {
  const [summarized, setSummarized] = useState<Set<string>>(new Set());
  const [processing, setProcessing] = useState<string | null>(null);
  const utils = trpc.useUtils();
  const { data: unsummarized, isLoading } = trpc.batchSummarize.getUnsummarized.useQuery({ limit: 20 });
  const summarizeMut = trpc.batchSummarize.summarize.useMutation({
    onSuccess: (result) => {
      setSummarized(prev => { const next = new Set(Array.from(prev)); next.add(result.slug); return next; });
      setProcessing(null);
      toast.success(`Summary generated for "${result.slug}"`);
    },
    onError: () => { setProcessing(null); toast.error('Summarization failed'); },
  });

  const handleSummarizeOne = (doc: any) => {
    setProcessing(doc.slug);
    summarizeMut.mutate({ slug: doc.slug, title: doc.title, content: doc.content || '' });
  };

  const handleSummarizeAll = async () => {
    if (!unsummarized?.length) return;
    for (const doc of unsummarized) {
      if (summarized.has(doc.slug)) continue;
      setProcessing(doc.slug);
      try {
        await summarizeMut.mutateAsync({ slug: doc.slug, title: doc.title, content: doc.content || '' });
      } catch {
        break;
      }
    }
    setProcessing(null);
    utils.batchSummarize.getUnsummarized.invalidate();
    toast.success('Batch summarization complete');
  };

  const remaining = unsummarized?.filter(d => !summarized.has(d.slug)) || [];

  return (
    <div className="container max-w-4xl py-8">
      <div className="flex items-center gap-3 mb-6">
        <Sparkles className="w-6 h-6 text-yellow-400" />
        <div>
          <h1 className="text-2xl font-bold">Batch AI Summarization</h1>
          <p className="text-sm text-muted-foreground">Generate AI summaries for documents that don't have one yet</p>
        </div>
      </div>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="text-lg">Unsummarized Documents</CardTitle>
          <CardDescription>
            {isLoading ? 'Loading...' : `${remaining.length} document(s) without AI summaries`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {remaining.length > 0 && (
            <Button onClick={handleSummarizeAll} disabled={!!processing} className="mb-4">
              {processing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
              Summarize All ({remaining.length})
            </Button>
          )}

          {isLoading ? (
            <p className="text-muted-foreground">Loading documents...</p>
          ) : !unsummarized?.length ? (
            <p className="text-muted-foreground">All documents already have summaries!</p>
          ) : (
            <div className="space-y-2">
              {unsummarized.map((doc: any) => (
                <div key={doc.slug} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    {summarized.has(doc.slug) ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : null}
                    <span className="font-medium text-sm">{doc.title}</span>
                    <Badge variant="outline" className="text-xs">{doc.slug}</Badge>
                  </div>
                  {!summarized.has(doc.slug) && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSummarizeOne(doc)}
                      disabled={!!processing}
                    >
                      {processing === doc.slug ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Summarize'}
                    </Button>
                  )}
                  {summarized.has(doc.slug) && (
                    <Badge className="bg-green-600">Done</Badge>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

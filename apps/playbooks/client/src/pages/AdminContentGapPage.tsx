import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Lightbulb, Sparkles, Check, X, Loader2 } from 'lucide-react';

export default function AdminContentGapPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const { data: suggestions, refetch } = trpc.contentGap.suggestions.useQuery(undefined, { enabled: isAdmin });
  const analyzeMut = trpc.contentGap.analyze.useMutation({
    onSuccess: (r) => { refetch(); toast.success(`Found ${r.count} content gap suggestions`); },
    onError: () => toast.error('Analysis failed'),
  });
  const updateMut = trpc.contentGap.updateStatus.useMutation({ onSuccess: () => { refetch(); toast.success('Updated'); } });

  if (!isAdmin) return <div className="p-8 text-center text-muted-foreground">Admin access required</div>;

  const pending = suggestions?.filter((s: any) => s.status === 'pending') || [];
  const resolved = suggestions?.filter((s: any) => s.status !== 'pending') || [];

  return (
    <div className="container max-w-4xl py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Lightbulb className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">Content Gap Analysis</h1>
            <p className="text-muted-foreground">AI identifies missing topics in your knowledge base</p>
          </div>
        </div>
        <Button onClick={() => analyzeMut.mutate()} disabled={analyzeMut.isPending}>
          {analyzeMut.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
          Run Analysis
        </Button>
      </div>

      {pending.length > 0 && (
        <Card className="mb-6">
          <CardHeader><CardTitle className="text-lg">Pending Suggestions ({pending.length})</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pending.map((s: any) => (
                <div key={s.id} className="bg-muted/30 rounded-lg p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline">{s.category}</Badge>
                        <span className="font-medium">{s.suggestedTitle}</span>
                      </div>
                      {s.suggestedDescription && <p className="text-sm text-muted-foreground">{s.suggestedDescription}</p>}
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <Button size="sm" variant="outline" onClick={() => updateMut.mutate({ id: s.id, status: 'accepted' })}>
                        <Check className="w-3.5 h-3.5 mr-1" /> Accept
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => updateMut.mutate({ id: s.id, status: 'dismissed' })}>
                        <X className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {resolved.length > 0 && (
        <Card>
          <CardHeader><CardTitle className="text-lg text-muted-foreground">Resolved ({resolved.length})</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              {resolved.map((s: any) => (
                <div key={s.id} className="flex items-center gap-3 text-sm opacity-60">
                  <Badge variant={s.status === 'accepted' ? 'default' : 'secondary'}>{s.status}</Badge>
                  <span>{s.suggestedTitle}</span>
                  <span className="text-muted-foreground">({s.category})</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {(!suggestions || suggestions.length === 0) && !analyzeMut.isPending && (
        <div className="text-center py-16 text-muted-foreground">
          <Lightbulb className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p>No suggestions yet. Click "Run Analysis" to let AI identify content gaps.</p>
        </div>
      )}
    </div>
  );
}

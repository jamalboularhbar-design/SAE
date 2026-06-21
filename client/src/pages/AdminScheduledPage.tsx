import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, ArrowLeft, XCircle, Play } from 'lucide-react';
import { useLocation } from 'wouter';

export default function AdminScheduledPage() {
  const { user } = useAuth();
  const [, navigate] = useLocation();

  const { data: scheduled, refetch } = trpc.scheduledPublish.list.useQuery(undefined, { enabled: user?.role === 'admin' });
  const cancelMutation = trpc.scheduledPublish.cancel.useMutation({ onSuccess: () => refetch() });
  const processMutation = trpc.scheduledPublish.process.useMutation({ onSuccess: () => refetch() });

  if (user?.role !== 'admin') {
    return <div className="container py-12 text-center text-muted-foreground">Admin access required.</div>;
  }

  return (
    <div className="container py-8 max-w-4xl mx-auto">
      <button onClick={() => navigate('/')} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-accent mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </button>

      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Calendar className="w-6 h-6 text-accent" />
          <h1 className="text-2xl font-bold">Scheduled Publishing</h1>
          <Badge variant="secondary">{scheduled?.length || 0} pending</Badge>
        </div>
        <Button size="sm" onClick={() => processMutation.mutate()} disabled={processMutation.isPending}>
          <Play className="w-4 h-4 mr-1" /> Process Due
        </Button>
      </div>

      {processMutation.data && processMutation.data.length > 0 && (
        <div className="mb-4 p-3 rounded-lg bg-accent/10 border border-accent/30 text-sm text-accent">
          Published {processMutation.data.length} document(s): {processMutation.data.join(', ')}
        </div>
      )}

      {!scheduled || scheduled.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <Calendar className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg">No documents scheduled for publishing.</p>
            <p className="text-sm mt-2">Set a publish date from the document editor to schedule content.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {scheduled.map((item) => (
            <Card key={item.id} className="border-border/50">
              <CardContent className="py-4 flex items-center justify-between">
                <div>
                  <button
                    onClick={() => navigate(`/docs/${item.documentSlug}`)}
                    className="font-medium text-foreground hover:text-accent transition-colors"
                  >
                    {item.documentSlug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                  </button>
                  <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Publishes: {new Date(item.publishAt).toLocaleString()}
                    </span>
                    {item.createdBy && <span>by {item.createdBy}</span>}
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => cancelMutation.mutate({ documentSlug: item.documentSlug })}
                  className="text-destructive hover:text-destructive"
                >
                  <XCircle className="w-4 h-4 mr-1" /> Cancel
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

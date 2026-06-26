import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { RefreshCw, Webhook } from 'lucide-react';

export default function AdminWebhookEventsPage() {
  const utils = trpc.useUtils();
  const { data: events, isLoading } = trpc.webhookEvents.list.useQuery({ limit: 50, offset: 0 });
  const retryMut = trpc.webhookEvents.retry.useMutation({
    onSuccess: (res) => {
      if (res.success) {
        toast.success('Webhook event queued for retry');
        utils.webhookEvents.list.invalidate();
      } else {
        toast.error('Retry failed — event not found');
      }
    },
    onError: () => toast.error('Retry failed'),
  });

  return (
    <div className="container max-w-5xl py-8">
      <div className="flex items-center gap-3 mb-6">
        <Webhook className="w-6 h-6 text-blue-400" />
        <div>
          <h1 className="text-2xl font-bold">Webhook Event Log</h1>
          <p className="text-sm text-muted-foreground">View recent webhook delivery attempts, payloads, and retry controls</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Events</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-muted-foreground">Loading events...</p>
          ) : !events?.length ? (
            <p className="text-muted-foreground">No webhook events recorded yet.</p>
          ) : (
            <div className="space-y-3">
              {events.map((evt: any) => (
                <div key={evt.id} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant={evt.success ? 'default' : 'destructive'}>
                        {evt.success ? 'Success' : 'Failed'}
                      </Badge>
                      <span className="font-medium text-sm">{evt.event}</span>
                      <span className="text-xs text-muted-foreground">Webhook #{evt.webhookId}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {evt.responseStatus && (
                        <Badge variant="outline">HTTP {evt.responseStatus}</Badge>
                      )}
                      {!evt.success && evt.retriesLeft > 0 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => retryMut.mutate({ id: evt.id })}
                          disabled={retryMut.isPending}
                        >
                          <RefreshCw className="w-3 h-3 mr-1" />
                          Retry ({evt.retriesLeft} left)
                        </Button>
                      )}
                    </div>
                  </div>
                  {evt.payload && (
                    <details className="text-xs">
                      <summary className="cursor-pointer text-muted-foreground">Payload</summary>
                      <pre className="mt-1 p-2 bg-muted rounded text-xs overflow-x-auto max-h-32">{evt.payload}</pre>
                    </details>
                  )}
                  {evt.responseBody && (
                    <details className="text-xs">
                      <summary className="cursor-pointer text-muted-foreground">Response Body</summary>
                      <pre className="mt-1 p-2 bg-muted rounded text-xs overflow-x-auto max-h-32">{evt.responseBody}</pre>
                    </details>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {new Date(evt.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

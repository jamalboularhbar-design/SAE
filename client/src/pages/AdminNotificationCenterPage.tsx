import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, RefreshCw, Loader2, CheckCircle, XCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminNotificationCenterPage() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  if (user?.role !== 'admin') { navigate('/'); return null; }

  const { data: logs, isLoading, refetch } = trpc.notificationLog.list.useQuery({ limit: 100 });
  const retryMutation = trpc.notificationLog.retry.useMutation({
    onSuccess: () => { toast.success('Notification retried'); refetch(); },
    onError: () => toast.error('Retry failed'),
  });

  const statusIcon = (status: string) => {
    if (status === 'sent') return <CheckCircle className="w-4 h-4 text-green-400" />;
    if (status === 'failed') return <XCircle className="w-4 h-4 text-red-400" />;
    return <Clock className="w-4 h-4 text-yellow-400" />;
  };

  return (
    <div className="container max-w-5xl py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Bell className="w-6 h-6 text-orange-400" />
          <h1 className="text-2xl font-bold">Notification Center</h1>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          <RefreshCw className="w-4 h-4 mr-2" /> Refresh
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin" /></div>
      ) : (
        <div className="space-y-2">
          {logs?.map((log: any) => (
            <Card key={log.id} className="bg-card/80 border-border/50">
              <CardContent className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  {statusIcon(log.status)}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{log.title}</div>
                    <div className="text-xs text-muted-foreground truncate">{log.content || 'No content'}</div>
                  </div>
                  <Badge variant="outline" className="text-xs">{log.channel || 'in-app'}</Badge>
                  <span className="text-xs text-muted-foreground ml-2">{new Date(log.createdAt).toLocaleString()}</span>
                </div>
                {log.status === 'failed' && (
                  <Button variant="ghost" size="sm" className="ml-2" onClick={() => retryMutation.mutate({ id: log.id })} disabled={retryMutation.isPending}>
                    <RefreshCw className="w-3 h-3" />
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
          {(!logs || logs.length === 0) && (
            <div className="text-center py-12 text-muted-foreground">No notification logs yet</div>
          )}
        </div>
      )}
    </div>
  );
}

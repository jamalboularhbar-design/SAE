import { useState } from 'react';
import { useLocation } from 'wouter';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import { ArrowLeft, Bell, BellOff, Check, CheckCheck, FileText, FolderOpen, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { getLoginUrl } from '@/const';

export default function NotificationsPage() {
  const [, navigate] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const [tab, setTab] = useState<'notifications' | 'subscriptions'>('notifications');

  const { data: notifications, refetch: refetchNotifs } = trpc.subscriptions.notifications.useQuery(
    { limit: 50 },
    { enabled: isAuthenticated }
  );
  const { data: subscriptions, refetch: refetchSubs } = trpc.subscriptions.list.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );
  const { data: unreadCount } = trpc.subscriptions.unreadCount.useQuery(undefined, { enabled: isAuthenticated });

  const markReadMut = trpc.subscriptions.markRead.useMutation({ onSuccess: () => refetchNotifs() });
  const markAllReadMut = trpc.subscriptions.markAllRead.useMutation({ onSuccess: () => refetchNotifs() });
  const unsubMut = trpc.subscriptions.unsubscribe.useMutation({ onSuccess: () => { refetchSubs(); toast.success('Unsubscribed'); } });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Bell className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
          <p className="text-muted-foreground mb-4">Sign in to manage notifications</p>
          <a href={getLoginUrl()} className="px-4 py-2 rounded-lg bg-accent text-accent-foreground text-sm">Sign In</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/50">
        <div className="container h-14 flex items-center gap-3">
          <button onClick={() => navigate('/')} className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <Bell className="w-5 h-5 text-accent" />
          <h1 className="text-lg font-bold text-foreground">Notifications</h1>
          {unreadCount ? <span className="ml-2 px-2 py-0.5 rounded-full bg-accent text-accent-foreground text-xs">{unreadCount}</span> : null}
        </div>
      </header>

      <div className="container py-6 max-w-2xl">
        {/* Tabs */}
        <div className="flex gap-1 mb-6 p-1 rounded-lg bg-card/50 border border-border/30 w-fit">
          <button
            onClick={() => setTab('notifications')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${tab === 'notifications' ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          >
            Updates {unreadCount ? `(${unreadCount})` : ''}
          </button>
          <button
            onClick={() => setTab('subscriptions')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${tab === 'subscriptions' ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          >
            Subscriptions ({subscriptions?.length || 0})
          </button>
        </div>

        {tab === 'notifications' && (
          <div>
            {notifications && notifications.length > 0 && (
              <div className="flex justify-end mb-3">
                <button
                  onClick={() => markAllReadMut.mutate()}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                >
                  <CheckCheck className="w-3.5 h-3.5" /> Mark all read
                </button>
              </div>
            )}
            {!notifications || notifications.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <BellOff className="w-10 h-10 mx-auto mb-3 opacity-50" />
                <p>No notifications yet.</p>
                <p className="text-xs mt-1">Subscribe to documents or categories to get notified of changes.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {notifications.map(n => (
                  <div
                    key={n.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border transition-colors cursor-pointer ${
                      n.isRead ? 'border-border/30 bg-card/20' : 'border-accent/30 bg-accent/5'
                    }`}
                    onClick={() => {
                      if (!n.isRead) markReadMut.mutate({ id: n.id });
                      navigate(`/docs/${n.documentSlug}`);
                    }}
                  >
                    <FileText className={`w-4 h-4 shrink-0 ${n.isRead ? 'text-muted-foreground' : 'text-accent'}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground truncate">{n.documentSlug}</p>
                      <p className="text-xs text-muted-foreground">
                        {n.changeType === 'created' && 'New document created'}
                        {n.changeType === 'updated' && 'Document updated'}
                        {n.changeType === 'published' && 'Document published'}
                      </p>
                    </div>
                    {!n.isRead && (
                      <button
                        onClick={e => { e.stopPropagation(); markReadMut.mutate({ id: n.id }); }}
                        className="text-muted-foreground hover:text-foreground p-1"
                        title="Mark as read"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'subscriptions' && (
          <div>
            {!subscriptions || subscriptions.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <BellOff className="w-10 h-10 mx-auto mb-3 opacity-50" />
                <p>No subscriptions yet.</p>
                <p className="text-xs mt-1">Use the subscribe button on documents or category pages.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {subscriptions.map(sub => (
                  <div key={sub.id} className="flex items-center gap-3 p-3 rounded-lg border border-border/30 bg-card/30">
                    {sub.targetType === 'document' ? (
                      <FileText className="w-4 h-4 text-accent shrink-0" />
                    ) : (
                      <FolderOpen className="w-4 h-4 text-accent shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground truncate">{sub.targetValue}</p>
                      <p className="text-xs text-muted-foreground capitalize">{sub.targetType}</p>
                    </div>
                    <button
                      onClick={() => unsubMut.mutate({ targetType: sub.targetType, targetValue: sub.targetValue })}
                      className="text-red-400 hover:text-red-300 p-1"
                      title="Unsubscribe"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

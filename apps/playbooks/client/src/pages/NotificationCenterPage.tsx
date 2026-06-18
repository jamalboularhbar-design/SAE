import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, Check, CheckCheck, Trash2, ExternalLink } from 'lucide-react';
import { Link } from 'wouter';

export default function NotificationCenterPage() {
  const { data: notifications, isLoading } = trpc.pushNotifications.list.useQuery();
  const { data: unreadCount } = trpc.pushNotifications.unreadCount.useQuery();
  const utils = trpc.useUtils();

  const markRead = trpc.pushNotifications.markRead.useMutation({
    onSuccess: () => {
      utils.pushNotifications.list.invalidate();
      utils.pushNotifications.unreadCount.invalidate();
    },
  });

  const markAllRead = trpc.pushNotifications.markAllRead.useMutation({
    onSuccess: () => {
      utils.pushNotifications.list.invalidate();
      utils.pushNotifications.unreadCount.invalidate();
    },
  });

  const deleteNotif = trpc.pushNotifications.delete.useMutation({
    onSuccess: () => {
      utils.pushNotifications.list.invalidate();
      utils.pushNotifications.unreadCount.invalidate();
    },
  });

  const typeColors: Record<string, string> = {
    review_assigned: 'bg-blue-500/20 text-blue-400',
    sla_breach: 'bg-red-500/20 text-red-400',
    workspace_invite: 'bg-purple-500/20 text-purple-400',
    doc_published: 'bg-green-500/20 text-green-400',
    mention: 'bg-amber-500/20 text-amber-400',
  };

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-20 bg-muted rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Bell className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold">Notification Center</h1>
          {unreadCount ? (
            <Badge variant="destructive">{unreadCount} unread</Badge>
          ) : null}
        </div>
        {unreadCount ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => markAllRead.mutate()}
            disabled={markAllRead.isPending}
          >
            <CheckCheck className="w-4 h-4 mr-2" />
            Mark All Read
          </Button>
        ) : null}
      </div>

      {!notifications?.length ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <Bell className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg">No notifications yet</p>
            <p className="text-sm mt-1">You'll see alerts for reviews, SLA breaches, and workspace invites here.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {notifications.map((notif: any) => (
            <Card
              key={notif.id}
              className={`transition-colors ${!notif.isRead ? 'border-primary/30 bg-primary/5' : ''}`}
            >
              <CardContent className="py-4 flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className={typeColors[notif.type] || 'bg-muted text-muted-foreground'}>
                      {notif.type.replace(/_/g, ' ')}
                    </Badge>
                    {!notif.isRead && (
                      <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    )}
                    <span className="text-xs text-muted-foreground ml-auto">
                      {new Date(notif.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="font-medium">{notif.title}</p>
                  {notif.message && (
                    <p className="text-sm text-muted-foreground mt-1">{notif.message}</p>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  {notif.link && (
                    <Link href={notif.link}>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </Link>
                  )}
                  {!notif.isRead && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => markRead.mutate({ id: notif.id })}
                    >
                      <Check className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                    onClick={() => deleteNotif.mutate({ id: notif.id })}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

import { useState } from 'react';
import { useLocation } from 'wouter';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Activity, Download, Eye, ThumbsUp, MessageSquare, Pin, Trash2, Edit, FileText } from 'lucide-react';

const actionIcons: Record<string, any> = {
  view: Eye,
  rate: ThumbsUp,
  comment: MessageSquare,
  download: Download,
  pin: Pin,
  unpin: Pin,
  create: FileText,
  update: Edit,
  delete: Trash2,
  batch_delete: Trash2,
  batch_status: Edit,
  batch_tag: FileText,
};

const actionColors: Record<string, string> = {
  view: 'bg-blue-500/20 text-blue-400',
  rate: 'bg-green-500/20 text-green-400',
  comment: 'bg-purple-500/20 text-purple-400',
  download: 'bg-cyan-500/20 text-cyan-400',
  pin: 'bg-amber-500/20 text-amber-400',
  unpin: 'bg-amber-500/20 text-amber-400',
  create: 'bg-emerald-500/20 text-emerald-400',
  update: 'bg-orange-500/20 text-orange-400',
  delete: 'bg-red-500/20 text-red-400',
  batch_delete: 'bg-red-500/20 text-red-400',
  batch_status: 'bg-orange-500/20 text-orange-400',
  batch_tag: 'bg-indigo-500/20 text-indigo-400',
};

export default function AdminActivityPage() {
  const [, setLocation] = useLocation();
  const { user, loading: authLoading } = useAuth();
  const [tab, setTab] = useState<'activity' | 'downloads'>('activity');

  const { data: activityData, isLoading: activityLoading } = trpc.activity.list.useQuery(
    { limit: 100 },
    { enabled: tab === 'activity' && !!user }
  );

  const { data: downloadData, isLoading: downloadLoading } = trpc.activity.downloads.useQuery(
    { limit: 50 },
    { enabled: tab === 'downloads' && !!user }
  );

  if (authLoading) {
    return <div className="min-h-screen bg-background flex items-center justify-center"><div className="animate-spin w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full" /></div>;
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">
        <p>Admin access required.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => setLocation('/')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <Activity className="w-5 h-5 text-amber-500" />
          <h1 className="text-lg font-semibold">Activity Log</h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={tab === 'activity' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTab('activity')}
          >
            <Activity className="w-4 h-4 mr-1" /> All Activity
          </Button>
          <Button
            variant={tab === 'downloads' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTab('downloads')}
          >
            <Download className="w-4 h-4 mr-1" /> Downloads
          </Button>
        </div>

        {/* Activity Tab */}
        {tab === 'activity' && (
          <div>
            {activityLoading ? (
              <div className="space-y-3">
                {[...Array(8)].map((_, i) => <div key={i} className="animate-pulse h-14 bg-muted/30 rounded-lg" />)}
              </div>
            ) : activityData && activityData.length > 0 ? (
              <div className="space-y-2">
                {activityData.map((entry: any) => {
                  const Icon = actionIcons[entry.action] || Activity;
                  const colorClass = actionColors[entry.action] || 'bg-muted text-muted-foreground';
                  return (
                    <div key={entry.id} className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/20 transition-colors">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${colorClass}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">{entry.action}</Badge>
                          {entry.documentSlug && (
                            <span className="text-sm text-foreground truncate">{entry.documentSlug}</span>
                          )}
                        </div>
                        {entry.details && (
                          <p className="text-xs text-muted-foreground mt-0.5 truncate">{entry.details}</p>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground whitespace-nowrap">
                        {new Date(entry.createdAt).toLocaleString()}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">No activity recorded yet.</p>
            )}
          </div>
        )}

        {/* Downloads Tab */}
        {tab === 'downloads' && (
          <div>
            {downloadLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => <div key={i} className="animate-pulse h-14 bg-muted/30 rounded-lg" />)}
              </div>
            ) : downloadData && downloadData.length > 0 ? (
              <div className="space-y-2">
                {downloadData.map((entry: any) => (
                  <div key={entry.id} className="flex items-center gap-3 p-3 rounded-lg border border-border">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-cyan-500/20 text-cyan-400">
                      <Download className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-medium truncate block">{entry.documentSlug}</span>
                      <span className="text-xs text-muted-foreground">Format: {entry.format}{entry.visitorId ? ` · By: ${entry.visitorId}` : ''}</span>
                    </div>
                    <div className="text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(entry.createdAt).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">No downloads recorded yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

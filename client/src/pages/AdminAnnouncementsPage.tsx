import { useState } from 'react';
import { useLocation } from 'wouter';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Megaphone, Plus, Trash2, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminAnnouncementsPage() {
  const [, setLocation] = useLocation();
  const { user, loading: authLoading } = useAuth();
  const [newMessage, setNewMessage] = useState('');
  const [newType, setNewType] = useState<'info' | 'warning' | 'success'>('info');

  const utils = trpc.useUtils();
  const { data: allAnnouncements, isLoading } = trpc.announcements.all.useQuery(undefined, { enabled: !!user });

  const createMutation = trpc.announcements.create.useMutation({
    onSuccess: () => {
      utils.announcements.all.invalidate();
      utils.announcements.active.invalidate();
      setNewMessage('');
      toast.success('Announcement created');
    },
  });

  const updateMutation = trpc.announcements.update.useMutation({
    onSuccess: () => {
      utils.announcements.all.invalidate();
      utils.announcements.active.invalidate();
      toast.success('Announcement updated');
    },
  });

  const deleteMutation = trpc.announcements.delete.useMutation({
    onSuccess: () => {
      utils.announcements.all.invalidate();
      utils.announcements.active.invalidate();
      toast.success('Announcement deleted');
    },
  });

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
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => setLocation('/')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <Megaphone className="w-5 h-5 text-amber-500" />
          <h1 className="text-lg font-semibold">Announcements</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Create new */}
        <div className="border border-border rounded-lg p-4 mb-6">
          <h2 className="text-sm font-medium mb-3">Create New Announcement</h2>
          <div className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Announcement message..."
              className="flex-1"
            />
            <select
              value={newType}
              onChange={(e) => setNewType(e.target.value as any)}
              className="h-9 rounded border border-border bg-background px-2 text-sm"
            >
              <option value="info">Info</option>
              <option value="warning">Warning</option>
              <option value="success">Success</option>
            </select>
            <Button
              size="sm"
              disabled={!newMessage.trim() || createMutation.isPending}
              onClick={() => createMutation.mutate({ message: newMessage.trim(), type: newType })}
            >
              <Plus className="w-4 h-4 mr-1" /> Add
            </Button>
          </div>
        </div>

        {/* List */}
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => <div key={i} className="animate-pulse h-16 bg-muted/30 rounded-lg" />)}
          </div>
        ) : allAnnouncements && allAnnouncements.length > 0 ? (
          <div className="space-y-2">
            {allAnnouncements.map((ann: any) => (
              <div key={ann.id} className="flex items-center gap-3 p-3 rounded-lg border border-border">
                <Badge variant="outline" className="text-xs">{ann.type}</Badge>
                <p className="flex-1 text-sm truncate">{ann.message}</p>
                <Badge variant={ann.active ? 'default' : 'secondary'} className="text-xs">
                  {ann.active ? 'Active' : 'Inactive'}
                </Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => updateMutation.mutate({ id: ann.id, active: ann.active ? 0 : 1 })}
                  title={ann.active ? 'Deactivate' : 'Activate'}
                >
                  {ann.active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-red-400 hover:text-red-300"
                  onClick={() => deleteMutation.mutate({ id: ann.id })}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-8">No announcements yet.</p>
        )}
      </div>
    </div>
  );
}

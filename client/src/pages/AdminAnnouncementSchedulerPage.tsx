import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Megaphone, Plus, Trash2, Clock, CheckCircle, Calendar } from 'lucide-react';
import { toast } from 'sonner';

const statusColors: Record<string, string> = {
  scheduled: 'bg-amber-500/20 text-amber-400',
  published: 'bg-green-500/20 text-green-400',
  expired: 'bg-gray-500/20 text-gray-400',
  cancelled: 'bg-red-500/20 text-red-400',
};

const typeColors: Record<string, string> = {
  info: 'bg-blue-500/20 text-blue-400',
  warning: 'bg-amber-500/20 text-amber-400',
  success: 'bg-green-500/20 text-green-400',
  urgent: 'bg-red-500/20 text-red-400',
};

export default function AdminAnnouncementSchedulerPage() {
  const { data: announcements, isLoading } = trpc.scheduledAnnouncements.list.useQuery({});
  const utils = trpc.useUtils();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState('info');
  const [scheduledFor, setScheduledFor] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [showForm, setShowForm] = useState(false);

  const createAnnouncement = trpc.scheduledAnnouncements.create.useMutation({
    onSuccess: () => {
      utils.scheduledAnnouncements.list.invalidate();
      setTitle(''); setContent(''); setScheduledFor(''); setExpiresAt('');
      setShowForm(false);
      toast.success('Announcement scheduled');
    },
  });

  const deleteAnnouncement = trpc.scheduledAnnouncements.delete.useMutation({
    onSuccess: () => {
      utils.scheduledAnnouncements.list.invalidate();
      toast.success('Announcement deleted');
    },
  });

  const publishNow = trpc.scheduledAnnouncements.update.useMutation({
    onSuccess: () => {
      utils.scheduledAnnouncements.list.invalidate();
      toast.success('Announcement published');
    },
  });

  return (
    <div className="container max-w-4xl py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Megaphone className="w-6 h-6 text-primary" />
            Announcement Scheduler
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Schedule announcements for future publication</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="w-4 h-4 mr-1.5" />
          New Announcement
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader><CardTitle className="text-lg">Schedule New Announcement</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Input placeholder="Announcement title" value={title} onChange={(e) => setTitle(e.target.value)} />
            <Textarea placeholder="Announcement content..." value={content} onChange={(e) => setContent(e.target.value)} rows={3} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-medium mb-1 block">Type</label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="info">Info</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="success">Success</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs font-medium mb-1 block">Scheduled For</label>
                <Input type="datetime-local" value={scheduledFor} onChange={(e) => setScheduledFor(e.target.value)} />
              </div>
              <div>
                <label className="text-xs font-medium mb-1 block">Expires At (optional)</label>
                <Input type="datetime-local" value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} />
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button
                onClick={() => createAnnouncement.mutate({ title, content, type, scheduledFor, expiresAt: expiresAt || undefined })}
                disabled={!title || !content || !scheduledFor || createAnnouncement.isPending}
              >
                Schedule
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader><CardTitle className="text-lg">Scheduled Announcements</CardTitle></CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : !announcements || (announcements as any[]).length === 0 ? (
            <p className="text-sm text-muted-foreground">No scheduled announcements. Click "New Announcement" to create one.</p>
          ) : (
            <div className="space-y-3">
              {(announcements as any[]).map((ann: any) => (
                <div key={ann.id} className="p-4 rounded-lg border border-border/40 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-sm">{ann.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{ann.content}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-3">
                      <Badge className={typeColors[ann.type] || 'bg-muted'}>{ann.type}</Badge>
                      <Badge className={statusColors[ann.status] || 'bg-muted'}>{ann.status}</Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(ann.scheduledFor).toLocaleString()}</span>
                      {ann.expiresAt && <span>Expires: {new Date(ann.expiresAt).toLocaleString()}</span>}
                    </div>
                    <div className="flex gap-1">
                      {ann.status === 'scheduled' && (
                        <Button variant="ghost" size="sm" onClick={() => publishNow.mutate({ id: ann.id, status: 'published' })}>
                          <CheckCircle className="w-3.5 h-3.5 mr-1" /> Publish Now
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" onClick={() => deleteAnnouncement.mutate({ id: ann.id })}>
                        <Trash2 className="w-3.5 h-3.5 text-red-400" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

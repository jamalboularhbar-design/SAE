import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, AlertTriangle, Trash2, Plus } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminReviewRemindersPage() {
  const [docId, setDocId] = useState('');
  const [reviewDate, setReviewDate] = useState('');
  const [frequency, setFrequency] = useState<'once' | 'weekly' | 'monthly' | 'quarterly'>('once');

  const { data: reminders, refetch } = trpc.reviewReminders.list.useQuery();
  const { data: overdue } = trpc.reviewReminders.overdue.useQuery();
  const createMutation = trpc.reviewReminders.create.useMutation({
    onSuccess: () => { refetch(); toast.success('Reminder created'); setDocId(''); setReviewDate(''); },
  });
  const deleteMutation = trpc.reviewReminders.delete.useMutation({
    onSuccess: () => { refetch(); toast.success('Reminder deleted'); },
  });

  return (
    <div className="container py-8 max-w-5xl">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Calendar className="w-6 h-6 text-primary" />
        Review Reminders
      </h1>

      {/* Overdue Section */}
      {overdue && overdue.length > 0 && (
        <div className="mb-6 border border-destructive/50 rounded-lg p-4 bg-destructive/5">
          <h2 className="text-lg font-semibold flex items-center gap-2 mb-3 text-destructive">
            <AlertTriangle className="w-5 h-5" />
            Overdue Reviews ({overdue.length})
          </h2>
          <div className="space-y-2">
            {overdue.map((r: any) => (
              <div key={r.reminderId} className="flex items-center justify-between bg-background rounded p-2">
                <div>
                  <span className="font-medium">{r.docTitle}</span>
                  <span className="text-xs text-muted-foreground ml-2">
                    Due: {new Date(r.reviewDate).toLocaleDateString()}
                  </span>
                </div>
                <Button size="sm" variant="outline" asChild>
                  <a href={`/doc/${r.docSlug}`}>Review</a>
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create Reminder */}
      <div className="border rounded-lg p-4 mb-6">
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Schedule New Review
        </h2>
        <div className="flex flex-wrap gap-3 items-end">
          <div>
            <label className="text-xs text-muted-foreground">Document ID</label>
            <Input
              value={docId}
              onChange={(e) => setDocId(e.target.value)}
              placeholder="Document ID"
              className="w-32"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Review Date</label>
            <Input
              type="date"
              value={reviewDate}
              onChange={(e) => setReviewDate(e.target.value)}
              className="w-40"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Frequency</label>
            <Select value={frequency} onValueChange={(v) => setFrequency(v as any)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="once">Once</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={() => {
              if (!docId || !reviewDate) { toast.error('Fill all fields'); return; }
              createMutation.mutate({ documentId: parseInt(docId), reviewDate, frequency });
            }}
            disabled={createMutation.isPending}
          >
            Create Reminder
          </Button>
        </div>
      </div>

      {/* All Reminders */}
      <div className="border rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Clock className="w-5 h-5" />
          All Scheduled Reviews ({reminders?.length || 0})
        </h2>
        {reminders && reminders.length > 0 ? (
          <div className="space-y-2">
            {reminders.map((r) => (
              <div key={r.id} className="flex items-center justify-between border rounded p-2">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium">Doc #{r.documentId}</span>
                  <span className="text-xs bg-accent/50 px-2 py-0.5 rounded">{r.frequency}</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(r.reviewDate).toLocaleDateString()}
                  </span>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => deleteMutation.mutate({ id: r.id })}
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">No review reminders scheduled.</p>
        )}
      </div>
    </div>
  );
}

import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { CalendarClock, AlertTriangle, CheckCircle2, Plus } from 'lucide-react';

export default function AdminReviewSchedulingPage() {
  const { data: schedules, refetch } = trpc.reviewScheduling.list.useQuery();
  const { data: overdue } = trpc.reviewScheduling.overdue.useQuery();
  const upsertMut = trpc.reviewScheduling.upsert.useMutation({ onSuccess: () => { refetch(); toast.success('Schedule saved'); } });
  const completeMut = trpc.reviewScheduling.markComplete.useMutation({ onSuccess: () => { refetch(); toast.success('Review marked complete'); } });

  const [docSlug, setDocSlug] = useState('');
  const [interval, setInterval] = useState('90');
  const [escalation, setEscalation] = useState('7');

  const formatDate = (d: any) => d ? new Date(d).toLocaleDateString() : 'N/A';
  const isOverdue = (nextReview: any) => nextReview && new Date(nextReview) < new Date();

  return (
    <div className="container max-w-6xl py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><CalendarClock className="w-6 h-6 text-orange-400" /> Review Scheduling</h1>
          <p className="text-muted-foreground mt-1">Automated recurring review cycles for documents</p>
        </div>
      </div>

      {(overdue || []).length > 0 && (
        <Card className="mb-6 border-red-500/30 bg-red-500/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-red-400 flex items-center gap-2"><AlertTriangle className="w-5 h-5" /> Overdue Reviews ({(overdue || []).length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {(overdue || []).map((r: any) => (
                <div key={r.id} className="flex items-center justify-between p-2 rounded bg-red-500/10">
                  <div>
                    <span className="font-medium">{r.documentSlug}</span>
                    <span className="text-sm text-muted-foreground ml-2">Due: {formatDate(r.nextReviewAt)}</span>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => completeMut.mutate({ documentSlug: r.documentSlug })}>
                    <CheckCircle2 className="w-4 h-4 mr-1" /> Mark Complete
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="mb-6">
        <CardHeader><CardTitle className="flex items-center gap-2"><Plus className="w-5 h-5" /> Add/Update Schedule</CardTitle></CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3 items-end">
            <div className="flex-1 min-w-[200px]">
              <label className="text-sm text-muted-foreground mb-1 block">Document Slug</label>
              <Input value={docSlug} onChange={e => setDocSlug(e.target.value)} placeholder="e.g. getting-started" />
            </div>
            <div className="w-32">
              <label className="text-sm text-muted-foreground mb-1 block">Interval (days)</label>
              <Input type="number" value={interval} onChange={e => setInterval(e.target.value)} />
            </div>
            <div className="w-32">
              <label className="text-sm text-muted-foreground mb-1 block">Escalation (days)</label>
              <Input type="number" value={escalation} onChange={e => setEscalation(e.target.value)} />
            </div>
            <Button onClick={() => { upsertMut.mutate({ documentSlug: docSlug, intervalDays: parseInt(interval), escalationDays: parseInt(escalation) }); setDocSlug(''); }} disabled={!docSlug}>
              Save Schedule
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>All Schedules ({(schedules || []).length})</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 px-3">Document</th>
                  <th className="text-left py-2 px-3">Interval</th>
                  <th className="text-left py-2 px-3">Last Reviewed</th>
                  <th className="text-left py-2 px-3">Next Review</th>
                  <th className="text-left py-2 px-3">Status</th>
                  <th className="text-right py-2 px-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {(schedules || []).map((s: any) => (
                  <tr key={s.id} className="border-b border-border/50">
                    <td className="py-2 px-3 font-medium">{s.documentSlug}</td>
                    <td className="py-2 px-3">{s.intervalDays}d</td>
                    <td className="py-2 px-3">{formatDate(s.lastReviewedAt)}</td>
                    <td className="py-2 px-3">{formatDate(s.nextReviewAt)}</td>
                    <td className="py-2 px-3">
                      {isOverdue(s.nextReviewAt) ? <Badge variant="destructive">Overdue</Badge> : s.isActive ? <Badge className="bg-green-600">Active</Badge> : <Badge variant="secondary">Inactive</Badge>}
                    </td>
                    <td className="py-2 px-3 text-right">
                      <Button size="sm" variant="ghost" onClick={() => completeMut.mutate({ documentSlug: s.documentSlug })}>
                        <CheckCircle2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

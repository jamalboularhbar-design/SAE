import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { ArrowRightLeft, Play, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export default function AdminContentMigrationPage() {
  const { data: jobs, refetch } = trpc.migration.list.useQuery();
  const createMut = trpc.migration.create.useMutation({ onSuccess: (d: any) => { refetch(); toast.success(`Job created. ${d.affectedCount} documents affected.`); } });
  const executeMut = trpc.migration.execute.useMutation({ onSuccess: () => { refetch(); toast.success('Migration executed'); } });

  const [name, setName] = useState('');
  const [opType, setOpType] = useState('re-categorize');
  const [fromCategory, setFromCategory] = useState('');
  const [toCategory, setToCategory] = useState('');

  const statusColor: Record<string, string> = {
    pending: 'bg-yellow-600', preview: 'bg-blue-600', running: 'bg-orange-600', completed: 'bg-green-600', failed: 'bg-red-600',
  };

  return (
    <div className="container max-w-6xl py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold flex items-center gap-2"><ArrowRightLeft className="w-6 h-6 text-orange-400" /> Content Migration</h1>
        <p className="text-muted-foreground mt-1">Bulk re-categorize, re-tag, and re-assign documents</p>
      </div>

      <Card className="mb-6">
        <CardHeader><CardTitle>New Migration Job</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Job Name</label>
              <Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Move legacy docs to new category" />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Operation</label>
              <Select value={opType} onValueChange={setOpType}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="re-categorize">Re-categorize</SelectItem>
                  <SelectItem value="re-tag">Re-tag</SelectItem>
                  <SelectItem value="re-assign">Re-assign</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">From Category</label>
              <Input value={fromCategory} onChange={e => setFromCategory(e.target.value)} placeholder="Current category" />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">To Category</label>
              <Input value={toCategory} onChange={e => setToCategory(e.target.value)} placeholder="Target category" />
            </div>
          </div>
          <Button className="mt-4" onClick={() => {
            createMut.mutate({
              name, operationType: opType,
              filterCriteria: JSON.stringify({ category: fromCategory }),
              targetValue: JSON.stringify({ category: toCategory }),
            });
          }} disabled={!name || !fromCategory || !toCategory}>
            Preview Migration
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Migration History ({(jobs || []).length})</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {(jobs || []).map((j: any) => (
              <div key={j.id} className="flex items-center justify-between p-3 rounded bg-muted/20 border border-border/50">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{j.name}</span>
                    <Badge className={statusColor[j.status] || 'bg-gray-600'}>{j.status}</Badge>
                    <Badge variant="outline">{j.operationType}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {j.processedCount}/{j.affectedCount} processed
                    {j.completedAt && ` — Completed ${new Date(j.completedAt).toLocaleDateString()}`}
                  </p>
                </div>
                {j.status === 'preview' && (
                  <Button size="sm" onClick={() => executeMut.mutate({ jobId: j.id })} disabled={executeMut.isPending}>
                    {executeMut.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 mr-1" />}
                    Execute
                  </Button>
                )}
                {j.status === 'completed' && <CheckCircle2 className="w-5 h-5 text-green-400" />}
                {j.status === 'failed' && <AlertCircle className="w-5 h-5 text-red-400" />}
              </div>
            ))}
            {(!jobs || jobs.length === 0) && <p className="text-muted-foreground text-center py-8">No migration jobs yet.</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

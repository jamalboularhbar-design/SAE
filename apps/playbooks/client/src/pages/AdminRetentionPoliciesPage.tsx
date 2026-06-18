import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Shield, Plus, Trash2, Clock } from 'lucide-react';

export default function AdminRetentionPoliciesPage() {
  const { data: policies, refetch } = trpc.retention.list.useQuery();
  const upsertMut = trpc.retention.upsert.useMutation({ onSuccess: () => { refetch(); toast.success('Policy saved'); } });
  const deleteMut = trpc.retention.delete.useMutation({ onSuccess: () => { refetch(); toast.success('Policy deleted'); } });

  const [category, setCategory] = useState('');
  const [days, setDays] = useState('365');
  const [action, setAction] = useState('archive');

  return (
    <div className="container max-w-6xl py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold flex items-center gap-2"><Shield className="w-6 h-6 text-orange-400" /> Data Retention Policies</h1>
        <p className="text-muted-foreground mt-1">Configure retention rules per category with auto-purge scheduling</p>
      </div>

      <Card className="mb-6">
        <CardHeader><CardTitle className="flex items-center gap-2"><Plus className="w-5 h-5" /> Add Policy</CardTitle></CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3 items-end">
            <div className="flex-1 min-w-[200px]">
              <label className="text-sm text-muted-foreground mb-1 block">Category</label>
              <Input value={category} onChange={e => setCategory(e.target.value)} placeholder="e.g. Legacy Docs" />
            </div>
            <div className="w-40">
              <label className="text-sm text-muted-foreground mb-1 block">Retention (days)</label>
              <Input type="number" value={days} onChange={e => setDays(e.target.value)} />
            </div>
            <div className="w-40">
              <label className="text-sm text-muted-foreground mb-1 block">Action</label>
              <Select value={action} onValueChange={setAction}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="archive">Archive</SelectItem>
                  <SelectItem value="delete">Delete</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={() => { upsertMut.mutate({ category, retentionDays: parseInt(days), action }); setCategory(''); }} disabled={!category}>
              Save Policy
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Active Policies ({(policies || []).length})</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-2">
            {(policies || []).map((p: any) => (
              <div key={p.id} className="flex items-center justify-between p-3 rounded bg-muted/20">
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <span className="font-medium">{p.category}</span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Badge variant="outline">{p.retentionDays} days</Badge>
                      <Badge className={p.action === 'delete' ? 'bg-red-600' : 'bg-blue-600'}>{p.action}</Badge>
                      {p.isActive ? <Badge className="bg-green-600">Active</Badge> : <Badge variant="secondary">Inactive</Badge>}
                    </div>
                  </div>
                </div>
                <Button size="sm" variant="ghost" onClick={() => deleteMut.mutate({ id: p.id })}>
                  <Trash2 className="w-4 h-4 text-red-400" />
                </Button>
              </div>
            ))}
            {(!policies || policies.length === 0) && <p className="text-muted-foreground text-center py-8">No retention policies configured.</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

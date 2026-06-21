import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Plus, Trash2, ArrowRight, Workflow } from 'lucide-react';

export default function AdminWorkflowPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [newName, setNewName] = useState('');
  const [newColor, setNewColor] = useState('#6b7280');
  const [fromId, setFromId] = useState<number | null>(null);
  const [toId, setToId] = useState<number | null>(null);

  const { data: statuses, refetch: refetchStatuses } = trpc.workflow.statuses.useQuery(undefined, { enabled: isAdmin });
  const { data: transitions, refetch: refetchTransitions } = trpc.workflow.transitions.useQuery(undefined, { enabled: isAdmin });

  const createMut = trpc.workflow.createStatus.useMutation({ onSuccess: () => { refetchStatuses(); setNewName(''); toast.success('Status created'); } });
  const deleteMut = trpc.workflow.deleteStatus.useMutation({ onSuccess: () => { refetchStatuses(); refetchTransitions(); toast.success('Status deleted'); } });
  const addTransMut = trpc.workflow.addTransition.useMutation({ onSuccess: () => { refetchTransitions(); toast.success('Transition added'); } });
  const removeTransMut = trpc.workflow.removeTransition.useMutation({ onSuccess: () => { refetchTransitions(); toast.success('Transition removed'); } });

  if (!isAdmin) return <div className="p-8 text-center text-muted-foreground">Admin access required</div>;

  const getStatusName = (id: number) => statuses?.find(s => s.id === id)?.name || `#${id}`;

  return (
    <div className="container max-w-4xl py-8">
      <div className="flex items-center gap-3 mb-8">
        <Workflow className="w-8 h-8 text-primary" />
        <div>
          <h1 className="text-2xl font-bold">Custom Workflows</h1>
          <p className="text-muted-foreground">Define custom document status pipelines and transitions</p>
        </div>
      </div>

      {/* Create Status */}
      <Card className="mb-6">
        <CardHeader><CardTitle className="text-lg">Workflow Statuses</CardTitle></CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Input placeholder="Status name (e.g. Legal Review)" value={newName} onChange={e => setNewName(e.target.value)} className="flex-1" />
            <input type="color" value={newColor} onChange={e => setNewColor(e.target.value)} className="w-10 h-10 rounded cursor-pointer" />
            <Button onClick={() => newName.trim() && createMut.mutate({ name: newName.trim(), color: newColor })} disabled={!newName.trim()}>
              <Plus className="w-4 h-4 mr-1" /> Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {statuses?.map(s => (
              <div key={s.id} className="flex items-center gap-2 bg-muted/50 rounded-lg px-3 py-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: s.color }} />
                <span className="text-sm font-medium">{s.name}</span>
                <button onClick={() => deleteMut.mutate({ id: s.id })} className="text-muted-foreground hover:text-destructive">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
            {(!statuses || statuses.length === 0) && <p className="text-sm text-muted-foreground">No custom statuses yet. Add one above.</p>}
          </div>
        </CardContent>
      </Card>

      {/* Transitions */}
      <Card>
        <CardHeader><CardTitle className="text-lg">Allowed Transitions</CardTitle></CardHeader>
        <CardContent>
          {statuses && statuses.length >= 2 && (
            <div className="flex items-center gap-2 mb-4">
              <select value={fromId || ''} onChange={e => setFromId(Number(e.target.value))} className="bg-muted rounded px-3 py-2 text-sm flex-1">
                <option value="">From...</option>
                {statuses.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
              <ArrowRight className="w-5 h-5 text-muted-foreground shrink-0" />
              <select value={toId || ''} onChange={e => setToId(Number(e.target.value))} className="bg-muted rounded px-3 py-2 text-sm flex-1">
                <option value="">To...</option>
                {statuses.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
              <Button size="sm" onClick={() => fromId && toId && fromId !== toId && addTransMut.mutate({ fromId, toId })} disabled={!fromId || !toId || fromId === toId}>
                Add
              </Button>
            </div>
          )}
          <div className="space-y-2">
            {transitions?.map(t => (
              <div key={t.id} className="flex items-center gap-2 text-sm bg-muted/30 rounded px-3 py-2">
                <Badge variant="outline">{getStatusName(t.fromStatusId)}</Badge>
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
                <Badge variant="outline">{getStatusName(t.toStatusId)}</Badge>
                <button onClick={() => removeTransMut.mutate({ id: t.id })} className="ml-auto text-muted-foreground hover:text-destructive">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
            {(!transitions || transitions.length === 0) && <p className="text-sm text-muted-foreground">No transitions defined. Add allowed status transitions above.</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

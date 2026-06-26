import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Link2, Plus, ArrowRight, CheckCircle, XCircle, RefreshCw, Wrench } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminCrossReferencesPage() {
  const { data: refs, isLoading } = trpc.crossReferences.all.useQuery();
  const { data: allTitles } = trpc.crossReferences.allTitles.useQuery();
  const utils = trpc.useUtils();
  const [lastOutput, setLastOutput] = useState<string | null>(null);

  const [sourceId, setSourceId] = useState('');
  const [targetId, setTargetId] = useState('');
  const [score, setScore] = useState('0.8');
  const [reason, setReason] = useState('');

  const runMaintenance = trpc.maintenance.runDbScripts.useMutation({
    onSuccess: (result) => {
      utils.crossReferences.all.invalidate();
      const summary = [
        result.fixOutput,
        result.crossRefOutput,
      ].filter(Boolean).join('\n\n');
      setLastOutput(summary);
      toast.success(result.dryRun ? 'Dry run complete' : 'Database maintenance complete');
    },
    onError: (err) => toast.error(err.message),
  });

  const addRef = trpc.crossReferences.add.useMutation({
    onSuccess: () => {
      utils.crossReferences.all.invalidate();
      setSourceId(''); setTargetId(''); setReason('');
      toast.success('Cross-reference added');
    },
  });

  const updateStatus = trpc.crossReferences.updateStatus.useMutation({
    onSuccess: () => {
      utils.crossReferences.all.invalidate();
      toast.success('Status updated');
    },
  });

  const titleMap = new Map((allTitles as any[] || []).map((t: any) => [t.id, t.title]));

  return (
    <div className="container max-w-5xl py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Link2 className="w-6 h-6 text-primary" />
          Document Cross-References
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Link related documents together for better discoverability</p>
      </div>

      <Card className="border-teal-500/30 bg-teal-500/5">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Wrench className="w-5 h-5 text-teal-600" />
            Database maintenance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Run workspace category fixes and regenerate all cross-references on the live database.
            No Railway console or CLI needed — this runs inside the ARG-Builder app where{' '}
            <code className="text-xs">DATABASE_URL</code> is already configured.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => runMaintenance.mutate({ dryRun: false })}
              disabled={runMaintenance.isPending}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${runMaintenance.isPending ? 'animate-spin' : ''}`} />
              Run full maintenance
            </Button>
            <Button
              variant="outline"
              onClick={() => runMaintenance.mutate({ dryRun: true })}
              disabled={runMaintenance.isPending}
            >
              Dry run (categories only)
            </Button>
          </div>
          {lastOutput && (
            <pre className="text-xs bg-muted/50 border border-border rounded-lg p-3 overflow-x-auto max-h-48 whitespace-pre-wrap">
              {lastOutput}
            </pre>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-lg">Add Cross-Reference</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
            <div>
              <label className="text-xs font-medium mb-1 block">Source Doc ID</label>
              <Input placeholder="e.g. 1" value={sourceId} onChange={(e) => setSourceId(e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block">Target Doc ID</label>
              <Input placeholder="e.g. 5" value={targetId} onChange={(e) => setTargetId(e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block">Relevance (0-1)</label>
              <Input placeholder="0.8" value={score} onChange={(e) => setScore(e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block">Reason</label>
              <Input placeholder="Similar topic" value={reason} onChange={(e) => setReason(e.target.value)} />
            </div>
            <Button
              onClick={() => addRef.mutate({ sourceDocId: Number(sourceId), targetDocId: Number(targetId), relevanceScore: Number(score), reason: reason || undefined })}
              disabled={!sourceId || !targetId || addRef.isPending}
            >
              <Plus className="w-4 h-4 mr-1" /> Add
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-lg">All Cross-References ({(refs as any[] || []).length})</CardTitle></CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : !refs || (refs as any[]).length === 0 ? (
            <p className="text-sm text-muted-foreground">No cross-references yet. Add one above to link related documents.</p>
          ) : (
            <div className="space-y-2">
              {(refs as any[]).map((ref: any) => (
                <div key={ref.id} className="flex items-center justify-between p-3 rounded-lg border border-border/40">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className="text-sm font-medium truncate">{titleMap.get(ref.sourceDocId) || `Doc #${ref.sourceDocId}`}</span>
                    <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" />
                    <span className="text-sm font-medium truncate">{titleMap.get(ref.targetDocId) || `Doc #${ref.targetDocId}`}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    <Badge variant="outline" className="text-xs">{(ref.relevanceScore * 100).toFixed(0)}%</Badge>
                    <Badge className={ref.status === 'approved' ? 'bg-green-500/20 text-green-400' : ref.status === 'rejected' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'}>
                      {ref.status}
                    </Badge>
                    {ref.status === 'suggested' && (
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" onClick={() => updateStatus.mutate({ id: ref.id, status: 'approved' })}>
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => updateStatus.mutate({ id: ref.id, status: 'rejected' })}>
                          <XCircle className="w-4 h-4 text-red-400" />
                        </Button>
                      </div>
                    )}
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

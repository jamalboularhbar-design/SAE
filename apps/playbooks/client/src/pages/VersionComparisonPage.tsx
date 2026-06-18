import { useState, useMemo } from 'react';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useRoute } from 'wouter';
import { GitCompare, RotateCcw, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function VersionComparisonPage() {
  const [, params] = useRoute('/doc/:slug/compare');
  const slug = params?.slug || '';
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [leftId, setLeftId] = useState<string>('');
  const [rightId, setRightId] = useState<string>('');
  const rollbackMut = trpc.versionRollback.rollback.useMutation({
    onSuccess: () => toast.success('Document rolled back successfully'),
    onError: () => toast.error('Rollback failed'),
  });

  const { data: versions } = trpc.documents.versions.useQuery({ slug }, { enabled: !!slug });
  const { data: leftVersion } = trpc.versionCompare.getVersion.useQuery(
    { versionId: Number(leftId) },
    { enabled: !!leftId }
  );
  const { data: rightVersion } = trpc.versionCompare.getVersion.useQuery(
    { versionId: Number(rightId) },
    { enabled: !!rightId }
  );

  const diffLines = useMemo(() => {
    if (!leftVersion?.content || !rightVersion?.content) return null;
    const leftLines = leftVersion.content.split('\n');
    const rightLines = rightVersion.content.split('\n');
    const maxLen = Math.max(leftLines.length, rightLines.length);
    const result: Array<{ left: string; right: string; changed: boolean }> = [];
    for (let i = 0; i < maxLen; i++) {
      const l = leftLines[i] || '';
      const r = rightLines[i] || '';
      result.push({ left: l, right: r, changed: l !== r });
    }
    return result;
  }, [leftVersion, rightVersion]);

  return (
    <div className="container max-w-6xl py-8">
      <div className="flex items-center gap-3 mb-6">
        <GitCompare className="w-6 h-6 text-indigo-400" />
        <div>
          <h1 className="text-2xl font-bold">Version Comparison</h1>
          <p className="text-sm text-muted-foreground">Compare any two versions of &quot;{slug}&quot; side by side</p>
        </div>
      </div>

      <div className="flex gap-4 mb-6 flex-wrap">
        <div>
          <label className="text-sm font-medium mb-1 block">Left Version</label>
          <Select value={leftId} onValueChange={setLeftId}>
            <SelectTrigger className="w-56">
              <SelectValue placeholder="Select version" />
            </SelectTrigger>
            <SelectContent>
              {versions?.map((v: any) => (
                <SelectItem key={v.id} value={String(v.id)}>
                  #{v.id} - {new Date(v.createdAt).toLocaleDateString()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Right Version</label>
          <Select value={rightId} onValueChange={setRightId}>
            <SelectTrigger className="w-56">
              <SelectValue placeholder="Select version" />
            </SelectTrigger>
            <SelectContent>
              {versions?.map((v: any) => (
                <SelectItem key={v.id} value={String(v.id)}>
                  #{v.id} - {new Date(v.createdAt).toLocaleDateString()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {isAdmin && leftId && (
        <div className="flex gap-2 mb-4">
          <Button
            size="sm"
            variant="outline"
            onClick={() => { if (confirm(`Rollback document "${slug}" to version #${leftId}?`)) rollbackMut.mutate({ slug, versionId: Number(leftId) }); }}
            disabled={rollbackMut.isPending}
          >
            {rollbackMut.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RotateCcw className="w-4 h-4 mr-2" />}
            Rollback to v{leftId}
          </Button>
          {rightId && rightId !== leftId && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => { if (confirm(`Rollback document "${slug}" to version #${rightId}?`)) rollbackMut.mutate({ slug, versionId: Number(rightId) }); }}
              disabled={rollbackMut.isPending}
            >
              {rollbackMut.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RotateCcw className="w-4 h-4 mr-2" />}
              Rollback to v{rightId}
            </Button>
          )}
        </div>
      )}

      {leftId && rightId && leftId === rightId && (
        <p className="text-sm text-yellow-500 mb-4">Please select two different versions to compare.</p>
      )}

      {diffLines && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">
              Comparing v{leftVersion?.id} vs v{rightVersion?.id}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="grid grid-cols-2 divide-x max-h-[600px] overflow-y-auto">
              <div className="p-4">
                <p className="text-xs font-medium text-muted-foreground mb-2">Version #{leftVersion?.id}</p>
                <div className="space-y-0.5 font-mono text-xs">
                  {diffLines.map((line, i) => (
                    <div key={i} className={`px-2 py-0.5 rounded ${line.changed ? 'bg-red-500/10 text-red-400' : ''}`}>
                      {line.left || '\u00A0'}
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-4">
                <p className="text-xs font-medium text-muted-foreground mb-2">Version #{rightVersion?.id}</p>
                <div className="space-y-0.5 font-mono text-xs">
                  {diffLines.map((line, i) => (
                    <div key={i} className={`px-2 py-0.5 rounded ${line.changed ? 'bg-green-500/10 text-green-400' : ''}`}>
                      {line.right || '\u00A0'}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {!diffLines && leftId && rightId && leftId !== rightId && (
        <p className="text-muted-foreground">Loading version content...</p>
      )}
    </div>
  );
}

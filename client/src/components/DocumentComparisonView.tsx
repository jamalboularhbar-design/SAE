import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GitCompare } from 'lucide-react';

interface DocumentComparisonViewProps {
  slug: string;
}

function computeDiff(oldText: string, newText: string): Array<{ type: 'same' | 'added' | 'removed'; line: string }> {
  const oldLines = oldText.split('\n');
  const newLines = newText.split('\n');
  const result: Array<{ type: 'same' | 'added' | 'removed'; line: string }> = [];

  let i = 0, j = 0;
  while (i < oldLines.length || j < newLines.length) {
    if (i < oldLines.length && j < newLines.length && oldLines[i] === newLines[j]) {
      result.push({ type: 'same', line: oldLines[i] });
      i++; j++;
    } else if (j < newLines.length && (i >= oldLines.length || !oldLines.slice(i).includes(newLines[j]))) {
      result.push({ type: 'added', line: newLines[j] });
      j++;
    } else {
      result.push({ type: 'removed', line: oldLines[i] });
      i++;
    }
  }
  return result;
}

export default function DocumentComparisonView({ slug }: DocumentComparisonViewProps) {
  const { data: versions } = trpc.documents.versions.useQuery({ slug });
  const [selectedVersions, setSelectedVersions] = useState<[number | null, number | null]>([null, null]);
  const [diffResult, setDiffResult] = useState<Array<{ type: 'same' | 'added' | 'removed'; line: string }> | null>(null);

  const utils = trpc.useUtils();

  const handleCompare = async () => {
    if (selectedVersions[0] === null || selectedVersions[1] === null) return;
    try {
      const [v1Content, v2Content] = await Promise.all([
        utils.documents.versionContent.fetch({ id: selectedVersions[0] }),
        utils.documents.versionContent.fetch({ id: selectedVersions[1] }),
      ]);
      const diff = computeDiff(v1Content?.content || '', v2Content?.content || '');
      setDiffResult(diff);
    } catch {
      setDiffResult([{ type: 'same', line: 'Error loading version content' }]);
    }
  };

  if (!versions || versions.length < 2) {
    return (
      <Card className="card-premium">
        <CardContent className="py-6">
          <p className="text-sm text-muted-foreground text-center">Need at least 2 versions to compare.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="card-premium">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <GitCompare className="w-5 h-5 text-accent" />
          Compare Versions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Version A (older)</label>
            <select
              value={selectedVersions[0] ?? ''}
              onChange={e => setSelectedVersions([Number(e.target.value) || null, selectedVersions[1]])}
              className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="">Select version...</option>
              {versions.map((v: any) => (
                <option key={v.id} value={v.id}>
                  v{v.id} - {new Date(v.createdAt).toLocaleDateString()} {v.changeNote ? `(${v.changeNote})` : ''}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Version B (newer)</label>
            <select
              value={selectedVersions[1] ?? ''}
              onChange={e => setSelectedVersions([selectedVersions[0], Number(e.target.value) || null])}
              className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="">Select version...</option>
              {versions.map((v: any) => (
                <option key={v.id} value={v.id}>
                  v{v.id} - {new Date(v.createdAt).toLocaleDateString()} {v.changeNote ? `(${v.changeNote})` : ''}
                </option>
              ))}
            </select>
          </div>
        </div>

        <Button
          onClick={handleCompare}
          disabled={selectedVersions[0] === null || selectedVersions[1] === null}
          size="sm"
        >
          <GitCompare className="w-4 h-4 mr-2" />
          Compare
        </Button>

        {diffResult && (
          <div className="mt-4 border border-border rounded-md overflow-auto max-h-96 font-mono text-xs">
            {diffResult.map((line, i) => (
              <div
                key={i}
                className={`px-3 py-0.5 ${
                  line.type === 'added' ? 'bg-green-500/10 text-green-400' :
                  line.type === 'removed' ? 'bg-red-500/10 text-red-400' :
                  'text-muted-foreground'
                }`}
              >
                <span className="mr-2 opacity-50">
                  {line.type === 'added' ? '+' : line.type === 'removed' ? '-' : ' '}
                </span>
                {line.line || '\u00A0'}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

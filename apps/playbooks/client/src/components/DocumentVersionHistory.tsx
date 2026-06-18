import { useState, useMemo } from 'react';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import { History, ChevronDown, ChevronUp, Eye, GitCompare, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

interface DocumentVersionHistoryProps {
  slug: string;
}

// Simple line-by-line diff
function computeDiff(oldText: string, newText: string): { type: 'same' | 'added' | 'removed'; line: string }[] {
  const oldLines = oldText.split('\n').slice(0, 50); // Limit to first 50 lines for performance
  const newLines = newText.split('\n').slice(0, 50);
  const result: { type: 'same' | 'added' | 'removed'; line: string }[] = [];

  let i = 0, j = 0;
  while (i < oldLines.length || j < newLines.length) {
    if (i < oldLines.length && j < newLines.length && oldLines[i] === newLines[j]) {
      result.push({ type: 'same', line: oldLines[i] });
      i++; j++;
    } else if (j < newLines.length && (i >= oldLines.length || !oldLines.includes(newLines[j]))) {
      result.push({ type: 'added', line: newLines[j] });
      j++;
    } else if (i < oldLines.length) {
      result.push({ type: 'removed', line: oldLines[i] });
      i++;
    }
  }
  return result;
}

export default function DocumentVersionHistory({ slug }: DocumentVersionHistoryProps) {
  const [showVersions, setShowVersions] = useState(false);
  const [viewingId, setViewingId] = useState<number | null>(null);
  const [diffMode, setDiffMode] = useState(false);
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const utils = trpc.useUtils();

  const restoreMut = trpc.versionRestore.restore.useMutation({
    onSuccess: () => {
      toast.success('Version restored successfully');
      utils.documents.getBySlug.invalidate({ slug });
      utils.documents.versions.invalidate({ slug });
    },
    onError: (err) => toast.error(err.message),
  });

  const { data: versions } = trpc.documents.versions.useQuery(
    { slug },
    { enabled: showVersions }
  );

  const { data: versionContent } = trpc.documents.versionContent.useQuery(
    { id: viewingId! },
    { enabled: viewingId !== null }
  );

  // Get current document content for diff comparison
  const { data: currentDoc } = trpc.documents.getBySlug.useQuery(
    { slug },
    { enabled: diffMode && viewingId !== null }
  );

  const diffLines = useMemo(() => {
    if (!diffMode || !versionContent?.content || !currentDoc?.content) return null;
    return computeDiff(versionContent.content, currentDoc.content);
  }, [diffMode, versionContent?.content, currentDoc?.content]);

  return (
    <div className="mt-4 border-t border-border/50 pt-4">
      <button
        onClick={() => setShowVersions(!showVersions)}
        className="flex items-center gap-2 text-sm font-semibold text-foreground hover:text-accent transition-colors"
        aria-expanded={showVersions}
        aria-label="Toggle version history"
      >
        <History className="w-4 h-4" aria-hidden="true" />
        Version History
        {showVersions ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
      </button>

      {showVersions && (
        <div className="mt-3 space-y-2">
          {versions && versions.length > 0 ? (
            versions.map(version => (
              <div key={version.id} className="p-3 rounded-md bg-card/30 border border-border/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-foreground font-medium">{version.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {version.editedBy && <span>by {version.editedBy} · </span>}
                      {new Date(version.createdAt).toLocaleString()}
                    </p>
                    {version.changeNote && (
                      <p className="text-xs text-accent mt-1">{version.changeNote}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => { setViewingId(viewingId === version.id ? null : version.id); setDiffMode(false); }}
                      className={`text-muted-foreground hover:text-accent transition-colors p-1.5 rounded ${viewingId === version.id && !diffMode ? 'text-accent bg-accent/10' : ''}`}
                      aria-label="View version content"
                      title="View raw content"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => { setViewingId(version.id); setDiffMode(true); }}
                      className={`text-muted-foreground hover:text-accent transition-colors p-1.5 rounded ${viewingId === version.id && diffMode ? 'text-accent bg-accent/10' : ''}`}
                      aria-label="Compare with current version"
                      title="Diff with current"
                    >
                      <GitCompare className="w-4 h-4" />
                    </button>
                    {isAdmin && (
                      <button
                        onClick={() => { if (confirm('Restore this version? Current content will be saved as a new version first.')) restoreMut.mutate({ slug, versionId: version.id }); }}
                        className="text-muted-foreground hover:text-orange-400 transition-colors p-1.5 rounded"
                        aria-label="Restore this version"
                        title="Restore this version"
                        disabled={restoreMut.isPending}
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {viewingId === version.id && !diffMode && versionContent && (
                  <div className="mt-3 p-3 rounded bg-background/50 border border-border/30 max-h-60 overflow-y-auto">
                    <pre className="text-xs text-muted-foreground whitespace-pre-wrap font-mono">
                      {versionContent.content?.substring(0, 2000)}
                      {(versionContent.content?.length || 0) > 2000 && '...'}
                    </pre>
                  </div>
                )}

                {viewingId === version.id && diffMode && diffLines && (
                  <div className="mt-3 p-3 rounded bg-background/50 border border-border/30 max-h-72 overflow-y-auto">
                    <p className="text-xs text-muted-foreground mb-2 font-medium">
                      Changes from this version to current (first 50 lines):
                    </p>
                    <div className="font-mono text-xs space-y-0">
                      {diffLines.map((line, idx) => (
                        <div
                          key={idx}
                          className={`px-2 py-0.5 ${
                            line.type === 'added' ? 'bg-green-500/10 text-green-400 border-l-2 border-green-500' :
                            line.type === 'removed' ? 'bg-red-500/10 text-red-400 border-l-2 border-red-500 line-through' :
                            'text-muted-foreground'
                          }`}
                        >
                          <span className="select-none opacity-50 mr-2">
                            {line.type === 'added' ? '+' : line.type === 'removed' ? '-' : ' '}
                          </span>
                          {line.line || '\u00A0'}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground py-2">No previous versions recorded.</p>
          )}
        </div>
      )}
    </div>
  );
}

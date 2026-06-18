import { useState, useMemo } from 'react';
import { useParams, useLocation } from 'wouter';
import { trpc } from '@/lib/trpc';
import { ArrowLeft, GitCompare, Loader2, Columns2, List } from 'lucide-react';
import ContextualHelp from '@/components/ContextualHelp';

interface DiffLine {
  left: { text: string; type: 'same' | 'removed' | 'empty' };
  right: { text: string; type: 'same' | 'added' | 'empty' };
}

function computeSideBySideDiff(oldText: string, newText: string): DiffLine[] {
  const oldLines = oldText.split('\n');
  const newLines = newText.split('\n');
  const result: DiffLine[] = [];

  // Simple LCS-based approach for side-by-side
  let i = 0, j = 0;
  while (i < oldLines.length || j < newLines.length) {
    if (i >= oldLines.length) {
      result.push({ left: { text: '', type: 'empty' }, right: { text: newLines[j], type: 'added' } });
      j++;
    } else if (j >= newLines.length) {
      result.push({ left: { text: oldLines[i], type: 'removed' }, right: { text: '', type: 'empty' } });
      i++;
    } else if (oldLines[i] === newLines[j]) {
      result.push({ left: { text: oldLines[i], type: 'same' }, right: { text: newLines[j], type: 'same' } });
      i++; j++;
    } else {
      // Look ahead to find matching lines
      let foundInNew = -1, foundInOld = -1;
      for (let k = j + 1; k < Math.min(j + 5, newLines.length); k++) {
        if (oldLines[i] === newLines[k]) { foundInNew = k; break; }
      }
      for (let k = i + 1; k < Math.min(i + 5, oldLines.length); k++) {
        if (oldLines[k] === newLines[j]) { foundInOld = k; break; }
      }

      if (foundInNew > -1 && (foundInOld === -1 || foundInNew - j <= foundInOld - i)) {
        // Lines were added in new
        while (j < foundInNew) {
          result.push({ left: { text: '', type: 'empty' }, right: { text: newLines[j], type: 'added' } });
          j++;
        }
      } else if (foundInOld > -1) {
        // Lines were removed from old
        while (i < foundInOld) {
          result.push({ left: { text: oldLines[i], type: 'removed' }, right: { text: '', type: 'empty' } });
          i++;
        }
      } else {
        // Modified line
        result.push({ left: { text: oldLines[i], type: 'removed' }, right: { text: newLines[j], type: 'added' } });
        i++; j++;
      }
    }
  }
  return result;
}

function computeUnifiedDiff(oldText: string, newText: string) {
  const oldLines = oldText.split('\n');
  const newLines = newText.split('\n');
  const diff: { type: 'same' | 'added' | 'removed'; text: string }[] = [];
  const maxLen = Math.max(oldLines.length, newLines.length);
  for (let i = 0; i < maxLen; i++) {
    const oldLine = oldLines[i];
    const newLine = newLines[i];
    if (oldLine === newLine) {
      diff.push({ type: 'same', text: oldLine || '' });
    } else {
      if (oldLine !== undefined) diff.push({ type: 'removed', text: oldLine });
      if (newLine !== undefined) diff.push({ type: 'added', text: newLine });
    }
  }
  return diff;
}

export default function DiffViewerPage() {
  const params = useParams<{ slug: string }>();
  const [, navigate] = useLocation();
  const slug = params.slug || '';
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'side-by-side' | 'unified'>('side-by-side');

  const { data: versions, isLoading } = trpc.changelogDiff.get.useQuery({ slug });

  const sideBySideDiff = useMemo(() => {
    if (!versions || versions.length < 1) return [];
    const selected = versions[selectedIndex];
    if (!selected) return [];
    return computeSideBySideDiff(selected.oldValue || '', selected.newValue || '');
  }, [versions, selectedIndex]);

  const unifiedDiff = useMemo(() => {
    if (!versions || versions.length < 1) return [];
    const selected = versions[selectedIndex];
    if (!selected) return [];
    return computeUnifiedDiff(selected.oldValue || '', selected.newValue || '');
  }, [versions, selectedIndex]);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/50">
        <div className="container h-14 flex items-center gap-3">
          <button onClick={() => navigate(`/docs/${slug}`)} className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <GitCompare className="w-5 h-5 text-accent" />
          <h1 className="text-lg font-bold text-foreground">Changelog Diff</h1>
          <span className="text-xs text-muted-foreground ml-2 truncate">{slug}</span>
          <ContextualHelp title="Changelog Diff Viewer" description="Compare document versions side-by-side or in unified view. Green lines are additions, red lines are removals. Select a version from the sidebar to see its changes." />
          <div className="ml-auto flex items-center gap-1 bg-card/50 rounded-lg p-0.5 border border-border/50">
            <button
              onClick={() => setViewMode('side-by-side')}
              className={`p-1.5 rounded-md transition-colors ${viewMode === 'side-by-side' ? 'bg-accent/20 text-accent' : 'text-muted-foreground hover:text-foreground'}`}
              title="Side-by-side view"
            >
              <Columns2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('unified')}
              className={`p-1.5 rounded-md transition-colors ${viewMode === 'unified' ? 'bg-accent/20 text-accent' : 'text-muted-foreground hover:text-foreground'}`}
              title="Unified view"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <div className="container py-8 max-w-6xl">
        {isLoading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-accent" /></div>
        ) : versions && versions.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6">
            {/* Version List */}
            <div className="space-y-2">
              <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Content Changes</h2>
              {versions.map((v, i) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedIndex(i)}
                  className={`w-full p-3 rounded-lg text-left transition-colors ${
                    i === selectedIndex ? 'bg-accent/10 border border-accent/30' : 'bg-card/30 border border-border/50 hover:bg-card/50'
                  }`}
                >
                  <p className="text-xs font-medium text-foreground">{v.changedBy || 'admin'}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {v.createdAt ? new Date(v.createdAt).toLocaleDateString() : 'Unknown date'}
                  </p>
                </button>
              ))}
            </div>

            {/* Diff View */}
            <div className="rounded-xl border border-border/50 bg-card/20 overflow-hidden">
              <div className="p-3 border-b border-border/30 bg-card/30 flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  Showing changes by <span className="text-foreground font-medium">{versions[selectedIndex]?.changedBy || 'admin'}</span>
                  {versions[selectedIndex]?.createdAt && (
                    <> on {new Date(versions[selectedIndex].createdAt!).toLocaleString()}</>
                  )}
                </p>
                <span className="text-[10px] text-muted-foreground bg-muted/30 px-2 py-0.5 rounded">
                  {viewMode === 'side-by-side' ? 'Side-by-Side' : 'Unified'}
                </span>
              </div>

              {viewMode === 'side-by-side' ? (
                <div className="max-h-[600px] overflow-y-auto">
                  <div className="grid grid-cols-2 divide-x divide-border/30">
                    {/* Left (old) header */}
                    <div className="px-3 py-1.5 bg-red-500/5 border-b border-border/30">
                      <span className="text-[10px] font-semibold text-red-400 uppercase tracking-wider">Previous</span>
                    </div>
                    {/* Right (new) header */}
                    <div className="px-3 py-1.5 bg-green-500/5 border-b border-border/30">
                      <span className="text-[10px] font-semibold text-green-400 uppercase tracking-wider">Current</span>
                    </div>
                  </div>
                  <div className="font-mono text-xs">
                    {sideBySideDiff.length > 0 ? sideBySideDiff.map((line, i) => (
                      <div key={i} className="grid grid-cols-2 divide-x divide-border/20">
                        <div className={`px-3 py-0.5 ${
                          line.left.type === 'removed' ? 'bg-red-500/10 text-red-300' :
                          line.left.type === 'empty' ? 'bg-muted/5 text-transparent' :
                          'text-muted-foreground'
                        }`}>
                          <span className="select-none mr-2 opacity-40 text-[10px]">{line.left.type !== 'empty' ? i + 1 : ''}</span>
                          {line.left.text || '\u00A0'}
                        </div>
                        <div className={`px-3 py-0.5 ${
                          line.right.type === 'added' ? 'bg-green-500/10 text-green-300' :
                          line.right.type === 'empty' ? 'bg-muted/5 text-transparent' :
                          'text-muted-foreground'
                        }`}>
                          <span className="select-none mr-2 opacity-40 text-[10px]">{line.right.type !== 'empty' ? i + 1 : ''}</span>
                          {line.right.text || '\u00A0'}
                        </div>
                      </div>
                    )) : (
                      <p className="text-muted-foreground text-center py-8">No content diff available.</p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-4 max-h-[600px] overflow-y-auto font-mono text-xs">
                  {unifiedDiff.length > 0 ? unifiedDiff.map((line, i) => (
                    <div
                      key={i}
                      className={`px-2 py-0.5 ${
                        line.type === 'added' ? 'bg-green-500/10 text-green-300' :
                        line.type === 'removed' ? 'bg-red-500/10 text-red-300' :
                        'text-muted-foreground'
                      }`}
                    >
                      <span className="select-none mr-2 opacity-50">
                        {line.type === 'added' ? '+' : line.type === 'removed' ? '-' : ' '}
                      </span>
                      {line.text || '\u00A0'}
                    </div>
                  )) : (
                    <p className="text-muted-foreground text-center py-8">No content diff available for this change.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <GitCompare className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-foreground mb-2">No Content Changes</h2>
            <p className="text-sm text-muted-foreground">No content change history found for this document.</p>
          </div>
        )}
      </div>
    </div>
  );
}

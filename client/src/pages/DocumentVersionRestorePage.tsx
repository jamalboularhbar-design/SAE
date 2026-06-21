import { useState } from 'react';
import { useAuth } from '@/_core/hooks/useAuth';
import { trpc } from '@/lib/trpc';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { RotateCcw, Clock, FileText, ArrowLeft, CheckCircle, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

export default function DocumentVersionRestorePage() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [selectedSlug, setSelectedSlug] = useState('');
  const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState<any>(null);

  const { data: docs } = trpc.documents.list.useQuery({ limit: 100 });
  const { data: versions, refetch: refetchVersions } = trpc.documents.versions.useQuery(
    { slug: selectedSlug },
    { enabled: !!selectedSlug }
  );

  const updateMutation = trpc.documents.update.useMutation({
    onSuccess: () => {
      toast.success('Document restored to selected version');
      setRestoreDialogOpen(false);
      refetchVersions();
    },
    onError: (err: any) => {
      toast.error(`Restore failed: ${err.message}`);
    },
  });

  const versionContentQuery = trpc.documents.versionContent.useQuery(
    { id: selectedVersion?.id ?? 0 },
    { enabled: !!selectedVersion?.id }
  );

  const handleRestore = () => {
    if (!selectedVersion || !selectedSlug) return;
    const content = versionContentQuery.data?.content;
    if (!content) {
      toast.error('Could not load version content');
      return;
    }
    updateMutation.mutate({ slug: selectedSlug, content });
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="sm" onClick={() => navigate('/toc')}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <RotateCcw className="w-6 h-6 text-accent" />
              Document Version Restore
            </h1>
            <p className="text-sm text-muted-foreground">Restore any document to a previous version from its history</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Document selector */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle className="text-sm">Select Document</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 max-h-[500px] overflow-y-auto">
              {docs?.documents?.map((doc: any) => (
                <button
                  key={doc.slug}
                  onClick={() => setSelectedSlug(doc.slug)}
                  className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                    selectedSlug === doc.slug
                      ? 'bg-accent text-accent-foreground'
                      : 'hover:bg-muted'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-3 h-3 shrink-0" />
                    <span className="truncate">{doc.title}</span>
                  </div>
                </button>
              ))}
              {!docs?.documents?.length && (
                <p className="text-xs text-muted-foreground text-center py-4">No documents found</p>
              )}
            </CardContent>
          </Card>

          {/* Version history */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-sm">
                {selectedSlug ? `Version History` : 'Select a document to view versions'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!selectedSlug && (
                <div className="text-center py-12 text-muted-foreground">
                  <Clock className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">Choose a document from the left panel</p>
                </div>
              )}
              {selectedSlug && !versions?.length && (
                <div className="text-center py-12 text-muted-foreground">
                  <AlertTriangle className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">No version history available for this document</p>
                </div>
              )}
              {versions && versions.length > 0 && (
                <div className="space-y-3">
                  {versions.map((version: any, idx: number) => (
                    <div
                      key={version.id}
                      className="flex items-center justify-between p-3 rounded-lg border border-border hover:border-accent/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-mono">
                          v{versions.length - idx}
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            {version.changeNote || 'Content update'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(version.createdAt).toLocaleString()} 
                            {version.wordCount && ` • ${version.wordCount} words`}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {idx === 0 && (
                          <Badge variant="outline" className="text-xs">
                            <CheckCircle className="w-3 h-3 mr-1" /> Current
                          </Badge>
                        )}
                        {idx > 0 && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedVersion(version);
                              setRestoreDialogOpen(true);
                            }}
                          >
                            <RotateCcw className="w-3 h-3 mr-1" /> Restore
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Restore confirmation dialog */}
      <Dialog open={restoreDialogOpen} onOpenChange={setRestoreDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Version Restore</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              This will replace the current document content with the selected version. 
              The current version will be saved in history so you can undo this action.
            </p>
            {selectedVersion && (
              <div className="mt-3 p-3 rounded bg-muted text-sm">
                <p><strong>Restoring to:</strong> {selectedVersion.changeNote || 'Content update'}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Created: {new Date(selectedVersion.createdAt).toLocaleString()}
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRestoreDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleRestore} disabled={updateMutation.isPending}>
              {updateMutation.isPending ? 'Restoring...' : 'Restore Version'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

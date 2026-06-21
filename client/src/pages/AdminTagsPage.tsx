import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Tag, Pencil, Trash2, Merge, ArrowLeft, Search } from 'lucide-react';
import { useLocation } from 'wouter';


export default function AdminTagsPage() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [feedback, setFeedback] = useState('');
  const [search, setSearch] = useState('');
  const [renameTag, setRenameTag] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [mergeTag, setMergeTag] = useState<string | null>(null);
  const [mergeTarget, setMergeTarget] = useState('');
  const [deleteTag, setDeleteTag] = useState<string | null>(null);

  const { data: tags, refetch } = trpc.tagManagement.listWithCounts.useQuery(undefined, { enabled: user?.role === 'admin' });
  const renameMutation = trpc.tagManagement.rename.useMutation({
    onSuccess: (data) => { setFeedback(`Renamed! ${data.affected} documents updated.`); refetch(); setRenameTag(null); setTimeout(() => setFeedback(''), 3000); }
  });
  const mergeMutation = trpc.tagManagement.merge.useMutation({
    onSuccess: (data) => { setFeedback(`Merged! ${data.merged} documents moved.`); refetch(); setMergeTag(null); setTimeout(() => setFeedback(''), 3000); }
  });
  const deleteMutation = trpc.tagManagement.deleteGlobally.useMutation({
    onSuccess: (data) => { setFeedback(`Deleted! Removed from ${data.deleted} documents.`); refetch(); setDeleteTag(null); setTimeout(() => setFeedback(''), 3000); }
  });

  if (user?.role !== 'admin') {
    return <div className="container py-12 text-center text-muted-foreground">Admin access required.</div>;
  }

  const filteredTags = tags?.filter(t => t.tag.toLowerCase().includes(search.toLowerCase())) || [];

  return (
    <div className="container py-8 max-w-4xl mx-auto">
      <button onClick={() => navigate('/')} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-accent mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </button>

      <div className="flex items-center gap-3 mb-6">
        <Tag className="w-6 h-6 text-accent" />
        <h1 className="text-2xl font-bold">Tag Management</h1>
        <Badge variant="secondary">{tags?.length || 0} tags</Badge>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search tags..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {feedback && (
        <div className="mb-4 p-3 rounded-lg bg-accent/10 border border-accent/30 text-sm text-accent">
          {feedback}
        </div>
      )}

      <div className="grid gap-2">
        {filteredTags.map(({ tag, count }) => (
          <Card key={tag} className="border-border/30">
            <CardContent className="py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="font-mono">{tag}</Badge>
                <span className="text-sm text-muted-foreground">{count} document{count !== 1 ? 's' : ''}</span>
              </div>
              <div className="flex items-center gap-1">
                <Button size="sm" variant="ghost" onClick={() => { setRenameTag(tag); setNewName(tag); }} title="Rename">
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="ghost" onClick={() => { setMergeTag(tag); setMergeTarget(''); }} title="Merge into another tag">
                  <Merge className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setDeleteTag(tag)} title="Delete globally" className="text-destructive hover:text-destructive">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {filteredTags.length === 0 && (
          <p className="text-center text-muted-foreground py-8">No tags found.</p>
        )}
      </div>

      {/* Rename Dialog */}
      <Dialog open={!!renameTag} onOpenChange={(open) => !open && setRenameTag(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Rename Tag: {renameTag}</DialogTitle></DialogHeader>
          <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="New tag name" />
          <DialogFooter>
            <Button variant="outline" onClick={() => setRenameTag(null)}>Cancel</Button>
            <Button onClick={() => renameTag && renameMutation.mutate({ oldTag: renameTag, newTag: newName })} disabled={!newName.trim() || newName === renameTag}>
              Rename
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Merge Dialog */}
      <Dialog open={!!mergeTag} onOpenChange={(open) => !open && setMergeTag(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Merge "{mergeTag}" into another tag</DialogTitle></DialogHeader>
          <Input value={mergeTarget} onChange={(e) => setMergeTarget(e.target.value)} placeholder="Target tag name" />
          <p className="text-sm text-muted-foreground">All documents with "{mergeTag}" will be moved to the target tag.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMergeTag(null)}>Cancel</Button>
            <Button onClick={() => mergeTag && mergeMutation.mutate({ sourceTag: mergeTag, targetTag: mergeTarget })} disabled={!mergeTarget.trim() || mergeTarget === mergeTag}>
              Merge
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={!!deleteTag} onOpenChange={(open) => !open && setDeleteTag(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Delete Tag: {deleteTag}</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">This will remove the tag from all documents. The documents themselves will not be deleted.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTag(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => deleteTag && deleteMutation.mutate({ tag: deleteTag })}>
              Delete Globally
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

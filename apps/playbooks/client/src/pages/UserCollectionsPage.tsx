import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { ArrowLeft, FolderPlus, Trash2, ChevronRight, Loader2, Library, FileText } from 'lucide-react';
import { useLocation, Link } from 'wouter';

export default function UserCollectionsPage() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const { data: collections, isLoading, refetch } = trpc.userCollections.list.useQuery(undefined, { enabled: !!user });
  const createMut = trpc.userCollections.create.useMutation({
    onSuccess: () => { refetch(); toast.success('Collection created'); setShowCreate(false); setNewName(''); },
    onError: () => toast.error('Failed to create collection'),
  });
  const deleteMut = trpc.userCollections.delete.useMutation({
    onSuccess: () => { refetch(); toast.success('Collection deleted'); },
  });

  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [expandedId, setExpandedId] = useState<number | null>(null);

  if (!user) return <div className="p-8 text-center text-muted-foreground">Please log in to manage collections</div>;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/50">
        <div className="container h-14 flex items-center gap-3">
          <button onClick={() => navigate('/')} className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <Library className="w-5 h-5 text-accent" />
          <h1 className="text-lg font-bold text-foreground">My Collections</h1>
          <div className="ml-auto">
            <Button onClick={() => setShowCreate(!showCreate)} size="sm" variant="outline">
              <FolderPlus className="w-4 h-4 mr-2" /> New Collection
            </Button>
          </div>
        </div>
      </header>
      <div className="container py-8 max-w-3xl">
        {showCreate && (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="space-y-3">
                <input placeholder="Collection name" value={newName} onChange={e => setNewName(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-muted/50 border border-border text-sm text-foreground" />
                <input placeholder="Description (optional)" value={newDesc} onChange={e => setNewDesc(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-muted/50 border border-border text-sm text-foreground" />
                <Button onClick={() => createMut.mutate({ name: newName, description: newDesc || undefined })} disabled={!newName.trim() || createMut.isPending} size="sm">
                  {createMut.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                  Create
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
        {isLoading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-accent" /></div>
        ) : collections && collections.length > 0 ? (
          <div className="space-y-3">
            {collections.map((c: any) => (
              <CollectionCard key={c.id} collection={c} expanded={expandedId === c.id} onToggle={() => setExpandedId(expandedId === c.id ? null : c.id)} onDelete={() => { if (confirm('Delete this collection?')) deleteMut.mutate({ id: c.id }); }} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-muted-foreground">
            <Library className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p>No collections yet. Create one to organize your documents.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function CollectionCard({ collection, expanded, onToggle, onDelete }: { collection: any; expanded: boolean; onToggle: () => void; onDelete: () => void }) {
  const { data: items, isLoading } = trpc.userCollections.items.useQuery({ collectionId: collection.id }, { enabled: expanded });
  const removeMut = trpc.userCollections.removeDoc.useMutation({
    onSuccess: () => toast.success('Document removed from collection'),
  });

  return (
    <Card>
      <CardHeader className="py-3 px-4 cursor-pointer" onClick={onToggle}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform ${expanded ? 'rotate-90' : ''}`} />
            <div>
              <CardTitle className="text-sm">{collection.name}</CardTitle>
              {collection.description && <p className="text-xs text-muted-foreground mt-0.5">{collection.description}</p>}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {collection.isPublic === 1 && <Badge variant="outline" className="text-xs">Public</Badge>}
            <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </CardHeader>
      {expanded && (
        <CardContent className="pt-0 pb-4 px-4">
          {isLoading ? (
            <div className="flex justify-center py-4"><Loader2 className="w-4 h-4 animate-spin text-accent" /></div>
          ) : items && items.length > 0 ? (
            <div className="space-y-2">
              {items.map((item: any) => (
                <div key={item.id} className="flex items-center gap-3 p-2 rounded-lg bg-muted/20">
                  <FileText className="w-4 h-4 text-muted-foreground shrink-0" />
                  <Link href={`/docs/${item.docSlug}`} className="text-sm text-foreground hover:text-accent transition-colors flex-1 truncate">
                    {item.docTitle || item.docSlug || `Doc #${item.documentId}`}
                  </Link>
                  {item.docCategory && <Badge variant="outline" className="text-xs shrink-0">{item.docCategory}</Badge>}
                  <button onClick={() => removeMut.mutate({ collectionId: collection.id, documentId: item.documentId })} className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors shrink-0">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground py-2">No documents in this collection yet.</p>
          )}
        </CardContent>
      )}
    </Card>
  );
}

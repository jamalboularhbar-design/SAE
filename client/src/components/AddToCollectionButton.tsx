import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { FolderPlus, Plus, Loader2, Check } from 'lucide-react';

interface AddToCollectionButtonProps {
  documentId: number;
  documentTitle: string;
}

export default function AddToCollectionButton({ documentId, documentTitle }: AddToCollectionButtonProps) {
  const { user } = useAuth();
  const [showPicker, setShowPicker] = useState(false);
  const [newName, setNewName] = useState('');
  const [showCreate, setShowCreate] = useState(false);

  const { data: collections, refetch } = trpc.userCollections.list.useQuery(undefined, {
    enabled: !!user && showPicker,
  });

  const addMut = trpc.userCollections.addDoc.useMutation({
    onSuccess: () => {
      toast.success('Added to collection');
      setShowPicker(false);
    },
    onError: (err) => {
      if (err.message?.includes('Duplicate')) {
        toast.info('Already in this collection');
      } else {
        toast.error('Failed to add to collection');
      }
    },
  });

  const createMut = trpc.userCollections.create.useMutation({
    onSuccess: (result: any) => {
      refetch();
      setShowCreate(false);
      setNewName('');
      // Auto-add to the newly created collection
      if (result?.id) {
        addMut.mutate({ collectionId: result.id, documentId });
      }
      toast.success('Collection created');
    },
    onError: () => toast.error('Failed to create collection'),
  });

  if (!user) return null;

  return (
    <div className="relative inline-block">
      <Button
        variant="outline"
        size="sm"
        className="gap-1.5 text-xs"
        onClick={() => setShowPicker(!showPicker)}
      >
        <FolderPlus className="w-3.5 h-3.5" />
        Add to Collection
      </Button>

      {showPicker && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-card border border-border rounded-lg shadow-xl z-50 overflow-hidden">
          <div className="p-2 border-b border-border/50">
            <p className="text-xs font-medium text-muted-foreground px-1">
              Add "{documentTitle.length > 25 ? documentTitle.slice(0, 25) + '...' : documentTitle}" to:
            </p>
          </div>

          <div className="max-h-48 overflow-y-auto">
            {!collections || collections.length === 0 ? (
              <p className="px-3 py-4 text-xs text-muted-foreground text-center">
                No collections yet. Create one below.
              </p>
            ) : (
              collections.map((col: any) => (
                <button
                  key={col.id}
                  onClick={() => addMut.mutate({ collectionId: col.id, documentId })}
                  disabled={addMut.isPending}
                  className="w-full px-3 py-2 text-left text-sm text-foreground hover:bg-accent/10 transition-colors flex items-center gap-2"
                >
                  <FolderPlus className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                  <span className="truncate">{col.name}</span>
                  {addMut.isPending && <Loader2 className="w-3 h-3 animate-spin ml-auto" />}
                </button>
              ))
            )}
          </div>

          <div className="border-t border-border/50 p-2">
            {showCreate ? (
              <div className="flex gap-1.5">
                <input
                  placeholder="Collection name"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  className="flex-1 px-2 py-1.5 rounded bg-muted/50 border border-border text-xs text-foreground"
                  autoFocus
                  onKeyDown={e => {
                    if (e.key === 'Enter' && newName.trim()) {
                      createMut.mutate({ name: newName.trim() });
                    }
                    if (e.key === 'Escape') setShowCreate(false);
                  }}
                />
                <Button
                  size="sm"
                  className="h-7 text-xs px-2"
                  onClick={() => newName.trim() && createMut.mutate({ name: newName.trim() })}
                  disabled={!newName.trim() || createMut.isPending}
                >
                  {createMut.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                </Button>
              </div>
            ) : (
              <button
                onClick={() => setShowCreate(true)}
                className="w-full px-2 py-1.5 text-xs text-muted-foreground hover:text-foreground flex items-center gap-1.5 rounded hover:bg-accent/10 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Create new collection
              </button>
            )}
          </div>

          {/* Close overlay on outside click */}
          <div
            className="fixed inset-0 -z-10"
            onClick={() => setShowPicker(false)}
          />
        </div>
      )}
    </div>
  );
}

import { useState } from 'react';
import { useLocation } from 'wouter';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import { ArrowLeft, BookOpen, Plus, Trash2, Globe, Lock, FileText, Clock, X, Search } from 'lucide-react';
import { toast } from 'sonner';

export default function CollectionsPage() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const { data: collections, refetch } = trpc.collections.list.useQuery(
    isAdmin ? undefined : { publishedOnly: true }
  );
  const { data: expandedCollection } = trpc.collections.get.useQuery(
    { id: expandedId! },
    { enabled: expandedId !== null }
  );

  const [addItemSearch, setAddItemSearch] = useState('');
  const { data: allDocs } = trpc.documents.list.useQuery({ limit: 200, status: 'published' });

  const createMut = trpc.collections.create.useMutation({ onSuccess: () => { refetch(); setShowCreate(false); setNewName(''); setNewDesc(''); } });
  const deleteMut = trpc.collections.delete.useMutation({ onSuccess: () => refetch() });
  const updateMut = trpc.collections.update.useMutation({ onSuccess: () => refetch() });
  const addItemMut = trpc.collections.addItem.useMutation({ onSuccess: () => { toast.success('Document added'); setAddItemSearch(''); } });
  const removeItemMut = trpc.collections.removeItem.useMutation({ onSuccess: () => toast.success('Document removed') });

  const filteredDocs = allDocs?.documents?.filter(d =>
    d.title.toLowerCase().includes(addItemSearch.toLowerCase())
  ).slice(0, 8) || [];

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/50">
        <div className="container h-14 flex items-center gap-3">
          <button onClick={() => navigate('/')} className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <BookOpen className="w-5 h-5 text-accent" />
          <h1 className="text-lg font-bold text-foreground">Collections</h1>
          <span className="text-xs text-muted-foreground ml-2">Curated reading paths</span>
          {isAdmin && (
            <button
              onClick={() => setShowCreate(!showCreate)}
              className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-accent text-accent-foreground text-sm hover:bg-accent/90"
            >
              <Plus className="w-4 h-4" /> New
            </button>
          )}
        </div>
      </header>

      <div className="container py-6 max-w-3xl">
        {/* Create form */}
        {showCreate && isAdmin && (
          <div className="mb-6 p-4 rounded-xl border border-border bg-card/50">
            <h3 className="text-sm font-semibold text-foreground mb-3">Create Collection</h3>
            <input
              value={newName}
              onChange={e => setNewName(e.target.value)}
              placeholder="Collection name..."
              className="w-full mb-2 px-3 py-2 rounded-md border border-border bg-background text-foreground text-sm"
            />
            <textarea
              value={newDesc}
              onChange={e => setNewDesc(e.target.value)}
              placeholder="Description (optional)..."
              className="w-full mb-3 px-3 py-2 rounded-md border border-border bg-background text-foreground text-sm h-20 resize-none"
            />
            <button
              onClick={() => createMut.mutate({ name: newName, description: newDesc || undefined })}
              disabled={!newName.trim() || createMut.isPending}
              className="px-4 py-2 rounded-md bg-accent text-accent-foreground text-sm disabled:opacity-50"
            >
              {createMut.isPending ? 'Creating...' : 'Create'}
            </button>
          </div>
        )}

        {/* Collections list */}
        {!collections || collections.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-50" />
            <p>No collections yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {collections.map(col => (
              <div key={col.id} className="rounded-xl border border-border/50 overflow-hidden">
                <button
                  onClick={() => setExpandedId(expandedId === col.id ? null : col.id)}
                  className="w-full flex items-center gap-3 p-4 hover:bg-card/50 transition-colors text-left"
                >
                  <div className="w-3 h-10 rounded-full shrink-0" style={{ backgroundColor: col.coverColor || '#c9a96e' }} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-foreground truncate">{col.name}</p>
                    {col.description && <p className="text-xs text-muted-foreground truncate mt-0.5">{col.description}</p>}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {col.isPublished ? (
                      <Globe className="w-3.5 h-3.5 text-green-500" />
                    ) : (
                      <Lock className="w-3.5 h-3.5 text-muted-foreground" />
                    )}
                    {isAdmin && (
                      <>
                        <button
                          onClick={e => { e.stopPropagation(); updateMut.mutate({ id: col.id, isPublished: col.isPublished ? 0 : 1 }); }}
                          className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground hover:text-foreground"
                        >
                          {col.isPublished ? 'Unpublish' : 'Publish'}
                        </button>
                        <button
                          onClick={e => { e.stopPropagation(); deleteMut.mutate({ id: col.id }); }}
                          className="text-red-500 hover:text-red-400 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </button>

                {/* Expanded items */}
                {expandedId === col.id && expandedCollection && (
                  <div className="border-t border-border/50 p-4 bg-card/30">
                    {expandedCollection.items.length === 0 ? (
                      <p className="text-xs text-muted-foreground">No documents in this collection yet.</p>
                    ) : (
                      <div className="space-y-2">
                        {expandedCollection.items.map((item, idx) => (
                          <div
                            key={item.documentSlug}
                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/5 transition-colors"
                          >
                            <span className="text-xs text-muted-foreground w-5 text-right">{idx + 1}.</span>
                            <FileText className="w-4 h-4 text-accent shrink-0" />
                            <button
                              onClick={() => navigate(`/docs/${item.documentSlug}`)}
                              className="text-sm text-foreground truncate flex-1 text-left hover:text-accent"
                            >
                              {item.title}
                            </button>
                            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {Math.ceil((item.wordCount || 0) / 200)}m
                            </span>
                            {isAdmin && (
                              <button
                                onClick={() => removeItemMut.mutate({ collectionId: col.id, documentSlug: item.documentSlug })}
                                className="text-red-400 hover:text-red-300 p-1"
                                title="Remove from collection"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Admin: Add document to collection */}
                    {isAdmin && (
                      <div className="mt-3 pt-3 border-t border-border/30">
                        <div className="relative">
                          <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-muted-foreground" />
                          <input
                            value={addItemSearch}
                            onChange={e => setAddItemSearch(e.target.value)}
                            placeholder="Search documents to add..."
                            className="w-full pl-8 pr-3 py-1.5 rounded-md border border-border bg-background text-foreground text-xs"
                          />
                        </div>
                        {addItemSearch.trim() && filteredDocs.length > 0 && (
                          <div className="mt-1 max-h-32 overflow-y-auto space-y-0.5">
                            {filteredDocs.map(doc => (
                              <button
                                key={doc.slug}
                                onClick={() => addItemMut.mutate({ collectionId: col.id, documentSlug: doc.slug })}
                                className="w-full flex items-center gap-2 p-1.5 rounded text-left text-xs text-muted-foreground hover:text-foreground hover:bg-accent/5"
                              >
                                <Plus className="w-3 h-3 text-accent" />
                                <span className="truncate">{doc.title}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

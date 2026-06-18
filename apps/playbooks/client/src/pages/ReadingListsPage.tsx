import { useState } from 'react';
import { useLocation } from 'wouter';
import { trpc } from '@/lib/trpc';
import { ArrowLeft, Plus, Trash2, BookOpen, FileText, Clock, X } from 'lucide-react';

function getVisitorId() {
  let id = localStorage.getItem('visitor_id');
  if (!id) {
    id = 'v_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
    localStorage.setItem('visitor_id', id);
  }
  return id;
}

export default function ReadingListsPage() {
  const [, navigate] = useLocation();
  const visitorId = getVisitorId();
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [expandedList, setExpandedList] = useState<number | null>(null);

  const { data: lists, refetch } = trpc.readingLists.list.useQuery({ visitorId });
  const { data: items } = trpc.readingLists.items.useQuery(
    { listId: expandedList! },
    { enabled: expandedList !== null }
  );

  const createMutation = trpc.readingLists.create.useMutation({
    onSuccess: () => { refetch(); setShowCreate(false); setNewName(''); setNewDesc(''); },
  });

  const deleteMutation = trpc.readingLists.delete.useMutation({
    onSuccess: () => { refetch(); setExpandedList(null); },
  });

  const removeItemMutation = trpc.readingLists.removeItem.useMutation({
    onSuccess: () => { refetch(); },
  });

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/50">
        <div className="container h-14 flex items-center gap-3">
          <button onClick={() => navigate('/')} className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <BookOpen className="w-5 h-5 text-accent" />
          <h1 className="text-lg font-bold text-foreground">Reading Lists</h1>
        </div>
      </header>

      <div className="container py-6 sm:py-8 max-w-3xl mx-auto">
        {/* Create new list */}
        {!showCreate ? (
          <button
            onClick={() => setShowCreate(true)}
            className="w-full flex items-center justify-center gap-2 p-4 rounded-lg border-2 border-dashed border-border/50 text-muted-foreground hover:border-accent/50 hover:text-accent transition-colors mb-6"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm font-medium">Create New Reading List</span>
          </button>
        ) : (
          <div className="p-4 rounded-lg border border-accent/30 bg-card/30 mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-foreground">New Reading List</h3>
              <button onClick={() => setShowCreate(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>
            <input
              type="text"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              placeholder="List name..."
              className="w-full px-3 py-2 rounded-md bg-background border border-border text-foreground text-sm mb-2 focus:outline-none focus:border-accent/50"
            />
            <input
              type="text"
              value={newDesc}
              onChange={e => setNewDesc(e.target.value)}
              placeholder="Description (optional)..."
              className="w-full px-3 py-2 rounded-md bg-background border border-border text-foreground text-sm mb-3 focus:outline-none focus:border-accent/50"
            />
            <button
              onClick={() => createMutation.mutate({ visitorId, name: newName, description: newDesc || undefined })}
              disabled={!newName.trim() || createMutation.isPending}
              className="px-4 py-2 rounded-md bg-accent text-accent-foreground text-sm font-medium hover:bg-accent/90 disabled:opacity-50 transition-colors"
            >
              {createMutation.isPending ? 'Creating...' : 'Create List'}
            </button>
          </div>
        )}

        {/* Lists */}
        {(!lists || lists.length === 0) && !showCreate && (
          <div className="text-center py-12 text-muted-foreground">
            <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No reading lists yet. Create one to organize your documents.</p>
          </div>
        )}

        <div className="space-y-3">
          {lists?.map(list => (
            <div key={list.id} className="rounded-lg border border-border/50 bg-card/30 overflow-hidden">
              <div
                role="button"
                tabIndex={0}
                onClick={() => setExpandedList(expandedList === list.id ? null : list.id)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setExpandedList(expandedList === list.id ? null : list.id); } }}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-card/50 transition-colors cursor-pointer"
              >
                <div>
                  <h3 className="text-sm font-semibold text-foreground">{list.name}</h3>
                  {list.description && <p className="text-xs text-muted-foreground mt-0.5">{list.description}</p>}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">{list.itemCount} docs</span>
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteMutation.mutate({ listId: list.id }); }}
                    className="text-muted-foreground hover:text-red-400 transition-colors p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {expandedList === list.id && items && (
                <div className="border-t border-border/50 p-3 space-y-2">
                  {items.length === 0 ? (
                    <p className="text-xs text-muted-foreground text-center py-4">No documents in this list yet.</p>
                  ) : (
                    items.map(item => (
                      <div key={item.slug} className="flex items-center gap-3 p-2 rounded-md hover:bg-background/50 group">
                        <FileText className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                        <button
                          onClick={() => navigate(`/docs/${item.slug}`)}
                          className="flex-1 text-left min-w-0"
                        >
                          <p className="text-xs font-medium text-foreground truncate group-hover:text-accent transition-colors">{item.title}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] text-muted-foreground">{item.category}</span>
                            {item.wordCount && (
                              <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                                <Clock className="w-2.5 h-2.5" />
                                {Math.ceil(item.wordCount / 200)} min
                              </span>
                            )}
                          </div>
                        </button>
                        <button
                          onClick={() => removeItemMutation.mutate({ listId: list.id, documentSlug: item.slug })}
                          className="text-muted-foreground hover:text-red-400 transition-colors p-1 opacity-0 group-hover:opacity-100"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

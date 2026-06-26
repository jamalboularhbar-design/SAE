import { useState, useMemo } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bookmark, Pencil, Trash2, Save, X, ArrowLeft, StickyNote } from 'lucide-react';
import { useLocation } from 'wouter';

function getVisitorId() {
  let id = localStorage.getItem('visitor_id');
  if (!id) { id = crypto.randomUUID(); localStorage.setItem('visitor_id', id); }
  return id;
}

export default function BookmarksPage() {
  const [, navigate] = useLocation();
  const visitorId = useMemo(() => getVisitorId(), []);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [editNote, setEditNote] = useState('');

  // Get bookmarks from localStorage
  const [bookmarks] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('favorites') || '[]'); } catch { return []; }
  });

  const { data: notes, refetch } = trpc.bookmarkNotes.list.useQuery({ visitorId });
  const upsertMutation = trpc.bookmarkNotes.upsert.useMutation({ onSuccess: () => { refetch(); setEditingSlug(null); } });
  const deleteMutation = trpc.bookmarkNotes.delete.useMutation({ onSuccess: () => refetch() });

  const notesMap = useMemo(() => {
    const map: Record<string, string> = {};
    if (notes) notes.forEach(n => { map[n.documentSlug] = n.note; });
    return map;
  }, [notes]);

  return (
    <div className="container py-8 max-w-4xl mx-auto">
      <button onClick={() => navigate('/')} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-accent mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </button>

      <div className="flex items-center gap-3 mb-8">
        <Bookmark className="w-6 h-6 text-accent" />
        <h1 className="text-2xl font-bold">My Bookmarks</h1>
        <Badge variant="secondary">{bookmarks.length} saved</Badge>
      </div>

      {bookmarks.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <Bookmark className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg">No bookmarks yet. Star documents to save them here.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {bookmarks.map((slug) => (
            <Card key={slug} className="border-border/50 hover:border-accent/30 transition-colors">
              <CardContent className="py-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <button
                      onClick={() => navigate(`/docs/${slug}`)}
                      className="text-left font-medium text-foreground hover:text-accent transition-colors truncate block w-full"
                    >
                      {slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                    </button>

                    {/* Note display */}
                    {notesMap[slug] && editingSlug !== slug && (
                      <div className="mt-2 p-3 rounded-lg bg-card/50 border border-border/30 text-sm text-muted-foreground">
                        <StickyNote className="w-3 h-3 inline mr-1 text-accent" />
                        {notesMap[slug]}
                      </div>
                    )}

                    {/* Note editor */}
                    {editingSlug === slug && (
                      <div className="mt-2 space-y-2">
                        <Textarea
                          value={editNote}
                          onChange={(e) => setEditNote(e.target.value)}
                          placeholder="Add a personal note about this bookmark..."
                          className="text-sm"
                          rows={3}
                        />
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => upsertMutation.mutate({ visitorId, documentSlug: slug, note: editNote })} disabled={!editNote.trim()}>
                            <Save className="w-3 h-3 mr-1" /> Save Note
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setEditingSlug(null)}>
                            <X className="w-3 h-3 mr-1" /> Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => { setEditingSlug(slug); setEditNote(notesMap[slug] || ''); }}
                      title="Edit note"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    {notesMap[slug] && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteMutation.mutate({ visitorId, documentSlug: slug })}
                        title="Delete note"
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

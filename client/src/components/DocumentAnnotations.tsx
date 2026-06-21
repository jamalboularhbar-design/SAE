import { useState, useEffect, useCallback } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Highlighter, Trash2, Edit2, MessageSquare, Plus } from 'lucide-react';
import { toast } from 'sonner';

interface DocumentAnnotationsProps {
  documentId: number;
}

const COLORS = ['yellow', 'green', 'blue', 'pink', 'orange'];
const COLOR_MAP: Record<string, string> = {
  yellow: 'bg-yellow-200/60 dark:bg-yellow-500/30',
  green: 'bg-green-200/60 dark:bg-green-500/30',
  blue: 'bg-blue-200/60 dark:bg-blue-500/30',
  pink: 'bg-pink-200/60 dark:bg-pink-500/30',
  orange: 'bg-orange-200/60 dark:bg-orange-500/30',
};

export default function DocumentAnnotations({ documentId }: DocumentAnnotationsProps) {
  const [showPanel, setShowPanel] = useState(false);
  const [editingNote, setEditingNote] = useState<number | null>(null);
  const [noteText, setNoteText] = useState('');
  const [selectedText, setSelectedText] = useState('');
  const [selectedColor, setSelectedColor] = useState('yellow');
  const [newNote, setNewNote] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);

  const { data: annotations, refetch } = trpc.annotations.list.useQuery(
    { documentId },
    { enabled: showPanel, retry: false }
  );
  const createMutation = trpc.annotations.create.useMutation({
    onSuccess: () => {
      refetch();
      setSelectedText('');
      setNewNote('');
      setShowCreateForm(false);
      toast.success('Annotation saved');
    },
  });
  const deleteMutation = trpc.annotations.delete.useMutation({
    onSuccess: () => { refetch(); toast.success('Annotation deleted'); },
  });
  const updateNoteMutation = trpc.annotations.updateNote.useMutation({
    onSuccess: () => { refetch(); setEditingNote(null); toast.success('Note updated'); },
  });

  // Listen for text selection in the document article
  const handleMouseUp = useCallback(() => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) return;

    const text = selection.toString().trim();
    if (text.length < 3 || text.length > 500) return;

    // Check if selection is within the article content area
    const articleEl = document.querySelector('article');
    if (!articleEl) return;

    const range = selection.getRangeAt(0);
    if (!articleEl.contains(range.commonAncestorContainer)) return;

    setSelectedText(text);
    setShowCreateForm(true);
    if (!showPanel) setShowPanel(true);
  }, [showPanel]);

  useEffect(() => {
    document.addEventListener('mouseup', handleMouseUp);
    return () => document.removeEventListener('mouseup', handleMouseUp);
  }, [handleMouseUp]);

  const handleCreate = () => {
    if (!selectedText) return;
    createMutation.mutate({
      documentId,
      highlightText: selectedText,
      startOffset: 0,
      endOffset: selectedText.length,
      color: selectedColor,
      note: newNote || undefined,
    });
  };

  if (!showPanel) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowPanel(true)}
        className="gap-2"
      >
        <Highlighter className="w-4 h-4" />
        Annotations
        {annotations && annotations.length > 0 && (
          <span className="bg-primary text-primary-foreground text-xs px-1.5 rounded-full">
            {annotations.length}
          </span>
        )}
      </Button>
    );
  }

  return (
    <div className="border rounded-lg p-4 mt-4 bg-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Highlighter className="w-5 h-5 text-primary" />
          My Annotations ({annotations?.length || 0})
        </h3>
        <Button size="sm" variant="ghost" onClick={() => setShowPanel(false)}>
          Close
        </Button>
      </div>

      <p className="text-xs text-muted-foreground mb-3">
        Select text in the document above to highlight and annotate it.
      </p>

      {/* Create annotation form - appears when text is selected */}
      {showCreateForm && selectedText && (
        <div className="border border-primary/30 rounded-lg p-3 mb-4 bg-primary/5">
          <p className="text-xs font-medium mb-2 flex items-center gap-1">
            <Plus className="w-3 h-3" /> New Annotation
          </p>
          <p className="text-sm italic mb-2 line-clamp-2">"{selectedText}"</p>
          <div className="flex items-center gap-1 mb-2">
            <span className="text-xs text-muted-foreground mr-1">Color:</span>
            {COLORS.map(c => (
              <button
                key={c}
                onClick={() => setSelectedColor(c)}
                className={`w-5 h-5 rounded-full border-2 ${
                  selectedColor === c ? 'border-foreground' : 'border-transparent'
                } ${COLOR_MAP[c]}`}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Add a note (optional)..."
              className="h-7 text-xs"
            />
            <Button
              size="sm"
              className="h-7"
              onClick={handleCreate}
              disabled={createMutation.isPending}
            >
              Save
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-7"
              onClick={() => { setShowCreateForm(false); setSelectedText(''); }}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {annotations && annotations.length > 0 ? (
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {annotations.map((a) => (
            <div key={a.id} className={`rounded p-3 ${COLOR_MAP[a.color] || COLOR_MAP.yellow}`}>
              <div className="flex items-start justify-between">
                <p className="text-sm font-medium italic">"{a.highlightText}"</p>
                <div className="flex gap-1 ml-2 flex-shrink-0">
                  <button
                    onClick={() => { setEditingNote(a.id); setNoteText(a.note || ''); }}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Edit2 className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => deleteMutation.mutate({ id: a.id })}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
              {editingNote === a.id ? (
                <div className="flex gap-2 mt-2">
                  <Input
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    placeholder="Add a note..."
                    className="h-7 text-xs"
                  />
                  <Button
                    size="sm"
                    className="h-7"
                    onClick={() => updateNoteMutation.mutate({ id: a.id, note: noteText })}
                  >
                    Save
                  </Button>
                </div>
              ) : a.note ? (
                <p className="text-xs mt-1 flex items-center gap-1">
                  <MessageSquare className="w-3 h-3" />
                  {a.note}
                </p>
              ) : null}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">No annotations yet. Highlight text in the document to create one.</p>
      )}
    </div>
  );
}

import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Pencil, Check, X } from 'lucide-react';

interface QuickEditInlineProps {
  documentId: number;
  title: string;
  content: string;
  onSaved: () => void;
}

export default function QuickEditInline({ documentId, title, content, onSaved }: QuickEditInlineProps) {
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const [editContent, setEditContent] = useState(content);

  const saveMut = trpc.quickEdit.update.useMutation({
    onSuccess: () => {
      toast.success('Document updated');
      setEditing(false);
      onSaved();
    },
    onError: () => toast.error('Failed to save'),
  });

  if (!editing) {
    return (
      <Button variant="ghost" size="sm" onClick={() => { setEditTitle(title); setEditContent(content); setEditing(true); }} className="text-muted-foreground hover:text-primary">
        <Pencil className="w-3.5 h-3.5 mr-1" /> Quick Edit
      </Button>
    );
  }

  return (
    <div className="border border-primary/30 rounded-lg p-4 space-y-3 bg-muted/20">
      <div>
        <label className="text-xs font-medium text-muted-foreground mb-1 block">Title</label>
        <Input value={editTitle} onChange={e => setEditTitle(e.target.value)} />
      </div>
      <div>
        <label className="text-xs font-medium text-muted-foreground mb-1 block">Content (Markdown)</label>
        <Textarea value={editContent} onChange={e => setEditContent(e.target.value)} rows={12} className="font-mono text-sm" />
      </div>
      <div className="flex gap-2">
        <Button size="sm" onClick={() => saveMut.mutate({ documentId, title: editTitle, content: editContent })} disabled={saveMut.isPending}>
          <Check className="w-3.5 h-3.5 mr-1" /> Save
        </Button>
        <Button size="sm" variant="outline" onClick={() => setEditing(false)}>
          <X className="w-3.5 h-3.5 mr-1" /> Cancel
        </Button>
      </div>
    </div>
  );
}

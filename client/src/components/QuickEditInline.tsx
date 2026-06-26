import { useEffect, useState } from 'react';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Pencil, Check, Loader2 } from 'lucide-react';

interface QuickEditInlineProps {
  documentId: number;
  documentSlug: string;
  title: string;
  content: string;
  onSaved?: () => void;
}

export default function QuickEditInline({
  documentId,
  documentSlug,
  title,
  content,
  onSaved,
}: QuickEditInlineProps) {
  const { user } = useAuth({ redirectOnUnauthenticated: false });
  const [open, setOpen] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const [editContent, setEditContent] = useState(content);

  const { data: editAccess } = trpc.quickEdit.canEdit.useQuery(undefined, {
    enabled: !!user,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const utils = trpc.useUtils();

  const saveMut = trpc.quickEdit.update.useMutation({
    onSuccess: async () => {
      toast.success('Document updated');
      setOpen(false);
      await utils.documents.getBySlug.invalidate({ slug: documentSlug });
      onSaved?.();
    },
    onError: (err) => toast.error(err.message || 'Failed to save'),
  });

  useEffect(() => {
    if (!open) return;
    setEditTitle(title);
    setEditContent(content);
  }, [open, title, content]);

  if (!editAccess?.canEdit) {
    return null;
  }

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setOpen(true)}
        className="text-muted-foreground hover:text-primary"
        title="Quick edit this document"
      >
        <Pencil className="w-3.5 h-3.5 mr-1" /> Quick Edit
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col gap-0 p-0">
          <DialogHeader className="px-6 pt-6 pb-4 border-b border-border">
            <DialogTitle>Quick Edit</DialogTitle>
            <DialogDescription>
              Update title and markdown content. Only admins and content editors can save changes.
            </DialogDescription>
          </DialogHeader>

          <div className="px-6 py-4 space-y-4 overflow-y-auto flex-1">
            <div>
              <label htmlFor="quick-edit-title" className="text-xs font-medium text-muted-foreground mb-1 block">
                Title
              </label>
              <Input
                id="quick-edit-title"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="quick-edit-content" className="text-xs font-medium text-muted-foreground mb-1 block">
                Content (Markdown)
              </label>
              <Textarea
                id="quick-edit-content"
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                rows={16}
                className="font-mono text-sm min-h-[280px] resize-y"
              />
            </div>
          </div>

          <DialogFooter className="px-6 py-4 border-t border-border gap-2 sm:gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={saveMut.isPending}>
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() =>
                saveMut.mutate({ documentId, title: editTitle.trim(), content: editContent })
              }
              disabled={saveMut.isPending || !editTitle.trim()}
            >
              {saveMut.isPending ? (
                <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" />
              ) : (
                <Check className="w-3.5 h-3.5 mr-1" />
              )}
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

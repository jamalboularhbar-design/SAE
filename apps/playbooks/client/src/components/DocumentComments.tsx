import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { MessageSquare, Send, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

function getVisitorId() {
  let id = localStorage.getItem('visitor_id');
  if (!id) {
    id = 'v_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
    localStorage.setItem('visitor_id', id);
  }
  return id;
}

interface DocumentCommentsProps {
  slug: string;
}

export default function DocumentComments({ slug }: DocumentCommentsProps) {
  const [newComment, setNewComment] = useState('');
  const [showComments, setShowComments] = useState(false);
  const visitorId = getVisitorId();

  const { data: comments, refetch } = trpc.comments.list.useQuery(
    { documentSlug: slug },
    { enabled: showComments }
  );

  const addMutation = trpc.comments.add.useMutation({
    onSuccess: () => {
      toast.success('Note added');
      setNewComment('');
      refetch();
    },
  });

  const deleteMutation = trpc.comments.delete.useMutation({
    onSuccess: () => {
      toast.success('Note deleted');
      refetch();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    addMutation.mutate({ documentSlug: slug, visitorId, content: newComment.trim() });
  };

  const myComments = comments?.filter(c => c.visitorId === visitorId) || [];
  const otherComments = comments?.filter(c => c.visitorId !== visitorId) || [];

  return (
    <div className="mt-6 border-t border-border/50 pt-6">
      <button
        onClick={() => setShowComments(!showComments)}
        className="flex items-center gap-2 text-sm font-semibold text-foreground hover:text-accent transition-colors"
      >
        <MessageSquare className="w-4 h-4" />
        Notes & Annotations
        {comments && comments.length > 0 && (
          <span className="text-xs text-muted-foreground">({comments.length})</span>
        )}
      </button>

      {showComments && (
        <div className="mt-4 space-y-4">
          {/* Add new note */}
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a private note..."
              className="flex-1 px-3 py-2 text-sm rounded-md bg-card/30 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent/50"
              maxLength={2000}
            />
            <button
              type="submit"
              disabled={!newComment.trim() || addMutation.isPending}
              className="px-3 py-2 rounded-md bg-accent text-accent-foreground text-sm hover:bg-accent/90 disabled:opacity-50 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          {/* My notes */}
          {myComments.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground font-medium">Your Notes</p>
              {myComments.map(comment => (
                <div key={comment.id} className="flex items-start gap-2 p-3 rounded-md bg-accent/5 border border-accent/20">
                  <p className="text-sm text-foreground flex-1">{comment.content}</p>
                  <button
                    onClick={() => deleteMutation.mutate({ id: comment.id, visitorId })}
                    className="text-muted-foreground hover:text-red-400 transition-colors flex-shrink-0 mt-0.5"
                    aria-label="Delete note"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Other notes (anonymized) */}
          {otherComments.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground font-medium">Community Notes</p>
              {otherComments.map(comment => (
                <div key={comment.id} className="p-3 rounded-md bg-card/30 border border-border/50">
                  <p className="text-sm text-foreground">{comment.content}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}

          {comments && comments.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">No notes yet. Add the first one!</p>
          )}
        </div>
      )}
    </div>
  );
}

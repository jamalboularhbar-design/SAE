import { useState, useEffect, useCallback } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { MessageSquare, Reply, CheckCircle, Trash2, Send, Highlighter } from 'lucide-react';

interface InlineCommentsProps {
  documentSlug: string;
  visitorId: string;
}

export default function InlineComments({ documentSlug, visitorId }: InlineCommentsProps) {
  const { data: comments, isLoading } = trpc.inlineComments.list.useQuery({ documentSlug });
  const addMutation = trpc.inlineComments.add.useMutation();
  const resolveMutation = trpc.inlineComments.resolve.useMutation();
  const deleteMutation = trpc.inlineComments.delete.useMutation();
  const utils = trpc.useUtils();

  const [newComment, setNewComment] = useState('');
  const [highlightedText, setHighlightedText] = useState('');
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState('');
  const [showResolved, setShowResolved] = useState(false);
  const [showHighlightPrompt, setShowHighlightPrompt] = useState(false);

  // Listen for text selection in the document content area
  const handleTextSelection = useCallback(() => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) {
      setShowHighlightPrompt(false);
      return;
    }
    const selectedText = selection.toString().trim();
    if (selectedText.length > 3 && selectedText.length < 500) {
      // Check if selection is within the document content area
      const anchorNode = selection.anchorNode;
      if (anchorNode) {
        const contentArea = document.querySelector('[data-document-content]');
        if (contentArea && contentArea.contains(anchorNode)) {
          setHighlightedText(selectedText);
          setShowHighlightPrompt(true);
        }
      }
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mouseup', handleTextSelection);
    return () => document.removeEventListener('mouseup', handleTextSelection);
  }, [handleTextSelection]);

  const handleAdd = async () => {
    if (!newComment.trim()) return;
    await addMutation.mutateAsync({
      documentSlug,
      visitorId,
      highlightText: highlightedText || '',
      comment: newComment.trim(),
    });
    setNewComment('');
    setHighlightedText('');
    setShowHighlightPrompt(false);
    utils.inlineComments.list.invalidate({ documentSlug });
  };

  const handleReply = async (parentId: number) => {
    if (!replyText.trim()) return;
    await addMutation.mutateAsync({
      documentSlug,
      visitorId,
      highlightText: '',
      comment: replyText.trim(),
      parentId,
    });
    setReplyTo(null);
    setReplyText('');
    utils.inlineComments.list.invalidate({ documentSlug });
  };

  const handleResolve = async (id: number) => {
    await resolveMutation.mutateAsync({ id });
    utils.inlineComments.list.invalidate({ documentSlug });
  };

  const handleDelete = async (id: number) => {
    await deleteMutation.mutateAsync({ id });
    utils.inlineComments.list.invalidate({ documentSlug });
  };

  if (isLoading) return null;

  const topLevelComments = (comments || []).filter((c: any) => !c.parentId);
  const repliesAll = (comments || []).filter((c: any) => c.parentId);
  const visibleComments = showResolved ? topLevelComments : topLevelComments.filter((c: any) => !c.resolved);

  return (
    <div className="mt-8 border-t border-border/50 pt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-accent" />
          Inline Comments ({topLevelComments.length})
        </h3>
        <button
          onClick={() => setShowResolved(!showResolved)}
          className="text-xs text-muted-foreground hover:text-accent transition-colors"
        >
          {showResolved ? 'Hide resolved' : 'Show resolved'}
        </button>
      </div>

      {/* Highlight prompt */}
      {showHighlightPrompt && highlightedText && (
        <div className="mb-4 p-3 rounded-lg bg-accent/5 border border-accent/20">
          <div className="flex items-center gap-2 mb-2">
            <Highlighter className="w-4 h-4 text-accent" />
            <span className="text-xs font-medium text-accent">Comment on selected text:</span>
          </div>
          <p className="text-xs text-muted-foreground italic border-l-2 border-accent/30 pl-2 mb-2 line-clamp-2">
            "{highlightedText}"
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              placeholder="Add your comment about this text..."
              className="flex-1 px-3 py-1.5 rounded bg-card border border-border text-foreground text-sm placeholder:text-muted-foreground"
              autoFocus
            />
            <Button size="sm" onClick={handleAdd} disabled={!newComment.trim() || addMutation.isPending}>
              <Send className="w-3.5 h-3.5" />
            </Button>
            <Button size="sm" variant="ghost" onClick={() => { setShowHighlightPrompt(false); setHighlightedText(''); }}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Add new comment (general) */}
      {!showHighlightPrompt && (
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            placeholder="Add a comment..."
            className="flex-1 px-3 py-2 rounded-lg bg-card border border-border text-foreground text-sm placeholder:text-muted-foreground"
          />
          <Button size="sm" onClick={handleAdd} disabled={!newComment.trim() || addMutation.isPending}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Comments list */}
      <div className="space-y-3">
        {visibleComments.map((comment: any) => {
          const commentReplies = repliesAll.filter((r: any) => r.parentId === comment.id);
          return (
            <div key={comment.id} className={`p-3 rounded-lg border ${comment.resolved ? 'border-green-500/20 bg-green-500/5 opacity-60' : 'border-border bg-card/50'}`}>
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  {comment.highlightText && (
                    <p className="text-xs text-accent/70 italic mb-1 border-l-2 border-accent/30 pl-2">"{comment.highlightText}"</p>
                  )}
                  <p className="text-sm text-foreground">{comment.comment}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    {comment.visitorId.slice(0, 8)} · {new Date(comment.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)} className="p-1 text-muted-foreground hover:text-accent transition-colors">
                    <Reply className="w-3.5 h-3.5" />
                  </button>
                  {!comment.resolved && (
                    <button onClick={() => handleResolve(comment.id)} className="p-1 text-muted-foreground hover:text-green-500 transition-colors">
                      <CheckCircle className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {comment.visitorId === visitorId && (
                    <button onClick={() => handleDelete(comment.id)} className="p-1 text-muted-foreground hover:text-red-500 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Replies */}
              {commentReplies.length > 0 && (
                <div className="mt-2 ml-4 space-y-2 border-l border-border/50 pl-3">
                  {commentReplies.map((reply: any) => (
                    <div key={reply.id} className="text-sm">
                      <p className="text-foreground/80">{reply.comment}</p>
                      <p className="text-[10px] text-muted-foreground">{reply.visitorId.slice(0, 8)} · {new Date(reply.createdAt).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Reply input */}
              {replyTo === comment.id && (
                <div className="mt-2 flex gap-2 ml-4">
                  <input
                    type="text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleReply(comment.id)}
                    placeholder="Reply..."
                    className="flex-1 px-2 py-1 rounded bg-background border border-border text-foreground text-xs"
                    autoFocus
                  />
                  <Button size="sm" variant="ghost" onClick={() => handleReply(comment.id)} disabled={!replyText.trim()} className="h-7 text-xs">
                    Reply
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

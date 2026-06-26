import { useState, useEffect } from 'react';
import { trpc } from '@/lib/trpc';
import { ThumbsUp, ThumbsDown, MessageSquare } from 'lucide-react';

function getVisitorId() {
  let id = localStorage.getItem('visitor_id');
  if (!id) {
    id = 'v_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem('visitor_id', id);
  }
  return id;
}

export default function DocumentFeedback({ slug }: { slug: string }) {
  const visitorId = getVisitorId();
  const [showComment, setShowComment] = useState(false);
  const [comment, setComment] = useState('');
  const [localSentiment, setLocalSentiment] = useState<'positive' | 'negative' | null>(null);

  const { data: feedbackData } = trpc.feedback.get.useQuery({ slug });
  const { data: myFeedback } = trpc.feedback.mine.useQuery({ slug, visitorId });
  const submitMutation = trpc.feedback.submit.useMutation();
  const utils = trpc.useUtils();

  useEffect(() => {
    if (myFeedback) {
      setLocalSentiment(myFeedback.sentiment);
    }
  }, [myFeedback]);

  const handleSubmit = async (sentiment: 'positive' | 'negative') => {
    setLocalSentiment(sentiment);
    await submitMutation.mutateAsync({
      documentSlug: slug,
      visitorId,
      sentiment,
      comment: comment || undefined,
    });
    utils.feedback.get.invalidate({ slug });
    utils.feedback.mine.invalidate({ slug, visitorId });
    setShowComment(false);
    setComment('');
  };

  const positive = feedbackData?.positive ?? 0;
  const negative = feedbackData?.negative ?? 0;

  return (
    <div className="border-t pt-6 mt-8">
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
        Was this document helpful?
      </h3>
      <div className="flex items-center gap-4">
        <button
          onClick={() => handleSubmit('positive')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
            localSentiment === 'positive'
              ? 'bg-green-50 border-green-300 text-green-700 dark:bg-green-900/30 dark:border-green-700 dark:text-green-400'
              : 'hover:bg-muted border-border'
          }`}
        >
          <ThumbsUp className="w-4 h-4" />
          <span className="text-sm font-medium">{positive}</span>
        </button>
        <button
          onClick={() => handleSubmit('negative')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
            localSentiment === 'negative'
              ? 'bg-red-50 border-red-300 text-red-700 dark:bg-red-900/30 dark:border-red-700 dark:text-red-400'
              : 'hover:bg-muted border-border'
          }`}
        >
          <ThumbsDown className="w-4 h-4" />
          <span className="text-sm font-medium">{negative}</span>
        </button>
        <button
          onClick={() => setShowComment(!showComment)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border hover:bg-muted transition-colors text-sm text-muted-foreground"
        >
          <MessageSquare className="w-4 h-4" />
          Add feedback
        </button>
      </div>
      {showComment && (
        <div className="mt-3 flex gap-2">
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Optional: tell us why..."
            className="flex-1 px-3 py-2 border border-border rounded-lg text-sm bg-background"
          />
          <button
            onClick={() => handleSubmit(localSentiment || 'positive')}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium"
          >
            Submit
          </button>
        </div>
      )}
      {feedbackData && feedbackData.comments.length > 0 && (
        <div className="mt-4 space-y-2">
          <p className="text-xs text-muted-foreground font-medium">Recent feedback:</p>
          {feedbackData.comments.slice(0, 3).map((fb, i) => (
            <div key={i} className="text-sm text-muted-foreground bg-muted/50 px-3 py-2 rounded">
              <span className={fb.sentiment === 'positive' ? 'text-green-600' : 'text-red-600'}>
                {fb.sentiment === 'positive' ? '👍' : '👎'}
              </span>{' '}
              {fb.comment}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

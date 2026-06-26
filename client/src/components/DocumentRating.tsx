import { useState, useEffect } from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { trpc } from '@/lib/trpc';

function getVisitorId() {
  let id = localStorage.getItem('visitor_id');
  if (!id) {
    id = 'v_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
    localStorage.setItem('visitor_id', id);
  }
  return id;
}

interface DocumentRatingProps {
  slug: string;
  upvotes: number;
  downvotes: number;
}

export default function DocumentRating({ slug, upvotes, downvotes }: DocumentRatingProps) {
  const visitorId = getVisitorId();
  const [localUpvotes, setLocalUpvotes] = useState(upvotes);
  const [localDownvotes, setLocalDownvotes] = useState(downvotes);
  const [userRating, setUserRating] = useState<'up' | 'down' | null>(null);

  const { data: existingRating } = trpc.documents.getUserRating.useQuery(
    { slug, visitorId },
    { enabled: !!slug }
  );

  useEffect(() => {
    if (existingRating !== undefined) {
      setUserRating(existingRating as 'up' | 'down' | null);
    }
  }, [existingRating]);

  const rateMutation = trpc.documents.rate.useMutation({
    onSuccess: (result) => {
      if (result.action === 'removed') {
        setUserRating(null);
      } else {
        setUserRating(result.rating as 'up' | 'down' | null);
      }
    },
  });

  const handleRate = (rating: 'up' | 'down') => {
    // Optimistic update
    if (userRating === rating) {
      // Toggle off
      if (rating === 'up') setLocalUpvotes(v => Math.max(0, v - 1));
      else setLocalDownvotes(v => Math.max(0, v - 1));
      setUserRating(null);
    } else if (userRating) {
      // Switch
      if (rating === 'up') {
        setLocalUpvotes(v => v + 1);
        setLocalDownvotes(v => Math.max(0, v - 1));
      } else {
        setLocalDownvotes(v => v + 1);
        setLocalUpvotes(v => Math.max(0, v - 1));
      }
      setUserRating(rating);
    } else {
      // New vote
      if (rating === 'up') setLocalUpvotes(v => v + 1);
      else setLocalDownvotes(v => v + 1);
      setUserRating(rating);
    }

    rateMutation.mutate({ slug, visitorId, rating });
  };

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-muted-foreground mr-1">Helpful?</span>
      <button
        onClick={() => handleRate('up')}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs transition-all ${
          userRating === 'up'
            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
            : 'bg-card/50 text-muted-foreground hover:text-green-400 hover:bg-green-500/10 border border-border/50'
        }`}
        disabled={rateMutation.isPending}
      >
        <ThumbsUp className="w-3.5 h-3.5" />
        <span>{localUpvotes}</span>
      </button>
      <button
        onClick={() => handleRate('down')}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs transition-all ${
          userRating === 'down'
            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
            : 'bg-card/50 text-muted-foreground hover:text-red-400 hover:bg-red-500/10 border border-border/50'
        }`}
        disabled={rateMutation.isPending}
      >
        <ThumbsDown className="w-3.5 h-3.5" />
        <span>{localDownvotes}</span>
      </button>
    </div>
  );
}

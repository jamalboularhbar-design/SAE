import { Eye, Clock, FileText, ThumbsUp, ThumbsDown } from 'lucide-react';

interface DocumentMetaStatsProps {
  viewCount: number;
  wordCount: number;
  upvotes: number;
  downvotes: number;
  wpm?: number;
}

export default function DocumentMetaStats({ viewCount, wordCount, upvotes, downvotes, wpm = 200 }: DocumentMetaStatsProps) {
  const readingTime = Math.ceil(wordCount / wpm);
  const totalVotes = upvotes + downvotes;
  const approvalRate = totalVotes > 0 ? Math.round((upvotes / totalVotes) * 100) : null;

  return (
    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground no-print">
      <span className="flex items-center gap-1" title={`${viewCount} views`}>
        <Eye className="w-3 h-3" /> {viewCount.toLocaleString()}
      </span>
      <span className="flex items-center gap-1" title={`${wordCount} words`}>
        <FileText className="w-3 h-3" /> {wordCount.toLocaleString()} words
      </span>
      <span className="flex items-center gap-1" title={`${readingTime} min read`}>
        <Clock className="w-3 h-3" /> {readingTime} min
      </span>
      {totalVotes > 0 && (
        <span className="flex items-center gap-1" title={`${approvalRate}% approval`}>
          <ThumbsUp className="w-3 h-3" /> {upvotes}
          <ThumbsDown className="w-3 h-3 ml-1" /> {downvotes}
          {approvalRate !== null && (
            <span className={`ml-1 ${approvalRate >= 70 ? 'text-green-500' : approvalRate >= 40 ? 'text-yellow-500' : 'text-red-500'}`}>
              ({approvalRate}%)
            </span>
          )}
        </span>
      )}
    </div>
  );
}

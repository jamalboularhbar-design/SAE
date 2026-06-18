import { trpc } from '@/lib/trpc';
import { Card, CardContent } from '@/components/ui/card';
import { Trophy, BookOpen, Brain, MessageSquare, Flame, Bookmark, Clock, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

function ScoreTier(score: number): { label: string; color: string; bg: string } {
  if (score >= 80) return { label: 'Champion', color: 'text-amber-400', bg: 'bg-amber-500/20' };
  if (score >= 60) return { label: 'Active', color: 'text-green-400', bg: 'bg-green-500/20' };
  if (score >= 30) return { label: 'Engaged', color: 'text-blue-400', bg: 'bg-blue-500/20' };
  return { label: 'Newcomer', color: 'text-gray-400', bg: 'bg-gray-500/20' };
}

export default function UserEngagementScorePage() {
  const { data: scorecard, isLoading } = trpc.engagementScorecard.get.useQuery();

  if (isLoading) return <div className="container max-w-2xl py-8"><p className="text-muted-foreground">Loading your scorecard...</p></div>;

  const card = scorecard as any;
  if (!card) {
    return (
      <div className="container max-w-2xl py-8 text-center">
        <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-xl font-bold mb-2">No Engagement Data Yet</h2>
        <p className="text-muted-foreground text-sm">Start reading documents, taking quizzes, and bookmarking content to build your engagement score.</p>
      </div>
    );
  }

  const tier = ScoreTier(card.engagementScore);
  const stats = [
    { icon: BookOpen, label: 'Documents Read', value: card.docsRead },
    { icon: Brain, label: 'Quizzes Taken', value: card.quizzesTaken },
    { icon: MessageSquare, label: 'Comments Made', value: card.commentsMade },
    { icon: Flame, label: 'Day Streak', value: card.streakDays },
    { icon: Bookmark, label: 'Bookmarks', value: card.bookmarkCount },
    { icon: Clock, label: 'Minutes Spent', value: card.totalTimeMinutes },
  ];

  return (
    <div className="container max-w-2xl py-8 space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold flex items-center justify-center gap-2">
          <Trophy className="w-6 h-6 text-primary" />
          My Engagement Score
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Track your learning progress and engagement</p>
      </div>

      <Card className="text-center p-8">
        <div className="text-6xl font-bold text-primary mb-2">{card.engagementScore.toFixed(0)}</div>
        <Badge className={`${tier.bg} ${tier.color} text-sm px-3 py-1`}>{tier.label}</Badge>
        <p className="text-xs text-muted-foreground mt-3">
          {card.lastActiveAt ? `Last active: ${new Date(card.lastActiveAt).toLocaleDateString()}` : ''}
        </p>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="p-4 text-center">
                <Icon className="w-5 h-5 text-muted-foreground mx-auto mb-2" />
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

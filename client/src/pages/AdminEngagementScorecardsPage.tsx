import { trpc } from '@/lib/trpc';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, BookOpen, Brain, MessageSquare, Flame, Bookmark, Clock } from 'lucide-react';

function ScoreTier(score: number): { label: string; color: string } {
  if (score >= 80) return { label: 'Champion', color: 'bg-amber-500/20 text-amber-400' };
  if (score >= 60) return { label: 'Active', color: 'bg-green-500/20 text-green-400' };
  if (score >= 30) return { label: 'Engaged', color: 'bg-blue-500/20 text-blue-400' };
  return { label: 'Newcomer', color: 'bg-gray-500/20 text-gray-400' };
}

export default function AdminEngagementScorecardsPage() {
  const { data: scorecards, isLoading } = trpc.engagementScorecard.list.useQuery({});

  return (
    <div className="container max-w-5xl py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Trophy className="w-6 h-6 text-primary" />
          User Engagement Scorecards
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Track user engagement metrics and identify top contributors</p>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading scorecards...</p>
      ) : !scorecards || (scorecards as any[]).length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Trophy className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No engagement data yet. Scorecards will populate as users interact with the system.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {(scorecards as any[]).map((card: any, idx: number) => {
            const tier = ScoreTier(card.engagementScore);
            return (
              <Card key={card.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary">
                        {idx + 1}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{card.userName || card.userOpenId.slice(0, 12)}</p>
                        <p className="text-xs text-muted-foreground">Last active: {card.lastActiveAt ? new Date(card.lastActiveAt).toLocaleDateString() : 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-primary">{card.engagementScore.toFixed(0)}</span>
                      <Badge className={tier.color}>{tier.label}</Badge>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                    <div className="flex items-center gap-1.5 text-xs">
                      <BookOpen className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="font-medium">{card.docsRead}</span>
                      <span className="text-muted-foreground">read</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs">
                      <Brain className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="font-medium">{card.quizzesTaken}</span>
                      <span className="text-muted-foreground">quizzes</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs">
                      <MessageSquare className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="font-medium">{card.commentsMade}</span>
                      <span className="text-muted-foreground">comments</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs">
                      <Flame className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="font-medium">{card.streakDays}</span>
                      <span className="text-muted-foreground">streak</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs">
                      <Bookmark className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="font-medium">{card.bookmarkCount}</span>
                      <span className="text-muted-foreground">bookmarks</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs">
                      <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="font-medium">{card.totalTimeMinutes}</span>
                      <span className="text-muted-foreground">min</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

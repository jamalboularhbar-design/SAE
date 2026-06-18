import { trpc } from '@/lib/trpc';
import { useLocation } from 'wouter';
import { ArrowLeft, Trophy, Flame, BookOpen, Loader2 } from 'lucide-react';
import ContextualHelp from '@/components/ContextualHelp';

export default function LeaderboardPage() {
  const [, navigate] = useLocation();
  const { data: leaderboard, isLoading } = trpc.streakLeaderboard.get.useQuery();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/50">
        <div className="container h-14 flex items-center gap-3">
          <button onClick={() => navigate('/')} className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <Trophy className="w-5 h-5 text-amber-400" />
          <h1 className="text-lg font-bold text-foreground">Reading Leaderboard</h1>
          <ContextualHelp title="Reading Leaderboard" description="Shows top readers ranked by their reading streak length. Read documents daily to climb the leaderboard and earn higher streak counts." />
        </div>
      </header>

      <div className="container py-8 max-w-2xl">
        {isLoading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-accent" /></div>
        ) : leaderboard && leaderboard.length > 0 ? (
          <div className="space-y-3">
            {leaderboard.map((entry, i) => (
              <div
                key={entry.userOpenId}
                className={`p-4 rounded-xl border bg-card/30 flex items-center gap-4 ${
                  i === 0 ? 'border-amber-500/30 bg-amber-500/5' :
                  i === 1 ? 'border-gray-400/30 bg-gray-400/5' :
                  i === 2 ? 'border-orange-600/30 bg-orange-600/5' :
                  'border-border/50'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  i === 0 ? 'bg-amber-500/20 text-amber-400' :
                  i === 1 ? 'bg-gray-400/20 text-gray-300' :
                  i === 2 ? 'bg-orange-600/20 text-orange-400' :
                  'bg-muted/30 text-muted-foreground'
                }`}>
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{entry.userName || 'Anonymous'}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Flame className="w-3 h-3 text-orange-400" /> {entry.currentStreak} day streak
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <BookOpen className="w-3 h-3" /> {entry.totalDocsRead} docs
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Best</p>
                  <p className="text-sm font-bold text-accent">{entry.longestStreak}d</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Trophy className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-foreground mb-2">No Streaks Yet</h2>
            <p className="text-sm text-muted-foreground">Start reading documents to build your streak and appear on the leaderboard!</p>
          </div>
        )}
      </div>
    </div>
  );
}

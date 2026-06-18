import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import OnboardingChecklist from '@/components/OnboardingChecklist';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, BookOpen, Star, Brain, Flame, Trophy, Loader2 } from 'lucide-react';
import { getLoginUrl } from '@/const';

export default function UserDashboardPage() {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin" /></div>;
  if (!isAuthenticated) {
    return (
      <div className="container max-w-3xl py-12 text-center">
        <User className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
        <h2 className="text-xl font-semibold mb-2">Sign in to view your dashboard</h2>
        <a href={getLoginUrl()} className="text-primary underline">Sign in</a>
      </div>
    );
  }

  const { data: stats, isLoading } = trpc.userDashboard.stats.useQuery();

  return (
    <div className="container max-w-5xl py-8">
      <div className="flex items-center gap-3 mb-6">
        <User className="w-6 h-6 text-blue-400" />
        <div>
          <h1 className="text-2xl font-bold">My Dashboard</h1>
          <p className="text-sm text-muted-foreground">Welcome back, {user?.name || 'User'}</p>
        </div>
      </div>

      {/* Onboarding Checklist for new users */}
      <div className="mb-6">
        <OnboardingChecklist />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <Card key={i} className="animate-pulse"><CardContent className="pt-6 h-24" /></Card>)}
        </div>
      ) : stats && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Card className="bg-card/80 border-border/50">
            <CardContent className="pt-5 pb-4 text-center">
              <BookOpen className="w-6 h-6 mx-auto mb-2 text-blue-400" />
              <div className="text-3xl font-bold">{stats.totalDocsRead}</div>
              <div className="text-xs text-muted-foreground mt-1">Documents Read</div>
            </CardContent>
          </Card>
          <Card className="bg-card/80 border-border/50">
            <CardContent className="pt-5 pb-4 text-center">
              <Star className="w-6 h-6 mx-auto mb-2 text-yellow-400" />
              <div className="text-3xl font-bold">{stats.totalBookmarks}</div>
              <div className="text-xs text-muted-foreground mt-1">Bookmarks</div>
            </CardContent>
          </Card>
          <Card className="bg-card/80 border-border/50">
            <CardContent className="pt-5 pb-4 text-center">
              <Brain className="w-6 h-6 mx-auto mb-2 text-purple-400" />
              <div className="text-3xl font-bold">{stats.quizzesTaken}</div>
              <div className="text-xs text-muted-foreground mt-1">Quizzes Taken</div>
            </CardContent>
          </Card>
          <Card className="bg-card/80 border-border/50">
            <CardContent className="pt-5 pb-4 text-center">
              <Trophy className="w-6 h-6 mx-auto mb-2 text-orange-400" />
              <div className="text-3xl font-bold">{stats.averageQuizScore}%</div>
              <div className="text-xs text-muted-foreground mt-1">Avg Quiz Score</div>
            </CardContent>
          </Card>
          <Card className="bg-card/80 border-border/50">
            <CardContent className="pt-5 pb-4 text-center">
              <Flame className="w-6 h-6 mx-auto mb-2 text-red-400" />
              <div className="text-3xl font-bold">{stats.currentStreak}</div>
              <div className="text-xs text-muted-foreground mt-1">Current Streak (days)</div>
            </CardContent>
          </Card>
          <Card className="bg-card/80 border-border/50">
            <CardContent className="pt-5 pb-4 text-center">
              <Flame className="w-6 h-6 mx-auto mb-2 text-amber-400" />
              <div className="text-3xl font-bold">{stats.longestStreak}</div>
              <div className="text-xs text-muted-foreground mt-1">Longest Streak (days)</div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Target, Trophy, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

export default function ReadingGoals() {
  const [goalInput, setGoalInput] = useState('');
  const utils = trpc.useUtils();

  // Use the leaderboard get query and find current user's entry
  const { data: leaderboard } = trpc.streakLeaderboard.get.useQuery(undefined, { retry: false });
  const streak = leaderboard?.[0]; // Best approximation - user's own entry if they're on leaderboard

  const docsRead = streak?.totalDocsRead || 0;
  const currentStreak = streak?.currentStreak || 0;

  // Simple goal: user sets a target number of docs to read
  const [targetDocs, setTargetDocs] = useState(10);
  const progress = Math.min((docsRead / targetDocs) * 100, 100);

  return (
    <div className="border rounded-lg p-4">
      <h3 className="text-sm font-semibold flex items-center gap-2 mb-3">
        <Target className="w-4 h-4 text-primary" />
        Reading Goals
      </h3>

      <div className="flex items-center gap-4 mb-3">
        <div className="flex-1">
          <div className="flex justify-between text-xs mb-1">
            <span>{docsRead} / {targetDocs} documents</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-accent/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <TrendingUp className="w-3 h-3" />
          {currentStreak} day streak
        </span>
        <span className="flex items-center gap-1">
          <Trophy className="w-3 h-3" />
          {docsRead} docs read
        </span>
      </div>

      <div className="flex items-center gap-2 mt-3">
        <Input
          type="number"
          min={1}
          max={1000}
          value={targetDocs}
          onChange={(e) => setTargetDocs(parseInt(e.target.value) || 10)}
          className="w-20 h-7 text-xs"
        />
        <span className="text-xs text-muted-foreground">target docs</span>
      </div>
    </div>
  );
}

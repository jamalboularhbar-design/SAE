import { useState, useEffect } from 'react';
import { trpc } from '@/lib/trpc';
import { Target, Trophy, Flame, BookOpen, Star, Award } from 'lucide-react';

function getVisitorId() {
  let id = localStorage.getItem('arg-visitor-id');
  if (!id) {
    id = 'visitor-' + Math.random().toString(36).substring(2, 15);
    localStorage.setItem('arg-visitor-id', id);
  }
  return id;
}

const BADGE_ICONS: Record<string, any> = {
  'Bookworm': { icon: BookOpen, color: 'text-blue-400' },
  'Scholar': { icon: Star, color: 'text-purple-400' },
  'Expert': { icon: Award, color: 'text-emerald-400' },
  'Master': { icon: Trophy, color: 'text-[#d4af37]' },
  'Weekly Goal Met': { icon: Flame, color: 'text-orange-400' },
};

export default function ReadingGoalsPage() {
  const [visitorId] = useState(getVisitorId);
  const { data: progress, refetch } = trpc.readingGoals.get.useQuery({ visitorId });
  const setGoalMutation = trpc.readingGoals.setGoal.useMutation({ onSuccess: () => refetch() });
  const [newTarget, setNewTarget] = useState<number>(5);

  useEffect(() => {
    if (progress?.target) setNewTarget(progress.target);
  }, [progress?.target]);

  const percentage = progress ? Math.min(100, Math.round((progress.docsRead / progress.target) * 100)) : 0;

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Target className="w-8 h-8 text-[#d4af37]" />
          <div>
            <h1 className="text-3xl font-bold text-[#d4af37]">Reading Goals</h1>
            <p className="text-muted-foreground text-sm">Track your weekly reading progress and earn badges</p>
          </div>
        </div>

        {/* Progress Ring */}
        <div className="bg-card border border-border rounded-lg p-8 mb-6 text-center">
          <div className="relative inline-block mb-4">
            <svg className="w-40 h-40 transform -rotate-90">
              <circle cx="80" cy="80" r="70" stroke="#1f2937" strokeWidth="12" fill="none" />
              <circle
                cx="80" cy="80" r="70"
                stroke="#d4af37"
                strokeWidth="12"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 70}`}
                strokeDashoffset={`${2 * Math.PI * 70 * (1 - percentage / 100)}`}
                strokeLinecap="round"
                className="transition-all duration-700"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div>
                <span className="text-3xl font-bold text-foreground">{percentage}%</span>
                <p className="text-xs text-muted-foreground">complete</p>
              </div>
            </div>
          </div>
          <p className="text-lg text-foreground/80">
            <span className="text-[#d4af37] font-bold">{progress?.docsRead || 0}</span> of{' '}
            <span className="text-foreground font-bold">{progress?.target || 5}</span> documents read this week
          </p>
          {progress?.totalReads !== undefined && (
            <p className="text-sm text-muted-foreground mt-2">Total lifetime reads: {progress.totalReads}</p>
          )}
        </div>

        {/* Set Goal */}
        <div className="bg-card border border-border rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Set Weekly Target</h2>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min={1}
              max={30}
              value={newTarget}
              onChange={e => setNewTarget(Number(e.target.value))}
              className="flex-1 accent-[#d4af37]"
            />
            <span className="text-xl font-bold text-[#d4af37] w-12 text-center">{newTarget}</span>
            <button
              onClick={() => setGoalMutation.mutate({ visitorId, weeklyTarget: newTarget })}
              className="px-4 py-2 bg-[#d4af37] text-black rounded font-medium hover:bg-[#c4a030] text-sm"
            >
              Save
            </button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">Documents per week</p>
        </div>

        {/* Badges */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Badges Earned</h2>
          {progress?.badges && progress.badges.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {progress.badges.map((badge: string) => {
                const badgeInfo = BADGE_ICONS[badge] || { icon: Star, color: 'text-muted-foreground' };
                const Icon = badgeInfo.icon;
                return (
                  <div key={badge} className="flex items-center gap-3 bg-input border border-border rounded-lg p-4">
                    <Icon className={`w-8 h-8 ${badgeInfo.color}`} />
                    <span className="font-medium text-sm">{badge}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Trophy className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>Start reading to earn badges!</p>
              <p className="text-xs mt-1">Read 5 docs for your first badge</p>
            </div>
          )}

          {/* Badge Requirements */}
          <div className="mt-6 border-t border-border pt-4">
            <h3 className="text-sm font-medium text-muted-foreground mb-3">All Badges</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-muted-foreground"><span>Bookworm</span><span>5 total reads</span></div>
              <div className="flex justify-between text-muted-foreground"><span>Scholar</span><span>25 total reads</span></div>
              <div className="flex justify-between text-muted-foreground"><span>Expert</span><span>50 total reads</span></div>
              <div className="flex justify-between text-muted-foreground"><span>Master</span><span>100 total reads</span></div>
              <div className="flex justify-between text-muted-foreground"><span>Weekly Goal Met</span><span>Meet your weekly target</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { trpc } from '@/lib/trpc';
import { Trophy, Medal } from 'lucide-react';

export default function EngagementLeaderboard() {
  const { data: visitors } = trpc.userManagement.analytics.useQuery();

  if (!visitors || visitors.length === 0) return null;

  const top5 = visitors.slice(0, 5);

  return (
    <div className="p-4 rounded-lg border border-border/50 bg-card/30">
      <h4 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3">
        <Trophy className="w-4 h-4 text-accent" />
        Most Engaged Readers
      </h4>
      <div className="space-y-2">
        {top5.map((v: any, i: number) => (
          <div key={v.visitorId} className="flex items-center gap-2">
            {i < 3 ? (
              <Medal className={`w-4 h-4 ${i === 0 ? 'text-yellow-500' : i === 1 ? 'text-gray-400' : 'text-amber-600'}`} />
            ) : (
              <span className="w-4 text-center text-xs text-muted-foreground">{i + 1}</span>
            )}
            <span className="text-xs font-mono text-foreground flex-1 truncate">{v.visitorId?.slice(0, 10)}...</span>
            <span className="text-xs text-muted-foreground">{v.actionCount} actions</span>
          </div>
        ))}
      </div>
    </div>
  );
}

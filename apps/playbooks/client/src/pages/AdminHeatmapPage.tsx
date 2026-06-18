import { useState, useMemo } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/_core/hooks/useAuth';
import { trpc } from '@/lib/trpc';
import { ArrowLeft, Activity } from 'lucide-react';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const HOURS = Array.from({ length: 24 }, (_, i) => i);

export default function AdminHeatmapPage() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const [days, setDays] = useState(30);

  const { data: heatmapData } = trpc.heatmap.get.useQuery({ days });

  const { grid, maxCount } = useMemo(() => {
    const g: number[][] = Array.from({ length: 7 }, () => Array(24).fill(0));
    let max = 0;
    if (heatmapData) {
      for (const entry of heatmapData) {
        // MySQL DAYOFWEEK: 1=Sunday, 2=Monday...7=Saturday
        const dayIdx = (entry.dayOfWeek as number) - 1;
        const hourIdx = entry.hour as number;
        if (dayIdx >= 0 && dayIdx < 7 && hourIdx >= 0 && hourIdx < 24) {
          g[dayIdx][hourIdx] = entry.count;
          if (entry.count > max) max = entry.count;
        }
      }
    }
    return { grid: g, maxCount: max };
  }, [heatmapData]);

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Admin access required.</p>
      </div>
    );
  }

  const getColor = (count: number) => {
    if (count === 0 || maxCount === 0) return 'bg-muted/30';
    const intensity = count / maxCount;
    if (intensity > 0.75) return 'bg-accent';
    if (intensity > 0.5) return 'bg-accent/70';
    if (intensity > 0.25) return 'bg-accent/40';
    return 'bg-accent/20';
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/50">
        <div className="container h-14 flex items-center gap-3">
          <button onClick={() => navigate('/admin/dashboard')} className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <Activity className="w-5 h-5 text-accent" />
          <h1 className="text-lg font-bold text-foreground">Reading Heatmap</h1>
          <div className="ml-auto flex items-center gap-2">
            {[7, 14, 30, 60].map(d => (
              <button
                key={d}
                onClick={() => setDays(d)}
                className={`px-2 py-1 rounded text-xs ${days === d ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              >
                {d}d
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="container py-8 max-w-4xl">
        <p className="text-sm text-muted-foreground mb-6">
          Document views by day of week and hour (UTC). Darker cells indicate higher reading activity.
        </p>

        {/* Heatmap grid */}
        <div className="overflow-x-auto">
          <div className="min-w-[600px]">
            {/* Hour labels */}
            <div className="flex items-center mb-1 pl-12">
              {HOURS.filter((_, i) => i % 3 === 0).map(h => (
                <span key={h} className="text-[10px] text-muted-foreground" style={{ width: `${100 / 8}%` }}>
                  {h.toString().padStart(2, '0')}:00
                </span>
              ))}
            </div>

            {/* Grid rows */}
            {DAYS.map((day, dayIdx) => (
              <div key={day} className="flex items-center gap-1 mb-1">
                <span className="text-xs text-muted-foreground w-10 text-right shrink-0">{day}</span>
                <div className="flex-1 flex gap-[2px]">
                  {HOURS.map(hour => (
                    <div
                      key={hour}
                      className={`flex-1 h-6 rounded-sm ${getColor(grid[dayIdx][hour])} transition-colors`}
                      title={`${day} ${hour}:00 - ${grid[dayIdx][hour]} views`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 mt-6 justify-center">
          <span className="text-xs text-muted-foreground">Less</span>
          <div className="flex gap-1">
            <div className="w-4 h-4 rounded-sm bg-muted/30" />
            <div className="w-4 h-4 rounded-sm bg-accent/20" />
            <div className="w-4 h-4 rounded-sm bg-accent/40" />
            <div className="w-4 h-4 rounded-sm bg-accent/70" />
            <div className="w-4 h-4 rounded-sm bg-accent" />
          </div>
          <span className="text-xs text-muted-foreground">More</span>
        </div>

        {/* Summary stats */}
        {heatmapData && heatmapData.length > 0 && (
          <div className="mt-8 grid grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-border/50 text-center">
              <p className="text-2xl font-bold text-foreground">{heatmapData.reduce((sum: number, e: any) => sum + e.count, 0)}</p>
              <p className="text-xs text-muted-foreground mt-1">Total Views ({days}d)</p>
            </div>
            <div className="p-4 rounded-xl border border-border/50 text-center">
              <p className="text-2xl font-bold text-foreground">{maxCount}</p>
              <p className="text-xs text-muted-foreground mt-1">Peak Hour Views</p>
            </div>
            <div className="p-4 rounded-xl border border-border/50 text-center">
              <p className="text-2xl font-bold text-foreground">
                {(() => {
                  let peakHour = 0, peakVal = 0;
                  for (let h = 0; h < 24; h++) {
                    const total = DAYS.reduce((sum, _, d) => sum + grid[d][h], 0);
                    if (total > peakVal) { peakVal = total; peakHour = h; }
                  }
                  return `${peakHour}:00`;
                })()}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Most Active Hour</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import { useMemo } from 'react';
import { Flame, Calendar } from 'lucide-react';

function getReadingHistory(): string[] {
  const raw = localStorage.getItem('reading_history_dates');
  return raw ? JSON.parse(raw) : [];
}

export function recordReadingDay() {
  const today = new Date().toISOString().split('T')[0];
  const history = getReadingHistory();
  if (!history.includes(today)) {
    history.push(today);
    // Keep last 365 days
    const trimmed = history.slice(-365);
    localStorage.setItem('reading_history_dates', JSON.stringify(trimmed));
  }
}

function calculateStreak(dates: string[]): { current: number; longest: number; thisWeek: number } {
  if (dates.length === 0) return { current: 0, longest: 0, thisWeek: 0 };

  const sorted = [...dates].sort().reverse();
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  // Current streak
  let current = 0;
  let checkDate = sorted[0] === today || sorted[0] === yesterday ? sorted[0] : null;
  if (checkDate) {
    for (let i = 0; i < sorted.length; i++) {
      const expected = new Date(Date.now() - (i + (sorted[0] === today ? 0 : 1)) * 86400000).toISOString().split('T')[0];
      if (sorted[i] === expected) {
        current++;
      } else {
        break;
      }
    }
  }

  // Longest streak
  let longest = 0;
  let tempStreak = 1;
  const asc = [...dates].sort();
  for (let i = 1; i < asc.length; i++) {
    const prev = new Date(asc[i - 1]);
    const curr = new Date(asc[i]);
    const diff = (curr.getTime() - prev.getTime()) / 86400000;
    if (diff === 1) {
      tempStreak++;
    } else if (diff > 1) {
      longest = Math.max(longest, tempStreak);
      tempStreak = 1;
    }
  }
  longest = Math.max(longest, tempStreak);

  // This week
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  weekStart.setHours(0, 0, 0, 0);
  const thisWeek = dates.filter(d => new Date(d) >= weekStart).length;

  return { current, longest, thisWeek };
}

export default function ReadingStreak() {
  const stats = useMemo(() => {
    const history = getReadingHistory();
    return calculateStreak(history);
  }, []);

  if (stats.current === 0 && stats.longest === 0) return null;

  return (
    <div className="flex items-center gap-4 p-3 rounded-lg bg-gradient-to-r from-orange-500/10 to-yellow-500/10 border border-orange-500/20">
      <div className="flex items-center gap-1.5">
        <Flame className="w-5 h-5 text-orange-500" />
        <div>
          <p className="text-sm font-bold text-foreground">{stats.current} day streak</p>
          <p className="text-[10px] text-muted-foreground">Best: {stats.longest} days</p>
        </div>
      </div>
      <div className="flex items-center gap-1.5 ml-auto">
        <Calendar className="w-4 h-4 text-muted-foreground" />
        <span className="text-xs text-muted-foreground">{stats.thisWeek}/7 this week</span>
      </div>
    </div>
  );
}

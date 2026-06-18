import { useState, useEffect } from 'react';
import { trpc } from '@/lib/trpc';
import { X, Info, AlertTriangle, CheckCircle } from 'lucide-react';

const typeIcons = {
  info: Info,
  warning: AlertTriangle,
  success: CheckCircle,
};

const typeStyles = {
  info: 'bg-blue-500/10 border-blue-500/30 text-blue-300',
  warning: 'bg-amber-500/10 border-amber-500/30 text-amber-300',
  success: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300',
};

export default function AnnouncementBanner() {
  const [dismissed, setDismissed] = useState<Set<number>>(new Set());

  // Load dismissed IDs from sessionStorage
  useEffect(() => {
    const stored = sessionStorage.getItem('dismissed_announcements');
    if (stored) {
      try {
        setDismissed(new Set(JSON.parse(stored)));
      } catch {}
    }
  }, []);

  const { data: announcements } = trpc.announcements.active.useQuery();

  if (!announcements || announcements.length === 0) return null;

  const visible = announcements.filter((a: any) => !dismissed.has(a.id));
  if (visible.length === 0) return null;

  const dismiss = (id: number) => {
    const next = new Set(dismissed);
    next.add(id);
    setDismissed(next);
    sessionStorage.setItem('dismissed_announcements', JSON.stringify(Array.from(next)));
  };

  return (
    <div className="space-y-0">
      {visible.map((ann: any) => {
        const Icon = typeIcons[ann.type as keyof typeof typeIcons] || Info;
        const style = typeStyles[ann.type as keyof typeof typeStyles] || typeStyles.info;
        return (
          <div key={ann.id} className={`border-b ${style} px-4 py-2.5 flex items-center gap-3`}>
            <Icon className="w-4 h-4 flex-shrink-0" />
            <p className="flex-1 text-sm">{ann.message}</p>
            <button
              onClick={() => dismiss(ann.id)}
              className="p-1 rounded hover:bg-white/10 transition-colors"
              aria-label="Dismiss announcement"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

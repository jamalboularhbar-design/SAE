import { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'wouter';
import { trpc } from '@/lib/trpc';
import { Clock, FileText, X } from 'lucide-react';

interface RecentItem {
  slug: string;
  title: string;
  viewedAt: number;
}

function getVisitorId(): string {
  let id = localStorage.getItem('arg-visitor-id');
  if (!id) {
    id = 'v_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem('arg-visitor-id', id);
  }
  return id;
}

function getLocalRecentlyViewed(): RecentItem[] {
  try {
    return JSON.parse(localStorage.getItem('arg-recently-viewed') || '[]');
  } catch { return []; }
}

function clearLocalRecentlyViewed() {
  localStorage.removeItem('arg-recently-viewed');
}

function formatTimeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

// Helper to track a view server-side
export function useTrackRecentView(documentSlug: string | undefined, visitorId: string | undefined) {
  const trackMutation = trpc.recentlyViewed.track.useMutation();
  
  useEffect(() => {
    if (documentSlug && visitorId) {
      trackMutation.mutate({ visitorId, documentSlug });
    }
  }, [documentSlug, visitorId]);
}

export default function RecentlyViewed() {
  const [, navigate] = useLocation();
  const visitorId = useMemo(() => getVisitorId(), []);
  
  // Fetch server-side recently viewed
  const { data: serverRecent } = trpc.recentlyViewed.list.useQuery(
    { visitorId, limit: 5 },
    { staleTime: 30000 }
  );
  
  const [localItems, setLocalItems] = useState<RecentItem[]>([]);

  useEffect(() => {
    setLocalItems(getLocalRecentlyViewed());
  }, []);

  // Merge server data with local fallback, preferring server
  const items: RecentItem[] = useMemo(() => {
    if (serverRecent && serverRecent.length > 0) {
      return serverRecent.map((item: any) => ({
        slug: item.documentSlug,
        title: item.document?.title || item.documentSlug,
        viewedAt: new Date(item.viewedAt).getTime(),
      }));
    }
    return localItems;
  }, [serverRecent, localItems]);

  if (items.length === 0) return null;

  return (
    <section className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-border/30">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-accent" />
          <h3 className="text-sm font-semibold text-foreground">Recently Viewed</h3>
        </div>
        <button
          onClick={() => { clearLocalRecentlyViewed(); setLocalItems([]); }}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
        >
          <X className="w-3 h-3" />
          Clear
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        {items.slice(0, 5).map(item => (
          <button
            key={item.slug}
            onClick={() => navigate(`/docs/${item.slug}`)}
            className="flex items-center gap-2.5 p-2.5 rounded-lg bg-card/20 border border-border/30 hover:border-accent/30 transition-colors text-left group"
          >
            <FileText className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0 group-hover:text-accent transition-colors" />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-foreground truncate group-hover:text-accent transition-colors">{item.title}</p>
              <p className="text-[10px] text-muted-foreground">{formatTimeAgo(item.viewedAt)}</p>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

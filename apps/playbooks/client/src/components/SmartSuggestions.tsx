import { useMemo } from 'react';
import { useLocation } from 'wouter';
import { trpc } from '@/lib/trpc';
import { Sparkles, ArrowRight } from 'lucide-react';

function getRecentlyViewed(): Array<{ slug: string; title: string; category: string }> {
  const raw = localStorage.getItem('recently_viewed');
  return raw ? JSON.parse(raw) : [];
}

export default function SmartSuggestions() {
  const [, navigate] = useLocation();

  // Determine the user's most-read categories
  const topCategories = useMemo(() => {
    const recent = getRecentlyViewed();
    const catCount: Record<string, number> = {};
    recent.forEach(doc => {
      catCount[doc.category] = (catCount[doc.category] || 0) + 1;
    });
    return Object.entries(catCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2)
      .map(([cat]) => cat);
  }, []);

  const topCategory = topCategories[0];

  const { data: suggestions } = trpc.documents.list.useQuery(
    { category: topCategory, limit: 5, sort: 'newest' },
    { enabled: !!topCategory }
  );

  const recentSlugs = useMemo(() => {
    return new Set(getRecentlyViewed().map(d => d.slug));
  }, []);

  const unreadSuggestions = suggestions?.documents?.filter((d: any) => !recentSlugs.has(d.slug)).slice(0, 3);

  if (!topCategory || !unreadSuggestions || unreadSuggestions.length === 0) return null;

  return (
    <div className="p-4 rounded-lg bg-gradient-to-r from-purple-500/5 to-blue-500/5 border border-purple-500/20">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-4 h-4 text-purple-400" />
        <h3 className="text-sm font-semibold text-foreground">Suggested for You</h3>
        <span className="text-xs text-muted-foreground ml-auto">Based on your reading in {topCategory}</span>
      </div>
      <div className="space-y-2">
        {unreadSuggestions.map(doc => (
          <button
            key={doc.slug}
            onClick={() => navigate(`/docs/${doc.slug}`)}
            className="w-full text-left flex items-center gap-2 p-2 rounded-md hover:bg-card/30 transition-colors group"
          >
            <span className="text-sm text-foreground group-hover:text-accent transition-colors truncate flex-1">
              {doc.title}
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-accent transition-colors flex-shrink-0" />
          </button>
        ))}
      </div>
    </div>
  );
}

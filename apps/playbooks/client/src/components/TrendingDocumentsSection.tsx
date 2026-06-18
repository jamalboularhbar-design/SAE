import { Link } from 'wouter';
import { trpc } from '@/lib/trpc';
import { TrendingUp, Flame, Eye, ThumbsUp, Loader2 } from 'lucide-react';

export default function TrendingDocumentsSection() {
  const { data, isLoading } = trpc.batch21.trending.useQuery({ limit: 8 });

  if (isLoading) {
    return (
      <div className="py-8">
        <div className="flex items-center gap-2 mb-4">
          <Flame className="w-5 h-5 text-[#d4af37]" />
          <h2 className="text-lg font-bold text-foreground">Trending Now</h2>
        </div>
        <div className="flex justify-center py-6"><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /></div>
      </div>
    );
  }

  const docs = Array.isArray(data) ? data : [];
  if (docs.length === 0) return null;

  return (
    <div className="py-8">
      <div className="flex items-center gap-2 mb-4">
        <Flame className="w-5 h-5 text-[#d4af37]" />
        <h2 className="text-lg font-bold text-foreground">Trending Now</h2>
        <span className="text-xs text-muted-foreground ml-1">Weighted by recent activity</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {docs.map((doc: any, i: number) => (
          <Link key={doc.slug || i} href={`/docs/${doc.slug}`}
            className="group bg-card/60 border border-border/50 rounded-lg p-3 hover:border-[#d4af37]/30 transition-colors">
            <div className="flex items-start gap-2">
              <span className="text-xs font-bold text-[#d4af37]/60 mt-0.5">#{i + 1}</span>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-foreground group-hover:text-[#d4af37] truncate">{doc.title}</div>
                <div className="text-[10px] text-muted-foreground mt-0.5">{doc.category}</div>
                <div className="flex items-center gap-3 mt-2 text-[10px] text-muted-foreground">
                  <span className="flex items-center gap-0.5"><Eye className="w-3 h-3" />{doc.viewCount || 0}</span>
                  <span className="flex items-center gap-0.5"><ThumbsUp className="w-3 h-3" />{doc.upvotes || 0}</span>
                  <span className="flex items-center gap-0.5"><TrendingUp className="w-3 h-3" />{Number(doc.trendingScore || 0).toFixed(0)}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

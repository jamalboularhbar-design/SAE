import { useLocation } from 'wouter';
import { trpc } from '@/lib/trpc';
import { TrendingUp, Eye, ThumbsUp, FileText } from 'lucide-react';

export default function PopularDocuments() {
  const [, navigate] = useLocation();
  const { data, isLoading } = trpc.documents.popular.useQuery({ limit: 5 });

  if (isLoading || !data || data.length === 0) return null;

  // Only show if there are documents with views
  const hasViews = data.some(d => (d.viewCount ?? 0) > 0);
  if (!hasViews) return null;

  return (
    <section className="mt-8 sm:mt-12">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-accent" />
        <h2 className="text-lg font-bold text-foreground">Trending Documents</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {data.map((doc, i) => (
          <button
            key={doc.slug}
            onClick={() => navigate(`/docs/${doc.slug}`)}
            className="p-3 rounded-lg border border-border/50 bg-card/30 hover:border-accent/30 transition-all text-left group"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold text-accent/60">#{i + 1}</span>
              <FileText className="w-3.5 h-3.5 text-muted-foreground group-hover:text-accent transition-colors" />
            </div>
            <p className="text-xs font-medium text-foreground line-clamp-2 group-hover:text-accent transition-colors mb-2">{doc.title}</p>
            <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                {doc.viewCount ?? 0}
              </span>
              <span className="flex items-center gap-1">
                <ThumbsUp className="w-3 h-3" />
                {doc.upvotes ?? 0}
              </span>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

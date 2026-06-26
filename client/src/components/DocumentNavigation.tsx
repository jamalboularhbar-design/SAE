import { useMemo } from 'react';
import { useLocation } from 'wouter';
import { trpc } from '@/lib/trpc';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface DocumentNavigationProps {
  slug: string;
  category: string;
}

export default function DocumentNavigation({ slug, category }: DocumentNavigationProps) {
  const [, navigate] = useLocation();
  const { data } = trpc.documents.list.useQuery({ limit: 200, category });

  const { prev, next } = useMemo(() => {
    if (!data?.documents) return { prev: null, next: null };
    const docs = data.documents;
    const currentIdx = docs.findIndex(d => d.slug === slug);
    if (currentIdx < 0) return { prev: null, next: null };
    return {
      prev: currentIdx > 0 ? docs[currentIdx - 1] : null,
      next: currentIdx < docs.length - 1 ? docs[currentIdx + 1] : null,
    };
  }, [data, slug]);

  if (!prev && !next) return null;

  return (
    <div className="flex items-center justify-between mt-8 pt-6 border-t border-border/50 no-print">
      {prev ? (
        <button
          onClick={() => navigate(`/docs/${prev.slug}`)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group max-w-[45%]"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform shrink-0" />
          <span className="truncate">{prev.title}</span>
        </button>
      ) : <div />}
      {next ? (
        <button
          onClick={() => navigate(`/docs/${next.slug}`)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group max-w-[45%] ml-auto"
        >
          <span className="truncate">{next.title}</span>
          <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform shrink-0" />
        </button>
      ) : <div />}
    </div>
  );
}

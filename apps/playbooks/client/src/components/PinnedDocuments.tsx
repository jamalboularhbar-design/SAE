import { trpc } from '@/lib/trpc';
import { Link } from 'wouter';
import { Badge } from '@/components/ui/badge';
import { Pin, Clock } from 'lucide-react';

export default function PinnedDocuments() {
  const { data: pinnedDocs } = trpc.documents.pinned.useQuery();

  if (!pinnedDocs || pinnedDocs.length === 0) return null;

  return (
    <section className="mt-8 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Pin className="w-4 h-4 text-amber-500" />
        <h3 className="text-sm font-semibold text-foreground">Pinned Documents</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {pinnedDocs.map((doc: any) => (
          <Link key={doc.slug} href={`/docs/${doc.slug}`}>
            <div className="p-3 rounded-lg border border-amber-500/30 bg-amber-500/5 hover:bg-amber-500/10 transition-colors cursor-pointer">
              <p className="text-sm font-medium text-foreground truncate">{doc.title}</p>
              <div className="flex items-center gap-2 mt-1.5">
                <Badge variant="outline" className="text-[10px]">{doc.category}</Badge>
                <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                  <Clock className="w-3 h-3" />
                  {Math.ceil((doc.wordCount || 0) / 200)} min
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

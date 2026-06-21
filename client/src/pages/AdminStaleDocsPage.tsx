import { useLocation } from 'wouter';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, AlertTriangle, Clock, ExternalLink } from 'lucide-react';
import { Link } from 'wouter';

export default function AdminStaleDocsPage() {
  const [, setLocation] = useLocation();
  const { user, loading: authLoading } = useAuth();

  const { data: staleDocs, isLoading } = trpc.documents.stale.useQuery(
    { limit: 50 },
    { enabled: !!user }
  );

  if (authLoading) {
    return <div className="min-h-screen bg-background flex items-center justify-center"><div className="animate-spin w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full" /></div>;
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">
        <p>Admin access required.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => setLocation('/')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <AlertTriangle className="w-5 h-5 text-amber-500" />
          <h1 className="text-lg font-semibold">Documents Due for Review</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <p className="text-sm text-muted-foreground mb-4">
          Documents with a review date that has passed. These may need updating.
        </p>

        {isLoading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => <div key={i} className="animate-pulse h-16 bg-muted/30 rounded-lg" />)}
          </div>
        ) : staleDocs && staleDocs.length > 0 ? (
          <div className="space-y-2">
            {staleDocs.map((doc: any) => {
              const daysOverdue = Math.floor((Date.now() - new Date(doc.reviewBy).getTime()) / (1000 * 60 * 60 * 24));
              return (
                <div key={doc.slug} className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/20 transition-colors">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-red-500/20 text-red-400">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-medium truncate block">{doc.title}</span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Badge variant="outline" className="text-xs">{doc.category}</Badge>
                      <span className="text-xs text-red-400">{daysOverdue} days overdue</span>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    Due: {new Date(doc.reviewBy).toLocaleDateString()}
                  </span>
                  <Link href={`/docs/${doc.slug}`}>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <AlertTriangle className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p>No documents are currently overdue for review.</p>
            <p className="text-sm mt-1">Set review dates in the document editor to track content freshness.</p>
          </div>
        )}
      </div>
    </div>
  );
}

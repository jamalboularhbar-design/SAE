import { trpc } from '@/lib/trpc';
import { Clock, BookOpen, ArrowRight } from 'lucide-react';
import { Link } from 'wouter';

function getVisitorId() {
  let id = localStorage.getItem('visitor_id');
  if (!id) {
    id = 'v_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem('visitor_id', id);
  }
  return id;
}

export default function ReadingHistoryPage() {
  const visitorId = getVisitorId();
  const { data: history, isLoading } = trpc.readingHistory.list.useQuery({ visitorId, limit: 50 });

  // Group by date
  const grouped = (history || []).reduce((acc: Record<string, typeof history>, item) => {
    const date = new Date(item.viewedAt).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    if (!acc[date]) acc[date] = [];
    acc[date]!.push(item);
    return acc;
  }, {} as Record<string, typeof history>);

  return (
    <div className="container max-w-3xl py-8">
      <div className="flex items-center gap-3 mb-6">
        <Clock className="w-6 h-6 text-primary" />
        <div>
          <h1 className="text-2xl font-bold">Reading History</h1>
          <p className="text-sm text-muted-foreground">Documents you've recently viewed</p>
        </div>
      </div>

      {isLoading && (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-16 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      )}

      {!isLoading && (!history || history.length === 0) && (
        <div className="text-center py-16 text-muted-foreground">
          <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">No reading history yet</p>
          <p className="text-sm mt-1">Documents you view will appear here.</p>
        </div>
      )}

      {Object.entries(grouped).map(([date, items]) => (
        <div key={date} className="mb-6">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">{date}</h2>
          <div className="space-y-1">
            {(items || []).map((item, idx) => (
              <Link key={idx} href={`/doc/${item.documentSlug}`}>
                <div className="flex items-center gap-3 px-4 py-3 rounded-lg border border-border hover:bg-muted/50 transition-colors cursor-pointer group">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.title}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                      <span>{item.category}</span>
                      <span>·</span>
                      <span>{Math.ceil((item.wordCount || 0) / 200)} min read</span>
                      <span>·</span>
                      <span>{new Date(item.viewedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

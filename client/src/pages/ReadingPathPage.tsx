import { trpc } from '@/lib/trpc';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'wouter';
import { Route, BookOpen, ArrowRight, Loader2 } from 'lucide-react';

export default function ReadingPathPage() {
  const { data: recommended, isLoading } = trpc.readingPath.recommended.useQuery();

  return (
    <div className="container max-w-4xl py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold flex items-center gap-2"><Route className="w-6 h-6 text-orange-400" /> Your Reading Path</h1>
        <p className="text-muted-foreground mt-1">Personalized recommendations based on your reading history</p>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      )}

      <div className="space-y-3">
        {(recommended || []).map((doc: any, index: number) => (
          <Link key={doc.slug || index} href={`/docs/${doc.slug}`}>
            <Card className="hover:border-orange-400/50 transition-all cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-400 font-bold text-sm shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-muted-foreground shrink-0" />
                      <span className="font-medium truncate">{doc.title}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">{doc.category}</Badge>
                      {doc.viewCount !== undefined && <span className="text-xs text-muted-foreground">{doc.viewCount} views</span>}
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
        {!isLoading && (!recommended || recommended.length === 0) && (
          <Card><CardContent className="p-8 text-center text-muted-foreground">Start reading documents to get personalized recommendations!</CardContent></Card>
        )}
      </div>
    </div>
  );
}

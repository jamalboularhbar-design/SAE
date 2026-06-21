import { trpc } from '@/lib/trpc';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, FileText } from 'lucide-react';
import { Link } from 'wouter';

interface AISuggestionsProps {
  slug: string;
}

export default function AISuggestions({ slug }: AISuggestionsProps) {
  const { data: suggestedSlugs, isLoading } = trpc.aiSuggestions.related.useQuery(
    { slug },
    { staleTime: 60000 * 5 } // Cache for 5 minutes
  );

  if (isLoading) {
    return (
      <Card className="card-premium">
        <CardContent className="py-6">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Sparkles className="w-4 h-4 animate-pulse" />
            <span className="text-sm">Finding related documents...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!suggestedSlugs || suggestedSlugs.length === 0) return null;

  return (
    <Card className="card-premium">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Sparkles className="w-4 h-4 text-accent" />
          AI-Suggested Related Docs
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {suggestedSlugs.map((s: string) => (
            <Link key={s} href={`/documents/${s}`}>
              <div className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted/50 transition-colors cursor-pointer">
                <FileText className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-foreground truncate">{s.replace(/-/g, ' ')}</span>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

import { trpc } from '@/lib/trpc';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles } from 'lucide-react';
import { Link } from 'wouter';

interface Props {
  documentId: number;
}

export default function SmartRecommendations({ documentId }: Props) {
  const { data: recommendations } = trpc.recommendations.get.useQuery({ documentId, limit: 5 });

  if (!recommendations || recommendations.length === 0) return null;

  return (
    <Card className="bg-card/80 border-border/50 mt-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-yellow-400" />
          Readers Also Viewed
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-1.5">
          {recommendations.map((rec: any) => (
            <Link key={rec.id} href={`/docs/${rec.slug}`}>
              <div className="flex items-center justify-between py-1.5 px-2 rounded hover:bg-accent/20 transition-colors cursor-pointer text-sm">
                <span className="truncate flex-1">{rec.title}</span>
                <div className="flex items-center gap-2 ml-2">
                  <Badge variant="outline" className="text-xs">{rec.category}</Badge>
                  <span className="text-xs text-muted-foreground">{rec.score} readers</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

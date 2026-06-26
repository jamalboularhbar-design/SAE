import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { SmilePlus, Frown, Meh, BarChart3, RefreshCw } from 'lucide-react';

export default function AdminSentimentDashboardPage() {
  const { data: scores, refetch } = trpc.sentiment.dashboard.useQuery();
  const analyzeMut = trpc.sentiment.analyze.useMutation({ onSuccess: () => { refetch(); toast.success('Sentiment analyzed'); } });

  const getSentimentIcon = (score: number) => {
    if (score > 0.2) return <SmilePlus className="w-5 h-5 text-green-400" />;
    if (score < -0.2) return <Frown className="w-5 h-5 text-red-400" />;
    return <Meh className="w-5 h-5 text-yellow-400" />;
  };

  const getSentimentLabel = (score: number) => {
    if (score > 0.5) return { text: 'Very Positive', color: 'bg-green-600' };
    if (score > 0.2) return { text: 'Positive', color: 'bg-green-500' };
    if (score > -0.2) return { text: 'Neutral', color: 'bg-yellow-600' };
    if (score > -0.5) return { text: 'Negative', color: 'bg-red-500' };
    return { text: 'Very Negative', color: 'bg-red-600' };
  };

  const avgScore = scores && scores.length > 0
    ? scores.reduce((sum: number, s: any) => sum + (s.overallScore || 0), 0) / scores.length
    : 0;

  return (
    <div className="container max-w-6xl py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><BarChart3 className="w-6 h-6 text-orange-400" /> Sentiment Dashboard</h1>
          <p className="text-muted-foreground mt-1">AI-powered sentiment scoring of document feedback</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">Documents Analyzed</p>
            <p className="text-3xl font-bold mt-1">{(scores || []).length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">Average Sentiment</p>
            <p className="text-3xl font-bold mt-1">{avgScore.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">Positive Docs</p>
            <p className="text-3xl font-bold text-green-400 mt-1">{(scores || []).filter((s: any) => s.overallScore > 0.2).length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">Negative Docs</p>
            <p className="text-3xl font-bold text-red-400 mt-1">{(scores || []).filter((s: any) => s.overallScore < -0.2).length}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Document Sentiment Scores</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-2">
            {(scores || []).map((s: any) => {
              const label = getSentimentLabel(s.overallScore);
              return (
                <div key={s.id} className="flex items-center justify-between p-3 rounded bg-muted/20">
                  <div className="flex items-center gap-3">
                    {getSentimentIcon(s.overallScore)}
                    <div>
                      <span className="font-medium">{s.documentSlug}</span>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Badge className={label.color}>{label.text}</Badge>
                        <span className="text-xs text-muted-foreground">Score: {s.overallScore?.toFixed(2)}</span>
                        <span className="text-xs text-muted-foreground">+{s.positiveCount} / -{s.negativeCount} / ~{s.neutralCount}</span>
                      </div>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost" onClick={() => analyzeMut.mutate({ documentSlug: s.documentSlug })}>
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                </div>
              );
            })}
            {(!scores || scores.length === 0) && (
              <p className="text-muted-foreground text-center py-8">No sentiment data yet. Analyze documents to populate.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

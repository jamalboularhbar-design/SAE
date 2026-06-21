import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { BarChart3, Sparkles, Loader2, Plus, Trash2, SmilePlus, Frown, Meh } from 'lucide-react';

export default function AISentimentPage() {
  const [texts, setTexts] = useState<string[]>(['']);
  const [result, setResult] = useState<{
    results: { text: string; sentiment: string; confidence: number; keywords: string[] }[];
    overall: { positive: number; negative: number; neutral: number; averageConfidence: number };
  } | null>(null);

  const analyze = trpc.ai.analyzeSentiment.useMutation({
    onSuccess: (data) => { setResult(data); toast.success('Sentiment analyzed'); },
    onError: () => toast.error('Analysis failed'),
  });

  const handleAnalyze = () => {
    const validTexts = texts.filter(t => t.trim().length > 0);
    if (validTexts.length === 0) { toast.error('Add at least one text to analyze'); return; }
    analyze.mutate({ texts: validTexts });
  };

  const addText = () => setTexts([...texts, '']);
  const removeText = (i: number) => setTexts(texts.filter((_, idx) => idx !== i));
  const updateText = (i: number, val: string) => { const n = [...texts]; n[i] = val; setTexts(n); };

  const sentimentIcon = (s: string) => {
    if (s === 'positive') return <SmilePlus className="w-4 h-4 text-green-500" />;
    if (s === 'negative') return <Frown className="w-4 h-4 text-red-500" />;
    return <Meh className="w-4 h-4 text-muted-foreground" />;
  };

  const sentimentColor = (s: string) => {
    if (s === 'positive') return 'border-green-500/30 bg-green-500/5';
    if (s === 'negative') return 'border-red-500/30 bg-red-500/5';
    if (s === 'mixed') return 'border-amber-500/30 bg-amber-500/5';
    return 'border-border';
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-8">
          <Badge className="mb-2 bg-orange-500/10 text-orange-600">AI Services</Badge>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-orange-500" /> Sentiment Analysis
          </h1>
          <p className="text-muted-foreground mt-1">Analyze feedback, comments, or support tickets for sentiment trends</p>
        </div>

        {/* Input */}
        <Card className="mb-6">
          <CardContent className="pt-5 space-y-3">
            {texts.map((t, i) => (
              <div key={i} className="flex gap-2">
                <textarea
                  value={t}
                  onChange={e => updateText(i, e.target.value)}
                  placeholder={`Text ${i + 1}: e.g. customer feedback, review, comment...`}
                  className="flex-1 px-3 py-2 rounded-lg bg-muted/30 border border-border text-sm resize-none h-16 focus:outline-none focus:ring-2 focus:ring-orange-500/30"
                />
                {texts.length > 1 && (
                  <Button variant="ghost" size="sm" onClick={() => removeText(i)} className="self-start mt-1">
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </Button>
                )}
              </div>
            ))}
            <div className="flex items-center justify-between pt-2">
              <Button variant="outline" size="sm" onClick={addText} disabled={texts.length >= 20}>
                <Plus className="w-3 h-3 mr-1" /> Add Text
              </Button>
              <Button onClick={handleAnalyze} disabled={analyze.isPending} className="bg-orange-600 hover:bg-orange-700">
                {analyze.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
                Analyze Sentiment
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {result && (
          <div className="space-y-4">
            {/* Overall */}
            <div className="grid grid-cols-4 gap-3">
              <Card className="bg-green-500/5 border-green-500/20">
                <CardContent className="py-3 text-center">
                  <div className="text-2xl font-bold text-green-500">{result.overall.positive}</div>
                  <p className="text-xs text-muted-foreground">Positive</p>
                </CardContent>
              </Card>
              <Card className="bg-red-500/5 border-red-500/20">
                <CardContent className="py-3 text-center">
                  <div className="text-2xl font-bold text-red-500">{result.overall.negative}</div>
                  <p className="text-xs text-muted-foreground">Negative</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="py-3 text-center">
                  <div className="text-2xl font-bold text-muted-foreground">{result.overall.neutral}</div>
                  <p className="text-xs text-muted-foreground">Neutral</p>
                </CardContent>
              </Card>
              <Card className="border-orange-500/20">
                <CardContent className="py-3 text-center">
                  <div className="text-2xl font-bold text-orange-500">{result.overall.averageConfidence}%</div>
                  <p className="text-xs text-muted-foreground">Avg Confidence</p>
                </CardContent>
              </Card>
            </div>

            {/* Individual Results */}
            <Card>
              <CardHeader><CardTitle className="text-base">Individual Analysis</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {result.results.map((r, i) => (
                  <div key={i} className={`p-3 rounded-lg border ${sentimentColor(r.sentiment)}`}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        {sentimentIcon(r.sentiment)}
                        <Badge variant="outline" className="text-xs capitalize">{r.sentiment}</Badge>
                        <span className="text-xs text-muted-foreground">{r.confidence}% confidence</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{r.text}</p>
                    {r.keywords.length > 0 && (
                      <div className="flex gap-1 mt-2 flex-wrap">
                        {r.keywords.map((k, j) => <Badge key={j} variant="outline" className="text-[10px]">{k}</Badge>)}
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

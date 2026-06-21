import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { TrendingUp, Sparkles, Loader2, Target, ArrowUp, ArrowDown, Minus } from 'lucide-react';

export default function AILeadScoringPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [source, setSource] = useState('Direct');
  const [interactions, setInteractions] = useState(0);
  const [result, setResult] = useState<{ score: number; probability: string; factors: { name: string; impact: string }[]; recommendation: string } | null>(null);

  const predict = trpc.ai.predictLeadScore.useMutation({
    onSuccess: (data) => { setResult(data); toast.success('Lead scored'); },
    onError: () => toast.error('Scoring failed'),
  });

  const handleScore = () => {
    if (!name || !email) { toast.error('Name and email are required'); return; }
    predict.mutate({ leadData: { name, email, company, source, interactions } });
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-500';
    if (score >= 40) return 'text-amber-500';
    return 'text-red-500';
  };

  const getImpactIcon = (impact: string) => {
    if (impact === 'positive') return <ArrowUp className="w-3 h-3 text-green-500" />;
    if (impact === 'negative') return <ArrowDown className="w-3 h-3 text-red-500" />;
    return <Minus className="w-3 h-3 text-muted-foreground" />;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-8">
          <Badge className="mb-2 bg-emerald-500/10 text-emerald-600">AI Services</Badge>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Target className="w-6 h-6 text-emerald-500" /> Predictive Lead Scoring
          </h1>
          <p className="text-muted-foreground mt-1">AI-powered conversion probability prediction with explainable scoring factors</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Input Form */}
          <Card>
            <CardHeader><CardTitle className="text-base">Lead Information</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-xs font-medium block mb-1">Name *</label>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="John Smith" className="w-full px-3 py-2 rounded-md bg-muted/30 border border-border text-sm" />
              </div>
              <div>
                <label className="text-xs font-medium block mb-1">Email *</label>
                <input value={email} onChange={e => setEmail(e.target.value)} placeholder="john@company.com" className="w-full px-3 py-2 rounded-md bg-muted/30 border border-border text-sm" />
              </div>
              <div>
                <label className="text-xs font-medium block mb-1">Company</label>
                <input value={company} onChange={e => setCompany(e.target.value)} placeholder="Acme Corp" className="w-full px-3 py-2 rounded-md bg-muted/30 border border-border text-sm" />
              </div>
              <div>
                <label className="text-xs font-medium block mb-1">Source</label>
                <select value={source} onChange={e => setSource(e.target.value)} className="w-full px-3 py-2 rounded-md bg-background border border-border text-sm">
                  {['Direct', 'Referral', 'Organic', 'Paid Ad', 'Social Media', 'Event', 'Cold Outreach'].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium block mb-1">Interactions</label>
                <input type="number" value={interactions} onChange={e => setInteractions(Number(e.target.value))} min={0} className="w-full px-3 py-2 rounded-md bg-muted/30 border border-border text-sm" />
              </div>
              <Button onClick={handleScore} disabled={predict.isPending} className="w-full bg-emerald-600 hover:bg-emerald-700 mt-2">
                {predict.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <TrendingUp className="w-4 h-4 mr-2" />}
                Score Lead
              </Button>
            </CardContent>
          </Card>

          {/* Results */}
          <div className="space-y-4">
            {result && (
              <>
                <Card className="border-emerald-500/30">
                  <CardContent className="pt-5 text-center">
                    <div className={`text-5xl font-bold ${getScoreColor(result.score)}`}>{result.score}</div>
                    <p className="text-sm text-muted-foreground mt-1">Conversion Probability: {result.probability}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader><CardTitle className="text-sm">Scoring Factors</CardTitle></CardHeader>
                  <CardContent className="space-y-2">
                    {result.factors.map((f, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        {getImpactIcon(f.impact)}
                        <span>{f.name}</span>
                        <Badge variant="outline" className="ml-auto text-xs">{f.impact}</Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="bg-emerald-500/5 border-emerald-500/20">
                  <CardContent className="py-4">
                    <div className="flex items-start gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-500 mt-0.5" />
                      <div>
                        <p className="text-xs font-medium text-emerald-600">AI Recommendation</p>
                        <p className="text-sm mt-1">{result.recommendation}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {!result && (
              <Card className="border-dashed h-full flex items-center justify-center">
                <CardContent className="py-12 text-center">
                  <Target className="w-10 h-10 mx-auto text-muted-foreground/50 mb-3" />
                  <p className="text-sm text-muted-foreground">Enter lead data and click Score to get AI predictions</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

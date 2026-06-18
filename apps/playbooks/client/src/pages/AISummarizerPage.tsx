import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { FileText, Sparkles, Copy, ListChecks, AlignLeft, CheckSquare, Loader2 } from 'lucide-react';

type SummaryFormat = 'executive' | 'bullets' | 'actions';

export default function AISummarizerPage() {
  const [text, setText] = useState('');
  const [format, setFormat] = useState<SummaryFormat>('executive');
  const [result, setResult] = useState('');

  const summarize = trpc.ai.summarize.useMutation({
    onSuccess: (data) => {
      setResult(data.summary);
      toast.success('Summary generated');
    },
    onError: () => toast.error('Failed to generate summary'),
  });

  const handleSummarize = () => {
    if (text.trim().length < 10) { toast.error('Please enter at least 10 characters'); return; }
    summarize.mutate({ text, format });
  };

  const copyResult = () => {
    navigator.clipboard.writeText(result);
    toast.success('Copied to clipboard');
  };

  const formats: { key: SummaryFormat; label: string; icon: React.ReactNode; desc: string }[] = [
    { key: 'executive', label: 'Executive Summary', icon: <AlignLeft className="w-4 h-4" />, desc: '3-4 sentence overview' },
    { key: 'bullets', label: 'Key Points', icon: <ListChecks className="w-4 h-4" />, desc: '5-7 bullet points' },
    { key: 'actions', label: 'Action Items', icon: <CheckSquare className="w-4 h-4" />, desc: 'Tasks & deadlines' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-8">
          <Badge className="mb-2 bg-violet-500/10 text-violet-500">AI Services</Badge>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-violet-500" /> Document Summarizer
          </h1>
          <p className="text-muted-foreground mt-1">Paste any document and get an instant AI-powered summary</p>
        </div>

        {/* Format Selection */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {formats.map(f => (
            <button
              key={f.key}
              onClick={() => setFormat(f.key)}
              className={`p-3 rounded-lg border text-left transition-all ${
                format === f.key ? 'border-violet-500 bg-violet-500/5' : 'border-border hover:border-violet-500/30'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                {f.icon}
                <span className="text-sm font-medium">{f.label}</span>
              </div>
              <p className="text-xs text-muted-foreground">{f.desc}</p>
            </button>
          ))}
        </div>

        {/* Input */}
        <Card className="mb-6">
          <CardContent className="pt-5">
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Paste your document text here... (meeting notes, reports, emails, articles)"
              className="w-full h-48 px-4 py-3 rounded-lg bg-muted/30 border border-border text-sm resize-none focus:outline-none focus:ring-2 focus:ring-violet-500/30"
            />
            <div className="flex items-center justify-between mt-3">
              <span className="text-xs text-muted-foreground">{text.length.toLocaleString()} characters</span>
              <Button onClick={handleSummarize} disabled={summarize.isPending || text.length < 10} className="bg-violet-600 hover:bg-violet-700">
                {summarize.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
                Summarize
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Result */}
        {result && (
          <Card className="border-violet-500/30">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="w-4 h-4 text-violet-500" /> AI Summary
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={copyResult}>
                  <Copy className="w-4 h-4 mr-1" /> Copy
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
                {result}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { PenTool, Sparkles, Copy, RefreshCw, Loader2, Languages, Minimize2, Maximize2, FileEdit } from 'lucide-react';

type WriteMode = 'draft' | 'rewrite' | 'expand' | 'translate' | 'simplify';

export default function AIWriterPage() {
  const [prompt, setPrompt] = useState('');
  const [context, setContext] = useState('');
  const [mode, setMode] = useState<WriteMode>('draft');
  const [targetLanguage, setTargetLanguage] = useState('French');
  const [result, setResult] = useState('');

  const write = trpc.ai.write.useMutation({
    onSuccess: (data) => { setResult(data.content); toast.success('Content generated'); },
    onError: () => toast.error('Failed to generate content'),
  });

  const handleGenerate = () => {
    if (prompt.trim().length < 5) { toast.error('Please enter a prompt'); return; }
    write.mutate({ prompt, mode, context: context || undefined, targetLanguage: mode === 'translate' ? targetLanguage : undefined });
  };

  const modes: { key: WriteMode; label: string; icon: React.ReactNode; desc: string }[] = [
    { key: 'draft', label: 'Draft', icon: <PenTool className="w-4 h-4" />, desc: 'Generate from scratch' },
    { key: 'rewrite', label: 'Rewrite', icon: <RefreshCw className="w-4 h-4" />, desc: 'Improve existing text' },
    { key: 'expand', label: 'Expand', icon: <Maximize2 className="w-4 h-4" />, desc: 'Elaborate on outline' },
    { key: 'translate', label: 'Translate', icon: <Languages className="w-4 h-4" />, desc: 'Convert to language' },
    { key: 'simplify', label: 'Simplify', icon: <Minimize2 className="w-4 h-4" />, desc: 'Make it simpler' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-8">
          <Badge className="mb-2 bg-violet-500/10 text-violet-500">AI Services</Badge>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FileEdit className="w-6 h-6 text-violet-500" /> AI Writing Assistant
          </h1>
          <p className="text-muted-foreground mt-1">Generate, rewrite, expand, translate, or simplify content with AI</p>
        </div>

        {/* Mode Selection */}
        <div className="grid grid-cols-5 gap-2 mb-6">
          {modes.map(m => (
            <button
              key={m.key}
              onClick={() => setMode(m.key)}
              className={`p-3 rounded-lg border text-center transition-all ${
                mode === m.key ? 'border-violet-500 bg-violet-500/5' : 'border-border hover:border-violet-500/30'
              }`}
            >
              <div className="flex justify-center mb-1">{m.icon}</div>
              <p className="text-xs font-medium">{m.label}</p>
            </button>
          ))}
        </div>

        {/* Inputs */}
        <Card className="mb-6">
          <CardContent className="pt-5 space-y-4">
            {(mode === 'rewrite' || mode === 'expand' || mode === 'simplify' || mode === 'translate') && (
              <div>
                <label className="text-sm font-medium block mb-1">Source Text</label>
                <textarea
                  value={context}
                  onChange={e => setContext(e.target.value)}
                  placeholder="Paste the text you want to transform..."
                  className="w-full h-32 px-4 py-3 rounded-lg bg-muted/30 border border-border text-sm resize-none focus:outline-none focus:ring-2 focus:ring-violet-500/30"
                />
              </div>
            )}
            {mode === 'translate' && (
              <div>
                <label className="text-sm font-medium block mb-1">Target Language</label>
                <select
                  value={targetLanguage}
                  onChange={e => setTargetLanguage(e.target.value)}
                  className="px-3 py-2 rounded-md bg-background border border-border text-sm"
                >
                  {['French', 'Spanish', 'Arabic', 'German', 'Japanese', 'Chinese', 'Portuguese', 'Italian', 'Korean', 'Hindi'].map(l => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>
            )}
            <div>
              <label className="text-sm font-medium block mb-1">
                {mode === 'draft' ? 'What would you like to write?' : 'Additional instructions (optional)'}
              </label>
              <textarea
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                placeholder={mode === 'draft' ? 'Describe what you want to write...' : 'Any specific instructions for the transformation...'}
                className="w-full h-24 px-4 py-3 rounded-lg bg-muted/30 border border-border text-sm resize-none focus:outline-none focus:ring-2 focus:ring-violet-500/30"
              />
            </div>
            <div className="flex justify-end">
              <Button onClick={handleGenerate} disabled={write.isPending} className="bg-violet-600 hover:bg-violet-700">
                {write.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
                Generate
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
                  <Sparkles className="w-4 h-4 text-violet-500" /> Generated Content
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={() => { navigator.clipboard.writeText(result); toast.success('Copied'); }}>
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

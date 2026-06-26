import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Tags, Sparkles, Loader2, FolderOpen } from 'lucide-react';

export default function AIAutoTagPage() {
  const [text, setText] = useState('');
  const [existingTags, setExistingTags] = useState('');
  const [result, setResult] = useState<{ tags: { name: string; confidence: number }[]; primaryCategory: string; suggestedTitle?: string } | null>(null);

  const autoTag = trpc.ai.autoTag.useMutation({
    onSuccess: (data) => { setResult(data); toast.success('Tags generated'); },
    onError: () => toast.error('Auto-tagging failed'),
  });

  const handleTag = () => {
    if (text.trim().length < 10) { toast.error('Enter at least 10 characters'); return; }
    const tags = existingTags ? existingTags.split(',').map(s => s.trim()).filter(Boolean) : undefined;
    autoTag.mutate({ text, existingTags: tags });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-8">
          <Badge className="mb-2 bg-pink-500/10 text-pink-600">AI Services</Badge>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Tags className="w-6 h-6 text-pink-500" /> Automated Content Tagging
          </h1>
          <p className="text-muted-foreground mt-1">AI analyzes your content and suggests relevant tags with confidence scores</p>
        </div>

        <Card className="mb-6">
          <CardContent className="pt-5 space-y-4">
            <div>
              <label className="text-sm font-medium block mb-1">Content to Analyze</label>
              <textarea
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="Paste document content here..."
                className="w-full h-40 px-4 py-3 rounded-lg bg-muted/30 border border-border text-sm resize-none focus:outline-none focus:ring-2 focus:ring-pink-500/30"
              />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">Existing Tags (optional, comma-separated)</label>
              <input
                value={existingTags}
                onChange={e => setExistingTags(e.target.value)}
                placeholder="e.g. travel, luxury, concierge, operations"
                className="w-full px-4 py-2 rounded-lg bg-muted/30 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/30"
              />
            </div>
            <div className="flex justify-end">
              <Button onClick={handleTag} disabled={autoTag.isPending} className="bg-pink-600 hover:bg-pink-700">
                {autoTag.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
                Auto-Tag
              </Button>
            </div>
          </CardContent>
        </Card>

        {result && (
          <div className="space-y-4">
            {/* Category & Title */}
            <Card className="border-pink-500/30">
              <CardContent className="py-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <FolderOpen className="w-4 h-4 text-pink-500" />
                    <span className="text-sm font-medium">Category:</span>
                    <Badge>{result.primaryCategory}</Badge>
                  </div>
                  {result.suggestedTitle && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">Suggested title:</span> <span className="font-medium">{result.suggestedTitle}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Tags */}
            <Card>
              <CardHeader><CardTitle className="text-base">Suggested Tags</CardTitle></CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {result.tags.map((tag, i) => (
                    <div key={i} className="flex items-center gap-1 px-3 py-1.5 rounded-full border bg-muted/30">
                      <span className="text-sm">{tag.name}</span>
                      <span className={`text-xs font-mono ${tag.confidence >= 70 ? 'text-green-500' : tag.confidence >= 40 ? 'text-amber-500' : 'text-muted-foreground'}`}>
                        {tag.confidence}%
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

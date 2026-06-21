import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Globe, ArrowLeft, Loader2, CheckCircle } from 'lucide-react';
import { useLocation } from 'wouter';

export default function AdminImportUrlPage() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [locale, setLocale] = useState('en');
  const [result, setResult] = useState<any>(null);

  const importMutation = trpc.importFromUrl.import.useMutation({
    onSuccess: (data) => setResult(data),
  });

  if (user?.role !== 'admin') {
    return <div className="container py-12 text-center text-muted-foreground">Admin access required.</div>;
  }

  return (
    <div className="container py-8 max-w-2xl mx-auto">
      <button onClick={() => navigate('/')} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-accent mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </button>

      <div className="flex items-center gap-3 mb-8">
        <Globe className="w-6 h-6 text-accent" />
        <h1 className="text-2xl font-bold">Import from URL</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Paste a URL to import content as a new document</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-1 block">URL</label>
            <Input
              placeholder="https://example.com/article..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-1 block">Document Title</label>
            <Input
              placeholder="Title for the imported document"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-1 block">Category</label>
              <Input
                placeholder="e.g. Operations"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-1 block">Locale</label>
              <Input
                placeholder="en"
                value={locale}
                onChange={(e) => setLocale(e.target.value)}
              />
            </div>
          </div>

          <Button
            onClick={() => importMutation.mutate({ url, title, category, locale })}
            disabled={!url || !title || !category || importMutation.isPending}
            className="w-full"
          >
            {importMutation.isPending ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Importing...</>
            ) : (
              <><Globe className="w-4 h-4 mr-2" /> Import Document</>
            )}
          </Button>

          {importMutation.isError && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-sm text-destructive">
              Error: {importMutation.error?.message || 'Failed to import'}
            </div>
          )}

          {result && (
            <div className="p-4 rounded-lg bg-accent/10 border border-accent/30">
              <div className="flex items-center gap-2 text-accent font-medium mb-2">
                <CheckCircle className="w-4 h-4" /> Import Successful!
              </div>
              <p className="text-sm text-muted-foreground">
                Created "{result.title}" ({result.wordCount} words) in {result.category}.
                Status: draft.
              </p>
              <Button size="sm" variant="outline" className="mt-2" onClick={() => navigate(`/docs/${result.slug}`)}>
                View Document
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

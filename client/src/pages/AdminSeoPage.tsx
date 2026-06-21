import { useState, useMemo } from 'react';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Globe, Search, Save, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminSeoPage() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  if (user?.role !== 'admin') { navigate('/'); return null; }

  const [search, setSearch] = useState('');
  const [selectedDocId, setSelectedDocId] = useState<number | null>(null);
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [ogTitle, setOgTitle] = useState('');
  const [ogDescription, setOgDescription] = useState('');
  const [ogImage, setOgImage] = useState('');

  const stableInput = useMemo(() => ({ limit: 100, offset: 0 }), []);
  const { data: docsData } = trpc.documents.list.useQuery(stableInput);
  const docs = docsData?.documents || [];

  const { data: seoData } = trpc.seoMeta.get.useQuery(
    { documentId: selectedDocId! },
    { enabled: !!selectedDocId, }
  );

  const upsertMutation = trpc.seoMeta.upsert.useMutation({
    onSuccess: () => toast.success('SEO metadata saved'),
    onError: () => toast.error('Failed to save'),
  });

  const filteredDocs = docs.filter((d: any) =>
    d.title.toLowerCase().includes(search.toLowerCase())
  );

  const selectDoc = (doc: any) => {
    setSelectedDocId(doc.id);
    setMetaTitle(seoData?.metaTitle || doc.title);
    setMetaDescription(seoData?.metaDescription || '');
    setOgTitle(seoData?.ogTitle || doc.title);
    setOgDescription(seoData?.ogDescription || '');
    setOgImage(seoData?.ogImage || '');
  };

  // Update form when seoData loads
  if (seoData && selectedDocId) {
    const doc = docs.find((d: any) => d.id === selectedDocId);
    if (doc && metaTitle === '' && !seoData.metaTitle) {
      // keep defaults
    }
  }

  return (
    <div className="container max-w-5xl py-8">
      <div className="flex items-center gap-3 mb-6">
        <Globe className="w-6 h-6 text-emerald-400" />
        <h1 className="text-2xl font-bold">SEO Metadata Editor</h1>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div>
          <div className="relative mb-3">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search documents..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
          </div>
          <div className="space-y-1 max-h-[600px] overflow-y-auto">
            {filteredDocs.map((doc: any) => (
              <div
                key={doc.id}
                onClick={() => selectDoc(doc)}
                className={`py-2 px-3 rounded cursor-pointer text-sm transition-colors ${selectedDocId === doc.id ? 'bg-accent/30 text-accent-foreground' : 'hover:bg-accent/10'}`}
              >
                <div className="truncate font-medium">{doc.title}</div>
                <Badge variant="outline" className="text-xs mt-0.5">{doc.category}</Badge>
              </div>
            ))}
          </div>
        </div>

        <div className="md:col-span-2">
          {selectedDocId ? (
            <Card className="bg-card/80 border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">Edit SEO Metadata</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Meta Title</label>
                  <Input value={metaTitle} onChange={e => setMetaTitle(e.target.value)} placeholder="Page title for search engines" />
                  <span className="text-xs text-muted-foreground">{metaTitle.length}/60 characters</span>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Meta Description</label>
                  <textarea
                    className="w-full rounded border border-border bg-background px-3 py-2 text-sm"
                    rows={3}
                    value={metaDescription}
                    onChange={e => setMetaDescription(e.target.value)}
                    placeholder="Description for search engine results"
                  />
                  <span className="text-xs text-muted-foreground">{metaDescription.length}/160 characters</span>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">OG Title</label>
                  <Input value={ogTitle} onChange={e => setOgTitle(e.target.value)} placeholder="Title for social media sharing" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">OG Description</label>
                  <textarea
                    className="w-full rounded border border-border bg-background px-3 py-2 text-sm"
                    rows={2}
                    value={ogDescription}
                    onChange={e => setOgDescription(e.target.value)}
                    placeholder="Description for social media sharing"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">OG Image URL</label>
                  <Input value={ogImage} onChange={e => setOgImage(e.target.value)} placeholder="https://example.com/image.png" />
                </div>
                <Button
                  onClick={() => upsertMutation.mutate({ documentId: selectedDocId, metaTitle, metaDescription, ogTitle, ogDescription, ogImage })}
                  disabled={upsertMutation.isPending}
                >
                  {upsertMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                  Save SEO Metadata
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="flex items-center justify-center h-64 text-muted-foreground">
              Select a document to edit its SEO metadata
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

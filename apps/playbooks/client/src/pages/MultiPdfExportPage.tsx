import { useState, useMemo } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { FileDown, Printer } from 'lucide-react';

export default function MultiPdfExportPage() {
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>([]);
  const { data: docsData } = trpc.documents.list.useQuery({ limit: 500, offset: 0 });
  const docs = docsData?.documents || [];

  const stableSlugs = useMemo(() => selectedSlugs, [selectedSlugs.join(',')]);
  const { data: contents, isLoading: loadingContents } = trpc.multiPdfExport.getDocContents.useQuery(
    { slugs: stableSlugs },
    { enabled: selectedSlugs.length > 0 }
  );

  const toggle = (slug: string) => {
    setSelectedSlugs(prev => prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug]);
  };

  const selectAll = () => setSelectedSlugs(docs.map(d => d.slug));
  const deselectAll = () => setSelectedSlugs([]);

  const printCombined = () => {
    if (!contents || contents.length === 0) { toast.error('No documents selected'); return; }
    const html = contents.map(c => `<h1>${c.title}</h1><p style="color:#666;margin-bottom:1em;">${c.category}</p><div style="white-space:pre-wrap;font-family:serif;">${c.content}</div><hr style="page-break-after:always;" />`).join('');
    const win = window.open('', '_blank');
    if (win) {
      win.document.write(`<!DOCTYPE html><html><head><title>Document Export</title><style>body{font-family:Georgia,serif;max-width:800px;margin:0 auto;padding:2em;} h1{margin-top:2em;} hr{border:none;}</style></head><body>${html}</body></html>`);
      win.document.close();
      setTimeout(() => win.print(), 500);
    }
  };

  return (
    <div className="container max-w-4xl py-8">
      <div className="flex items-center gap-3 mb-8">
        <FileDown className="w-8 h-8 text-primary" />
        <div>
          <h1 className="text-2xl font-bold">Multi-Document Export</h1>
          <p className="text-muted-foreground">Select documents and export as a combined printable PDF</p>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Select Documents ({selectedSlugs.length} selected)</CardTitle>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={selectAll}>Select All</Button>
              <Button size="sm" variant="outline" onClick={deselectAll}>Deselect All</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-1 max-h-96 overflow-y-auto">
            {docs.map(d => (
              <label key={d.slug} className="flex items-center gap-3 px-3 py-2 rounded hover:bg-muted/30 cursor-pointer">
                <Checkbox checked={selectedSlugs.includes(d.slug)} onCheckedChange={() => toggle(d.slug)} />
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium truncate block">{d.title}</span>
                  <span className="text-xs text-muted-foreground">{d.category}</span>
                </div>
              </label>
            ))}
          </div>
        </CardContent>
      </Card>

      <Button onClick={printCombined} disabled={selectedSlugs.length === 0 || loadingContents} size="lg">
        <Printer className="w-5 h-5 mr-2" />
        {loadingContents ? 'Loading...' : `Export ${selectedSlugs.length} Document${selectedSlugs.length !== 1 ? 's' : ''} as PDF`}
      </Button>
    </div>
  );
}

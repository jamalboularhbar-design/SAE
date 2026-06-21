import { useState, useMemo } from 'react';
import { trpc } from '@/lib/trpc';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileDown, Check, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function ZipExportPage() {
  const [selected, setSelected] = useState<string[]>([]);
  const stableInput = useMemo(() => ({ limit: 500, offset: 0 }), []);
  const { data: docsData } = trpc.documents.list.useQuery(stableInput);
  const docs = docsData?.documents || [];

  const stableSlugs = useMemo(() => selected, [selected.join(',')]);
  const { data: contents } = trpc.zipExport.getDocContents.useQuery(
    { slugs: stableSlugs },
    { enabled: selected.length > 0 }
  );

  const toggleDoc = (slug: string) => {
    setSelected(prev => prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug]);
  };

  const selectAll = () => setSelected(docs.map((d: any) => d.slug));
  const deselectAll = () => setSelected([]);

  const handleExport = () => {
    if (!contents || contents.length === 0) { toast.error('No documents selected'); return; }
    // Create a combined markdown file (since we can't create zip in browser without a library)
    let combined = '';
    contents.forEach((doc: any) => {
      combined += `# ${doc.title}\n\n`;
      combined += `**Category:** ${doc.category}\n\n`;
      combined += doc.content + '\n\n---\n\n';
    });
    const blob = new Blob([combined], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `documents-export-${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Exported ${contents.length} documents`);
  };

  return (
    <div className="container max-w-4xl py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <FileDown className="w-6 h-6 text-blue-400" />
          <h1 className="text-2xl font-bold">Bulk Export</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={selectAll}>Select All</Button>
          <Button variant="outline" size="sm" onClick={deselectAll}>Deselect All</Button>
          <Button size="sm" onClick={handleExport} disabled={selected.length === 0}>
            <FileDown className="w-4 h-4 mr-2" />
            Export {selected.length} docs
          </Button>
        </div>
      </div>

      <div className="space-y-1">
        {docs.map((doc: any) => (
          <div
            key={doc.slug}
            onClick={() => toggleDoc(doc.slug)}
            className={`flex items-center gap-3 py-2 px-3 rounded cursor-pointer transition-colors ${selected.includes(doc.slug) ? 'bg-accent/20' : 'hover:bg-accent/10'}`}
          >
            <div className={`w-5 h-5 rounded border flex items-center justify-center ${selected.includes(doc.slug) ? 'bg-primary border-primary' : 'border-border'}`}>
              {selected.includes(doc.slug) && <Check className="w-3 h-3 text-primary-foreground" />}
            </div>
            <span className="text-sm flex-1 truncate">{doc.title}</span>
            <Badge variant="outline" className="text-xs">{doc.category}</Badge>
          </div>
        ))}
      </div>
    </div>
  );
}

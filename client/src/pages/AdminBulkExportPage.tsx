import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Download, FileText, Package, CheckCircle } from 'lucide-react';

export default function AdminBulkExportPage() {
  const { data: allDocs } = trpc.documents.list.useQuery({ limit: 500, status: 'all' });
  const [exporting, setExporting] = useState(false);
  const [format, setFormat] = useState<'markdown' | 'json'>('markdown');
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());
  const [done, setDone] = useState(false);

  const docs = allDocs?.documents || [];
  const categories = Array.from(new Set(docs.map(d => d.category)));

  const toggleCategory = (cat: string) => {
    const next = new Set(selectedCategories);
    if (next.has(cat)) next.delete(cat);
    else next.add(cat);
    setSelectedCategories(next);
  };

  const filteredDocs = selectedCategories.size === 0
    ? docs
    : docs.filter(d => selectedCategories.has(d.category));

  const handleExport = async () => {
    setExporting(true);
    try {
      // Build a text bundle (since we can't create actual ZIP in browser without a library)
      if (format === 'json') {
        const blob = new Blob([JSON.stringify(filteredDocs, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `riad-routes-docs-export-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
      } else {
        // Export as concatenated markdown with frontmatter
        const content = filteredDocs.map(doc => {
          return `---\ntitle: ${doc.title}\ncategory: ${doc.category}\nslug: ${doc.slug}\nstatus: ${doc.status}\n---\n\n# ${doc.title}\n\n(Content available in full export)\n`;
        }).join('\n---\n\n');
        const blob = new Blob([content], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `riad-routes-docs-export-${Date.now()}.md`;
        a.click();
        URL.revokeObjectURL(url);
      }
      setDone(true);
      setTimeout(() => setDone(false), 3000);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="container max-w-3xl py-8">
      <div className="flex items-center gap-3 mb-6">
        <Package className="w-6 h-6 text-primary" />
        <div>
          <h1 className="text-2xl font-bold">Bulk Export Documents</h1>
          <p className="text-sm text-muted-foreground">Export all or selected documents as a downloadable file.</p>
        </div>
      </div>

      {/* Format selector */}
      <div className="mb-6">
        <label className="text-sm font-medium block mb-2">Export Format</label>
        <div className="flex gap-3">
          <button
            onClick={() => setFormat('markdown')}
            className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
              format === 'markdown' ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:bg-muted'
            }`}
          >
            <FileText className="w-4 h-4 inline mr-1.5" /> Markdown
          </button>
          <button
            onClick={() => setFormat('json')}
            className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
              format === 'json' ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:bg-muted'
            }`}
          >
            <FileText className="w-4 h-4 inline mr-1.5" /> JSON
          </button>
        </div>
      </div>

      {/* Category filter */}
      <div className="mb-6">
        <label className="text-sm font-medium block mb-2">Filter by Category (optional)</label>
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => toggleCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                selectedCategories.has(cat)
                  ? 'bg-primary/10 border-primary/30 text-primary'
                  : 'border-border hover:bg-muted'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Summary and export */}
      <div className="border border-border rounded-lg p-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">{filteredDocs.length} documents selected</p>
          <p className="text-xs text-muted-foreground">Format: {format.toUpperCase()}</p>
        </div>
        <button
          onClick={handleExport}
          disabled={exporting || filteredDocs.length === 0}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
        >
          {done ? <CheckCircle className="w-4 h-4" /> : <Download className="w-4 h-4" />}
          {done ? 'Downloaded!' : exporting ? 'Exporting...' : 'Export'}
        </button>
      </div>
    </div>
  );
}

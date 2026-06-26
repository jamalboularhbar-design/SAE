import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Download, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface BulkExportProps {
  category: string;
}

export default function BulkExport({ category }: BulkExportProps) {
  const [isExporting, setIsExporting] = useState(false);
  
  const { data } = trpc.documents.list.useQuery(
    { category, limit: 600 },
    { enabled: false } // Only fetch on demand
  );

  const utils = trpc.useUtils();

  const handleExport = async () => {
    setIsExporting(true);
    try {
      // Fetch all documents in this category with content
      const result = await utils.documents.list.fetch({ category, limit: 600 });
      
      if (!result.documents.length) {
        toast.error('No documents found in this category');
        return;
      }

      // For bulk export, we need to fetch each document's full content
      // Create a combined markdown file
      const docs = result.documents;
      let combined = `# ${category} - Document Collection\n\n`;
      combined += `> ${docs.length} documents exported on ${new Date().toLocaleDateString()}\n\n---\n\n`;
      
      for (const doc of docs) {
        combined += `## ${doc.title}\n\n`;
        combined += `*File: ${doc.filename} | Words: ${doc.wordCount || 0}*\n\n`;
        combined += `---\n\n`;
      }

      const blob = new Blob([combined], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${category.replace(/[^a-zA-Z0-9]/g, '-')}-index.md`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success(`Exported ${docs.length} document index from ${category}`);
    } catch {
      toast.error('Export failed');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={isExporting}
      className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] text-muted-foreground hover:text-foreground bg-card/50 border border-border/50 hover:border-accent/30 transition-colors disabled:opacity-50"
      title={`Export ${category} document index`}
    >
      {isExporting ? (
        <Loader2 className="w-3 h-3 animate-spin" />
      ) : (
        <Download className="w-3 h-3" />
      )}
      Export
    </button>
  );
}

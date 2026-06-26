import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { FileDown, Loader2 } from 'lucide-react';
import { BRAND } from '@/lib/brand';
import { buildPrintCitation, buildPrintFooter, documentPermalink } from '@shared/printFooter';

interface ExportDocxProps {
  slug: string;
  title: string;
}

export default function ExportDocx({ slug, title }: ExportDocxProps) {
  const [exporting, setExporting] = useState(false);
  const { data } = trpc.documentExport.docx.useQuery({ slug });

  const handleExport = async () => {
    if (!data || 'error' in data) return;
    setExporting(true);
    try {
      const footer = buildPrintFooter({ title: data.title, slug, category: data.category });
      const citation = buildPrintCitation({
        title: data.title,
        slug,
      });
      const htmlContent = `
<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head>
<meta charset="utf-8">
<title>${data.title}</title>
<style>
  body { font-family: Calibri, Arial, sans-serif; font-size: 11pt; line-height: 1.6; margin: 1in; }
  h1 { font-size: 18pt; color: #333; border-bottom: 2px solid #e8783a; padding-bottom: 8px; }
  h2 { font-size: 14pt; color: #444; margin-top: 18pt; }
  h3 { font-size: 12pt; color: #555; margin-top: 14pt; }
  p { margin: 6pt 0; }
  code { background: #f4f4f4; padding: 2px 4px; font-family: Consolas, monospace; font-size: 10pt; }
  pre { background: #f4f4f4; padding: 12px; border-radius: 4px; font-family: Consolas, monospace; font-size: 10pt; white-space: pre-wrap; }
  blockquote { border-left: 3px solid #e8783a; padding-left: 12px; color: #666; margin: 12pt 0; }
  table { border-collapse: collapse; width: 100%; margin: 12pt 0; }
  th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
  th { background: #f8f8f8; font-weight: bold; }
  .export-meta { color: #666; font-size: 9pt; margin: 8pt 0 16pt; }
  .export-footer { margin-top: 36pt; padding-top: 12pt; border-top: 1px solid #ccc; font-size: 9pt; color: #666; line-height: 1.5; }
  .export-footer-brand { font-weight: bold; color: #333; margin-bottom: 4pt; }
  .export-footer-confidential { font-size: 8pt; color: #666; margin-top: 6pt; letter-spacing: 0.01em; }
</style>
</head>
<body>
<h1>${data.title}</h1>
<p class="export-meta">Category: ${data.category} · Exported from ${BRAND.productName} · ${documentPermalink(slug)}</p>
<hr/>
${markdownToHtml(data.content || '')}
<div class="export-footer">
  <div class="export-footer-brand">${footer.brandLine}</div>
  <p>Source: ${footer.sourceLine}</p>
  <p style="font-style: italic;">${citation}</p>
  <p class="export-footer-confidential">${footer.confidentialLine}</p>
</div>
</body>
</html>`;
      
      const blob = new Blob([htmlContent], { type: 'application/vnd.ms-word' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title.replace(/[^a-zA-Z0-9]+/g, '-')}.doc`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  };

  return (
    <Button
      size="sm"
      variant="outline"
      onClick={handleExport}
      disabled={exporting || !data || 'error' in data}
      className="gap-1.5"
    >
      {exporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileDown className="w-3.5 h-3.5" />}
      Export .doc
    </Button>
  );
}

// Simple markdown to HTML converter for export
function markdownToHtml(md: string): string {
  return md
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^/, '<p>')
    .replace(/$/, '</p>');
}

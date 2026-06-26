import { useState } from 'react';
import { useLocation } from 'wouter';
import { trpc } from '@/lib/trpc';
import { ArrowLeft, Upload, FileText, CheckCircle, XCircle, Loader2 } from 'lucide-react';

interface ParsedDoc {
  title: string;
  category: string;
  content: string;
}

// Robust CSV parser that handles quoted fields, commas, and newlines
function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;
  
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const next = text[i + 1];
    
    if (inQuotes) {
      if (ch === '"' && next === '"') {
        field += '"';
        i++; // skip escaped quote
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        field += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ',') {
        row.push(field.trim());
        field = '';
      } else if (ch === '\n' || (ch === '\r' && next === '\n')) {
        row.push(field.trim());
        if (row.some(cell => cell.length > 0)) rows.push(row);
        row = [];
        field = '';
        if (ch === '\r') i++; // skip \n in \r\n
      } else {
        field += ch;
      }
    }
  }
  // Last field/row
  row.push(field.trim());
  if (row.some(cell => cell.length > 0)) rows.push(row);
  return rows;
}

export default function BulkImportPage() {
  const [, navigate] = useLocation();
  const [parsedDocs, setParsedDocs] = useState<ParsedDoc[]>([]);
  const [results, setResults] = useState<Array<{ title: string; status: string; error?: string }>>([]);
  const [parseError, setParseError] = useState('');

  const importMutation = trpc.documents.bulkImport.useMutation({
    onSuccess: (data) => {
      setResults(data);
    },
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setParseError('');
    setResults([]);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      try {
        const csvRows = parseCSV(text);
        if (csvRows.length < 2) {
          setParseError('CSV must have a header row and at least one data row.');
          return;
        }

        const headers = csvRows[0].map(h => h.toLowerCase());
        const titleIdx = headers.indexOf('title');
        const categoryIdx = headers.indexOf('category');
        const contentIdx = headers.indexOf('content');

        if (titleIdx === -1 || categoryIdx === -1 || contentIdx === -1) {
          setParseError('CSV must have columns: title, category, content');
          return;
        }

        const docs: ParsedDoc[] = [];
        for (let i = 1; i < csvRows.length; i++) {
          const row = csvRows[i];
          if (row.length > Math.max(titleIdx, categoryIdx, contentIdx)) {
            docs.push({
              title: row[titleIdx] || '',
              category: row[categoryIdx] || '',
              content: row[contentIdx] || '',
            });
          }
        }

        setParsedDocs(docs.filter(d => d.title && d.category && d.content));
      } catch {
        setParseError('Failed to parse CSV file.');
      }
    };
    reader.readAsText(file);
  };

  const handleImport = () => {
    if (parsedDocs.length === 0) return;
    importMutation.mutate({ documents: parsedDocs });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/50">
        <div className="container h-14 flex items-center gap-3">
          <button onClick={() => navigate('/admin/editor')} className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <Upload className="w-5 h-5 text-accent" />
          <h1 className="text-lg font-bold text-foreground">Bulk Import</h1>
        </div>
      </header>

      <div className="container py-6 sm:py-8 max-w-3xl mx-auto">
        {/* Instructions */}
        <div className="p-4 rounded-lg bg-card/30 border border-border/50 mb-6">
          <h2 className="text-sm font-semibold text-foreground mb-2">CSV Format</h2>
          <p className="text-xs text-muted-foreground mb-2">Upload a CSV file with the following columns:</p>
          <code className="text-xs text-accent bg-accent/10 px-2 py-1 rounded">title,category,content</code>
          <p className="text-xs text-muted-foreground mt-2">Each row will create a new document. Maximum 100 documents per import.</p>
        </div>

        {/* Upload */}
        <label className="block w-full p-8 rounded-lg border-2 border-dashed border-border/50 hover:border-accent/50 transition-colors cursor-pointer text-center mb-6">
          <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">Click to upload CSV file</p>
          <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
        </label>

        {parseError && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm mb-4">
            {parseError}
          </div>
        )}

        {/* Preview */}
        {parsedDocs.length > 0 && results.length === 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-foreground">Preview ({parsedDocs.length} documents)</h3>
              <button
                onClick={handleImport}
                disabled={importMutation.isPending}
                className="flex items-center gap-2 px-4 py-2 rounded-md bg-accent text-accent-foreground text-sm font-medium hover:bg-accent/90 disabled:opacity-50 transition-colors"
              >
                {importMutation.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                {importMutation.isPending ? 'Importing...' : 'Import All'}
              </button>
            </div>
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {parsedDocs.map((doc, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-md bg-card/30 border border-border/50">
                  <FileText className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-foreground truncate">{doc.title}</p>
                    <p className="text-[10px] text-muted-foreground">{doc.category} · {doc.content.split(/\s+/).length} words</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {results.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">Import Results</h3>
            <div className="space-y-2">
              {results.map((r, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-md bg-card/30 border border-border/50">
                  {r.status === 'created' ? (
                    <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-foreground truncate">{r.title}</p>
                    {r.error && <p className="text-[10px] text-red-400">{r.error}</p>}
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded ${r.status === 'created' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                    {r.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

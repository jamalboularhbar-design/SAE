import { useState } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/_core/hooks/useAuth';
import { trpc } from '@/lib/trpc';
import { ArrowLeft, Upload, FileJson, CheckCircle, XCircle } from 'lucide-react';

export default function AdminImportJsonPage() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const [jsonText, setJsonText] = useState('');
  const [results, setResults] = useState<Array<{ title: string; status: string; error?: string; slug?: string }> | null>(null);
  const [error, setError] = useState('');

  const importMut = trpc.importJSON.import.useMutation({
    onSuccess: (data) => setResults(data),
    onError: (err) => setError(err.message),
  });

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Admin access required.</p>
      </div>
    );
  }

  const handleImport = () => {
    setError('');
    setResults(null);
    try {
      const parsed = JSON.parse(jsonText);
      if (!Array.isArray(parsed)) {
        setError('JSON must be an array of document objects');
        return;
      }
      for (const doc of parsed) {
        if (!doc.title || !doc.category || !doc.content) {
          setError('Each document must have title, category, and content fields');
          return;
        }
      }
      importMut.mutate({ documents: parsed });
    } catch {
      setError('Invalid JSON format');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setJsonText(ev.target?.result as string || '');
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/50">
        <div className="container h-14 flex items-center gap-3">
          <button onClick={() => navigate('/admin/editor')} className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <FileJson className="w-5 h-5 text-accent" />
          <h1 className="text-lg font-bold text-foreground">Import from JSON</h1>
        </div>
      </header>

      <div className="container py-6 max-w-3xl">
        <div className="mb-4 p-4 rounded-xl border border-border/50 bg-card/30">
          <h3 className="text-sm font-semibold text-foreground mb-2">Expected Format</h3>
          <pre className="text-xs text-muted-foreground bg-background p-3 rounded-md overflow-x-auto">
{`[
  {
    "title": "Document Title",
    "category": "Category Name",
    "content": "Markdown content...",
    "status": "draft",    // optional: draft|review|published
    "locale": "en"        // optional: language code
  }
]`}
          </pre>
        </div>

        {/* File upload */}
        <div className="mb-4">
          <label className="flex items-center gap-2 px-4 py-3 rounded-lg border border-dashed border-border hover:border-accent/50 cursor-pointer transition-colors">
            <Upload className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Upload .json file</span>
            <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>

        {/* Text area */}
        <textarea
          value={jsonText}
          onChange={e => setJsonText(e.target.value)}
          placeholder="Paste JSON array here..."
          className="w-full h-64 px-4 py-3 rounded-lg border border-border bg-background text-foreground text-sm font-mono resize-y"
        />

        {error && (
          <p className="mt-2 text-sm text-red-500">{error}</p>
        )}

        <button
          onClick={handleImport}
          disabled={!jsonText.trim() || importMut.isPending}
          className="mt-4 px-6 py-2.5 rounded-lg bg-accent text-accent-foreground text-sm font-medium disabled:opacity-50"
        >
          {importMut.isPending ? 'Importing...' : 'Import Documents'}
        </button>

        {/* Results */}
        {results && (
          <div className="mt-6 space-y-2">
            <h3 className="text-sm font-semibold text-foreground">Import Results</h3>
            {results.map((r, i) => (
              <div key={i} className="flex items-center gap-2 p-2 rounded-md border border-border/50">
                {r.status === 'created' ? (
                  <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-500 shrink-0" />
                )}
                <span className="text-sm text-foreground truncate flex-1">{r.title}</span>
                {r.status === 'created' && r.slug && (
                  <button onClick={() => navigate(`/docs/${r.slug}`)} className="text-xs text-accent hover:underline">View</button>
                )}
                {r.error && <span className="text-xs text-red-400 truncate max-w-[200px]">{r.error}</span>}
              </div>
            ))}
            <p className="text-xs text-muted-foreground mt-2">
              {results.filter(r => r.status === 'created').length} of {results.length} imported successfully.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

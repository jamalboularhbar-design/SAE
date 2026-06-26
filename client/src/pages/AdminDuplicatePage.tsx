import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Copy, CheckCircle, Search } from 'lucide-react';
import { useLocation } from 'wouter';

export default function AdminDuplicatePage() {
  const { data: allDocs } = trpc.documents.list.useQuery({ limit: 200, status: 'all' });
  const duplicateMutation = trpc.duplicate.create.useMutation();
  const [, navigate] = useLocation();
  const [search, setSearch] = useState('');
  const [duplicated, setDuplicated] = useState<string | null>(null);

  const docs = (allDocs?.documents || []).filter(d =>
    d.title.toLowerCase().includes(search.toLowerCase()) ||
    d.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleDuplicate = async (slug: string) => {
    const result = await duplicateMutation.mutateAsync({ slug });
    if (result?.slug) {
      setDuplicated(result.slug);
      setTimeout(() => {
        navigate(`/admin/editor?edit=${result.slug}`);
      }, 1000);
    }
  };

  return (
    <div className="container max-w-3xl py-8">
      <h1 className="text-2xl font-bold mb-2">Duplicate Document</h1>
      <p className="text-sm text-muted-foreground mb-6">Select a document to create an editable copy as a draft.</p>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search documents..."
          className="w-full pl-10 pr-4 py-2.5 border border-border rounded-lg text-sm bg-background"
        />
      </div>

      <div className="space-y-1 max-h-[500px] overflow-y-auto">
        {docs.map(doc => (
          <div key={doc.slug} className="flex items-center justify-between px-4 py-3 border border-border rounded-lg hover:bg-muted/50 transition-colors">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium truncate">{doc.title}</p>
              <p className="text-xs text-muted-foreground">{doc.category} · {doc.status}</p>
            </div>
            <button
              onClick={() => handleDuplicate(doc.slug)}
              disabled={duplicateMutation.isPending}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-border rounded-md hover:bg-muted transition-colors disabled:opacity-50"
            >
              {duplicated ? <CheckCircle className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
              Duplicate
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

import { useState, useMemo } from 'react';
import { useLocation } from 'wouter';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import { ArrowLeft, FolderInput, Check, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminBulkMovePage() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const { data: docsData } = trpc.documents.list.useQuery({ offset: 0, limit: 500 });
  const { data: categories } = trpc.documents.categories.useQuery();
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>([]);
  const [targetCategory, setTargetCategory] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  const bulkMoveMut = trpc.bulkMove.move.useMutation({
    onSuccess: (data) => {
      toast.success(`Moved ${data?.moved || 0} documents to "${targetCategory}"`);
      setSelectedSlugs([]);
    },
    onError: () => toast.error('Failed to move documents'),
  });

  const filteredDocs = useMemo(() => {
    if (!docsData?.documents) return [];
    if (!filterCategory) return docsData.documents;
    return docsData.documents.filter(d => d.category === filterCategory);
  }, [docsData, filterCategory]);

  const toggleDoc = (slug: string) => {
    setSelectedSlugs(prev =>
      prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug]
    );
  };

  const selectAll = () => {
    if (selectedSlugs.length === filteredDocs.length) {
      setSelectedSlugs([]);
    } else {
      setSelectedSlugs(filteredDocs.map(d => d.slug));
    }
  };

  const handleMove = () => {
    if (!targetCategory || selectedSlugs.length === 0) return;
    bulkMoveMut.mutate({ slugs: selectedSlugs, newCategory: targetCategory });
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Admin access required.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/50">
        <div className="container h-14 flex items-center gap-3">
          <button onClick={() => navigate('/admin/dashboard')} className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <FolderInput className="w-5 h-5 text-accent" />
          <h1 className="text-lg font-bold text-foreground">Bulk Move Documents</h1>
        </div>
      </header>

      <div className="container py-6 max-w-3xl">
        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3 mb-6 p-4 rounded-xl bg-card/30 border border-border/30">
          <div className="flex items-center gap-2">
            <label className="text-xs text-muted-foreground">From:</label>
            <select
              value={filterCategory}
              onChange={e => { setFilterCategory(e.target.value); setSelectedSlugs([]); }}
              className="text-sm rounded-lg bg-background border border-border/50 px-3 py-1.5 text-foreground"
            >
              <option value="">All Categories</option>
              {categories?.map(c => <option key={c.category} value={c.category}>{c.category}</option>)}
            </select>
          </div>
          <ArrowRight className="w-4 h-4 text-muted-foreground" />
          <div className="flex items-center gap-2">
            <label className="text-xs text-muted-foreground">To:</label>
            <select
              value={targetCategory}
              onChange={e => setTargetCategory(e.target.value)}
              className="text-sm rounded-lg bg-background border border-border/50 px-3 py-1.5 text-foreground"
            >
              <option value="">Select target...</option>
              {categories?.filter(c => c.category !== filterCategory).map(c => (
                <option key={c.category} value={c.category}>{c.category}</option>
              ))}
            </select>
          </div>
          <button
            onClick={handleMove}
            disabled={!targetCategory || selectedSlugs.length === 0 || bulkMoveMut.isPending}
            className="ml-auto px-4 py-1.5 rounded-lg bg-accent text-accent-foreground text-sm font-medium disabled:opacity-50"
          >
            {bulkMoveMut.isPending ? 'Moving...' : `Move ${selectedSlugs.length} docs`}
          </button>
        </div>

        {/* Select all */}
        <div className="flex items-center gap-2 mb-3">
          <button onClick={selectAll} className="text-xs text-muted-foreground hover:text-foreground">
            {selectedSlugs.length === filteredDocs.length && filteredDocs.length > 0 ? 'Deselect all' : 'Select all'}
          </button>
          <span className="text-xs text-muted-foreground">({filteredDocs.length} documents)</span>
        </div>

        {/* Document list */}
        <div className="space-y-1 max-h-[500px] overflow-y-auto">
          {filteredDocs.map(doc => (
            <div
              key={doc.slug}
              onClick={() => toggleDoc(doc.slug)}
              className={`flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-colors ${
                selectedSlugs.includes(doc.slug) ? 'bg-accent/10 border border-accent/30' : 'hover:bg-card/30 border border-transparent'
              }`}
            >
              <div className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 ${
                selectedSlugs.includes(doc.slug) ? 'bg-accent border-accent' : 'border-border/50'
              }`}>
                {selectedSlugs.includes(doc.slug) && <Check className="w-3 h-3 text-accent-foreground" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground truncate">{doc.title}</p>
                <p className="text-xs text-muted-foreground">{doc.category}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

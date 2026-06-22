import { useState, useMemo } from 'react';
import { trpc } from '@/lib/trpc';
import { Book, Search, Plus, Edit2, Trash2, X } from 'lucide-react';
import { useAuth } from '@/_core/hooks/useAuth';

export default function GlossaryPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const { data: terms, refetch } = trpc.glossary.list.useQuery({});
  const createMutation = trpc.glossary.create.useMutation({ onSuccess: () => refetch() });
  const updateMutation = trpc.glossary.update.useMutation({ onSuccess: () => refetch() });
  const deleteMutation = trpc.glossary.delete.useMutation({ onSuccess: () => refetch() });

  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ term: '', definition: '', category: '', relatedTerms: '' });

  const filtered = useMemo(() => {
    if (!terms) return [];
    if (!search) return terms;
    const q = search.toLowerCase();
    return terms.filter((t: any) =>
      t.term.toLowerCase().includes(q) || t.definition.toLowerCase().includes(q)
    );
  }, [terms, search]);

  // Group by first letter
  const grouped = useMemo(() => {
    const map: Record<string, any[]> = {};
    for (const t of filtered) {
      const letter = t.term[0]?.toUpperCase() || '#';
      if (!map[letter]) map[letter] = [];
      map[letter].push(t);
    }
    return Object.entries(map).sort(([a], [b]) => a.localeCompare(b));
  }, [filtered]);

  const handleSubmit = () => {
    if (editingId) {
      updateMutation.mutate({ id: editingId, ...formData });
    } else {
      createMutation.mutate(formData);
    }
    setShowForm(false);
    setEditingId(null);
    setFormData({ term: '', definition: '', category: '', relatedTerms: '' });
  };

  const startEdit = (t: any) => {
    setEditingId(t.id);
    setFormData({ term: t.term, definition: t.definition, category: t.category || '', relatedTerms: t.relatedTerms || '' });
    setShowForm(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Book className="w-8 h-8 text-[#d4af37]" />
            <div>
              <h1 className="text-3xl font-bold text-[#d4af37]">Glossary</h1>
              <p className="text-muted-foreground text-sm">{terms?.length || 0} terms defined</p>
            </div>
          </div>
          {isAdmin && (
            <button
              onClick={() => { setShowForm(true); setEditingId(null); setFormData({ term: '', definition: '', category: '', relatedTerms: '' }); }}
              className="flex items-center gap-2 px-4 py-2 bg-[#d4af37] text-black rounded-lg hover:bg-[#c4a030] text-sm font-medium"
            >
              <Plus className="w-4 h-4" /> Add Term
            </button>
          )}
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search terms..."
            className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
          />
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <div className="bg-card border border-border rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">{editingId ? 'Edit Term' : 'Add New Term'}</h3>
              <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input
                value={formData.term}
                onChange={e => setFormData(p => ({ ...p, term: e.target.value }))}
                placeholder="Term"
                className="px-3 py-2 bg-input border border-border text-foreground"
              />
              <input
                value={formData.category}
                onChange={e => setFormData(p => ({ ...p, category: e.target.value }))}
                placeholder="Category (optional)"
                className="px-3 py-2 bg-input border border-border text-foreground"
              />
            </div>
            <textarea
              value={formData.definition}
              onChange={e => setFormData(p => ({ ...p, definition: e.target.value }))}
              placeholder="Definition"
              rows={3}
              className="w-full px-3 py-2 bg-input border border-border text-foreground mb-4"
            />
            <input
              value={formData.relatedTerms}
              onChange={e => setFormData(p => ({ ...p, relatedTerms: e.target.value }))}
              placeholder="Related terms (comma-separated)"
              className="w-full px-3 py-2 bg-input border border-border text-foreground mb-4"
            />
            <button
              onClick={handleSubmit}
              disabled={!formData.term || !formData.definition}
              className="px-4 py-2 bg-[#d4af37] text-black rounded font-medium hover:bg-[#c4a030] disabled:opacity-50"
            >
              {editingId ? 'Update' : 'Create'}
            </button>
          </div>
        )}

        {/* Terms List */}
        {grouped.map(([letter, letterTerms]) => (
          <div key={letter} className="mb-6">
            <h2 className="text-2xl font-bold text-[#d4af37] mb-3 border-b border-border pb-1">{letter}</h2>
            <div className="space-y-3">
              {letterTerms.map((t: any) => (
                <div key={t.id} className="bg-card border border-border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">{t.term}</h3>
                      {t.category && <span className="text-xs text-[#d4af37] bg-[#d4af37]/10 px-2 py-0.5 rounded">{t.category}</span>}
                    </div>
                    {isAdmin && (
                      <div className="flex gap-2">
                        <button onClick={() => startEdit(t)} className="text-muted-foreground hover:text-[#d4af37]">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => deleteMutation.mutate({ id: t.id })} className="text-muted-foreground hover:text-red-400">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                  <p className="text-foreground/80 mt-2">{t.definition}</p>
                  {t.relatedTerms && (
                    <div className="mt-2 flex gap-2 flex-wrap">
                      <span className="text-xs text-muted-foreground">Related:</span>
                      {t.relatedTerms.split(',').map((rt: string) => (
                        <span key={rt.trim()} className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">{rt.trim()}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            {search ? 'No terms match your search.' : 'No glossary terms yet. Add some!'}
          </div>
        )}
      </div>
    </div>
  );
}

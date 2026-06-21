import { useState, useMemo } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Tags, Plus, Minus } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminBulkTagsPage() {
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [search, setSearch] = useState('');

  const { data: docsData } = trpc.documents.list.useQuery({ limit: 200, offset: 0 });
  const assignMutation = trpc.bulkTags.assign.useMutation({
    onSuccess: () => toast.success('Tags assigned successfully'),
  });
  const removeMutation = trpc.bulkTags.remove.useMutation({
    onSuccess: () => toast.success('Tags removed successfully'),
  });

  const docs = docsData?.documents || [];
  const filteredDocs = useMemo(() => {
    if (!search) return docs;
    const s = search.toLowerCase();
    return docs.filter(d => d.title.toLowerCase().includes(s) || d.category.toLowerCase().includes(s));
  }, [docs, search]);

  const tags = tagInput.split(',').map(t => t.trim()).filter(Boolean);

  const toggleDoc = (slug: string) => {
    setSelectedSlugs(prev =>
      prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug]
    );
  };

  const selectAll = () => setSelectedSlugs(filteredDocs.map(d => d.slug));
  const deselectAll = () => setSelectedSlugs([]);

  return (
    <div className="container py-8 max-w-5xl">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Tags className="w-6 h-6 text-primary" />
        Bulk Tag Assignment
      </h1>

      {/* Tag Input & Actions */}
      <div className="border rounded-lg p-4 mb-6">
        <div className="flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="text-xs text-muted-foreground">Tags (comma-separated)</label>
            <Input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="tag1, tag2, tag3..."
            />
          </div>
          <Button
            onClick={() => {
              if (tags.length === 0 || selectedSlugs.length === 0) {
                toast.error('Select documents and enter tags');
                return;
              }
              assignMutation.mutate({ documentSlugs: selectedSlugs, tags });
            }}
            disabled={assignMutation.isPending}
            className="gap-1"
          >
            <Plus className="w-4 h-4" />
            Assign Tags ({selectedSlugs.length} docs)
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              if (tags.length === 0 || selectedSlugs.length === 0) {
                toast.error('Select documents and enter tags');
                return;
              }
              removeMutation.mutate({ documentSlugs: selectedSlugs, tags });
            }}
            disabled={removeMutation.isPending}
            className="gap-1"
          >
            <Minus className="w-4 h-4" />
            Remove Tags
          </Button>
        </div>
        {tags.length > 0 && (
          <div className="flex gap-1 mt-2 flex-wrap">
            {tags.map(t => (
              <span key={t} className="bg-primary/20 text-primary text-xs px-2 py-0.5 rounded">{t}</span>
            ))}
          </div>
        )}
      </div>

      {/* Document Selection */}
      <div className="border rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold">Select Documents ({selectedSlugs.length} selected)</h2>
          <div className="flex gap-2">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter documents..."
              className="w-48 h-8"
            />
            <Button size="sm" variant="outline" onClick={selectAll}>Select All</Button>
            <Button size="sm" variant="outline" onClick={deselectAll}>Deselect All</Button>
          </div>
        </div>
        <div className="max-h-96 overflow-y-auto space-y-1">
          {filteredDocs.map(doc => (
            <label
              key={doc.slug}
              className="flex items-center gap-2 p-2 rounded hover:bg-accent/30 cursor-pointer"
            >
              <Checkbox
                checked={selectedSlugs.includes(doc.slug)}
                onCheckedChange={() => toggleDoc(doc.slug)}
              />
              <span className="text-sm flex-1">{doc.title}</span>
              <span className="text-xs text-muted-foreground">{doc.category}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

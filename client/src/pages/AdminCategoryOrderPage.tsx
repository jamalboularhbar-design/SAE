import { useState, useEffect } from 'react';
import { trpc } from '@/lib/trpc';
import { GripVertical, Save, RotateCcw } from 'lucide-react';

export default function AdminCategoryOrderPage() {
  const { data: ordering } = trpc.categoryOrder.get.useQuery();
  const { data: categoriesData } = trpc.documents.categories.useQuery();
  const saveMutation = trpc.categoryOrder.save.useMutation();
  const [items, setItems] = useState<{ name: string; sortOrder: number }[]>([]);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (categoriesData && ordering) {
      // Merge: use ordering for known categories, add new ones at end
      const orderMap = new Map(ordering.map((o: { categoryName: string; sortOrder: number }) => [o.categoryName, o.sortOrder]));
      const allCats = categoriesData.map((c: { category: string }) => c.category);
      const sorted = allCats
        .map((name: string) => ({ name, sortOrder: orderMap.get(name) ?? 999 }))
        .sort((a: { sortOrder: number }, b: { sortOrder: number }) => a.sortOrder - b.sortOrder);
      setItems(sorted);
    }
  }, [categoriesData, ordering]);

  const handleDragStart = (idx: number) => setDragIdx(idx);
  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    if (dragIdx === null || dragIdx === idx) return;
    const newItems = [...items];
    const [moved] = newItems.splice(dragIdx, 1);
    newItems.splice(idx, 0, moved);
    setItems(newItems.map((item, i) => ({ ...item, sortOrder: i })));
    setDragIdx(idx);
  };

  const handleSave = async () => {
    await saveMutation.mutateAsync({ categories: items.map((item, i) => ({ name: item.name, sortOrder: i })) });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    if (categoriesData) {
      setItems(categoriesData.map((c: { category: string }, i: number) => ({ name: c.category, sortOrder: i })));
    }
  };

  return (
    <div className="container max-w-2xl py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Category Display Order</h1>
          <p className="text-sm text-muted-foreground mt-1">Drag categories to reorder how they appear in the navigation and filters.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleReset} className="flex items-center gap-1.5 px-3 py-2 border border-border rounded-lg text-sm hover:bg-muted transition-colors">
            <RotateCcw className="w-4 h-4" /> Reset
          </button>
          <button onClick={handleSave} className="flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
            <Save className="w-4 h-4" /> {saved ? 'Saved!' : 'Save Order'}
          </button>
        </div>
      </div>

      <div className="space-y-1">
        {items.map((item, idx) => (
          <div
            key={item.name}
            draggable
            onDragStart={() => handleDragStart(idx)}
            onDragOver={(e) => handleDragOver(e, idx)}
            onDragEnd={() => setDragIdx(null)}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg border transition-colors cursor-move ${
              dragIdx === idx ? 'bg-primary/10 border-primary/30' : 'bg-card border-border hover:bg-muted/50'
            }`}
          >
            <GripVertical className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium flex-1">{item.name}</span>
            <span className="text-xs text-muted-foreground">#{idx + 1}</span>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p>No categories found. Create documents with categories first.</p>
        </div>
      )}
    </div>
  );
}

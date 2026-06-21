import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Bookmark, Plus, Trash2, Filter } from 'lucide-react';
import { toast } from 'sonner';

interface SavedFiltersProps {
  currentFilter: Record<string, any>;
  onApplyFilter: (config: Record<string, any>) => void;
}

export default function SavedFilters({ currentFilter, onApplyFilter }: SavedFiltersProps) {
  const [showSave, setShowSave] = useState(false);
  const [filterName, setFilterName] = useState('');

  const { data: filters, refetch } = trpc.savedFilters.list.useQuery(undefined, {
    retry: false,
  });
  const createMutation = trpc.savedFilters.create.useMutation({
    onSuccess: () => {
      refetch();
      setShowSave(false);
      setFilterName('');
      toast.success('Filter saved');
    },
  });
  const deleteMutation = trpc.savedFilters.delete.useMutation({
    onSuccess: () => refetch(),
  });

  const handleSave = () => {
    if (!filterName.trim()) return;
    createMutation.mutate({ name: filterName, filterConfig: JSON.stringify(currentFilter) });
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {filters && filters.length > 0 && (
        <>
          <Filter className="w-4 h-4 text-muted-foreground" />
          {filters.map((f) => (
            <div key={f.id} className="flex items-center gap-1 bg-accent/30 rounded px-2 py-1 text-xs">
              <button
                onClick={() => {
                  try {
                    const config = JSON.parse(f.filterConfig);
                    onApplyFilter(config);
                  } catch {}
                }}
                className="hover:text-primary transition-colors"
              >
                {f.name}
              </button>
              <button
                onClick={() => deleteMutation.mutate({ id: f.id })}
                className="text-muted-foreground hover:text-destructive ml-1"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
        </>
      )}
      {showSave ? (
        <div className="flex items-center gap-1">
          <Input
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
            placeholder="Filter name..."
            className="h-7 w-32 text-xs"
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
          />
          <Button size="sm" variant="ghost" className="h-7 px-2" onClick={handleSave}>
            Save
          </Button>
          <Button size="sm" variant="ghost" className="h-7 px-2" onClick={() => setShowSave(false)}>
            Cancel
          </Button>
        </div>
      ) : (
        <Button
          size="sm"
          variant="ghost"
          className="h-7 px-2 text-xs"
          onClick={() => setShowSave(true)}
        >
          <Bookmark className="w-3 h-3 mr-1" />
          Save Filter
        </Button>
      )}
    </div>
  );
}

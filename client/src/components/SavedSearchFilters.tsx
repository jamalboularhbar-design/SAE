import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Bookmark, Plus, Trash2, Loader2 } from 'lucide-react';

interface SavedSearchFiltersProps {
  currentFilterConfig?: string;
  onApplyFilter?: (config: string) => void;
}

export default function SavedSearchFilters({ currentFilterConfig, onApplyFilter }: SavedSearchFiltersProps) {
  const { user } = useAuth();
  const { data: filters, refetch } = trpc.savedFiltersUser.list.useQuery(undefined, { enabled: !!user });
  const createMut = trpc.savedFiltersUser.create.useMutation({
    onSuccess: () => { refetch(); toast.success('Filter saved'); setShowSave(false); setName(''); },
    onError: () => toast.error('Failed to save filter'),
  });
  const deleteMut = trpc.savedFiltersUser.delete.useMutation({
    onSuccess: () => { refetch(); toast.success('Filter deleted'); },
  });
  const useMut = trpc.savedFiltersUser.use.useMutation();

  const [showSave, setShowSave] = useState(false);
  const [name, setName] = useState('');

  if (!user) return null;

  const handleApply = (filter: any) => {
    useMut.mutate({ id: filter.id });
    if (onApplyFilter) onApplyFilter(filter.filterConfig);
    toast.success(`Applied filter: ${filter.name}`);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Bookmark className="w-4 h-4 text-muted-foreground" />
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Saved Filters</span>
        {currentFilterConfig && (
          <Button size="sm" variant="ghost" className="h-6 text-xs" onClick={() => setShowSave(true)}>
            <Plus className="w-3 h-3 mr-1" /> Save Current
          </Button>
        )}
      </div>
      {showSave && (
        <div className="flex gap-2">
          <input
            placeholder="Filter name"
            value={name}
            onChange={e => setName(e.target.value)}
            className="flex-1 px-2 py-1 rounded bg-muted/50 border border-border text-xs text-foreground"
          />
          <Button
            size="sm"
            className="h-7 text-xs"
            onClick={() => createMut.mutate({ name, filterConfig: currentFilterConfig || '{}' })}
            disabled={!name.trim() || createMut.isPending}
          >
            {createMut.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Save'}
          </Button>
        </div>
      )}
      {filters && filters.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {filters.map((f: any) => (
            <div key={f.id} className="flex items-center gap-1 group">
              <Badge
                variant="outline"
                className="cursor-pointer hover:bg-accent/10 text-xs"
                onClick={() => handleApply(f)}
              >
                {f.name}
                {f.usageCount > 0 && <span className="ml-1 text-muted-foreground">({f.usageCount})</span>}
              </Badge>
              <button
                onClick={() => deleteMut.mutate({ id: f.id })}
                className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

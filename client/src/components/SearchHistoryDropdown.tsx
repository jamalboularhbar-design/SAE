import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import { Clock, Trash2, X } from 'lucide-react';

interface SearchHistoryDropdownProps {
  onSelect: (query: string) => void;
  onClose: () => void;
}

export default function SearchHistoryDropdown({ onSelect, onClose }: SearchHistoryDropdownProps) {
  const { isAuthenticated } = useAuth();
  const { data: history } = trpc.searchHistory.recent.useQuery(undefined, { enabled: isAuthenticated });
  const clearMut = trpc.searchHistory.clear.useMutation({
    onSuccess: () => {},
  });

  if (!isAuthenticated || !history || history.length === 0) return null;

  return (
    <div className="absolute top-full left-0 right-0 mt-1 rounded-xl bg-card border border-border/50 shadow-xl z-50 overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 border-b border-border/30">
        <span className="text-xs text-muted-foreground font-medium">Recent Searches</span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => clearMut.mutate()}
            className="text-xs text-muted-foreground hover:text-red-400 flex items-center gap-1"
          >
            <Trash2 className="w-3 h-3" /> Clear
          </button>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground p-0.5">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      <div className="max-h-[200px] overflow-y-auto">
        {history.map((item, i) => (
          <button
            key={i}
            onClick={() => onSelect(item.query)}
            className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-accent/5 transition-colors"
          >
            <Clock className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            <span className="text-sm text-foreground truncate">{item.query}</span>
            <span className="text-xs text-muted-foreground ml-auto shrink-0">{item.resultCount} results</span>
          </button>
        ))}
      </div>
    </div>
  );
}

import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Search, FileText, X, Clock } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';

interface SearchAutocompleteProps {
  onSearchChange?: (query: string) => void;
  placeholder?: string;
  className?: string;
}

export default function SearchAutocomplete({ onSearchChange, placeholder = "Quick search...", className = "" }: SearchAutocompleteProps) {
  const [, navigate] = useLocation();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [showHistory, setShowHistory] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated } = useAuth();
  const { data: searchHistory } = trpc.searchHistory.recent.useQuery(undefined, { enabled: isAuthenticated });

  const { data } = trpc.documents.list.useQuery(
    { search: query, limit: 8 },
    { enabled: query.length >= 2 }
  );

  const suggestions = data?.documents ?? [];

  useEffect(() => {
    setSelectedIndex(-1);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node) &&
          inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && suggestions[selectedIndex]) {
        navigate(`/docs/${suggestions[selectedIndex].slug}`);
        setIsOpen(false);
        setQuery('');
      } else if (query.trim()) {
        navigate(`/search?q=${encodeURIComponent(query.trim())}`);
        setIsOpen(false);
        setQuery('');
      } else if (onSearchChange) {
        onSearchChange(query);
        setIsOpen(false);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => { setQuery(e.target.value); setIsOpen(true); onSearchChange?.(e.target.value); }}
          onFocus={() => { if (query.length >= 2) setIsOpen(true); else if (!query && isAuthenticated) setShowHistory(true); }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full pl-9 pr-8 py-2.5 rounded-lg bg-card/50 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all text-sm"
        />
        {query && (
          <button
            onClick={() => { setQuery(''); setIsOpen(false); onSearchChange?.(''); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Search History Dropdown */}
      {showHistory && !isOpen && !query && searchHistory && searchHistory.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 py-1 bg-card border border-border/50 rounded-lg shadow-xl z-50 max-h-[200px] overflow-y-auto">
          <div className="px-3 py-1.5 text-xs text-muted-foreground font-medium border-b border-border/30">Recent Searches</div>
          {searchHistory.map((item, i) => (
            <button
              key={i}
              onClick={() => { setQuery(item.query); setIsOpen(true); setShowHistory(false); navigate(`/search?q=${encodeURIComponent(item.query)}`); }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-left hover:bg-muted/50 text-foreground transition-colors"
            >
              <Clock className="w-3.5 h-3.5 flex-shrink-0 text-muted-foreground" />
              <span className="text-sm truncate">{item.query}</span>
              <span className="text-[10px] text-muted-foreground ml-auto">{item.resultCount} results</span>
            </button>
          ))}
        </div>
      )}

      {isOpen && suggestions.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-1 py-1 bg-card border border-border/50 rounded-lg shadow-xl z-50 max-h-[320px] overflow-y-auto"
        >
          {suggestions.map((doc, i) => (
            <button
              key={doc.slug}
              onClick={() => { navigate(`/docs/${doc.slug}`); setIsOpen(false); setQuery(''); }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-left transition-colors ${
                i === selectedIndex ? 'bg-accent/10 text-accent' : 'hover:bg-muted/50 text-foreground'
              }`}
            >
              <FileText className="w-3.5 h-3.5 flex-shrink-0 text-muted-foreground" />
              <div className="min-w-0 flex-1">
                <p className="text-sm truncate">{doc.title}</p>
                <p className="text-[10px] text-muted-foreground">{doc.category}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

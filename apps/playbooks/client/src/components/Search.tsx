import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search as SearchIcon, X } from 'lucide-react';
import { buildSearchIndex, searchContent, filterByCategory, filterByType, SearchResult } from '@/lib/searchIndex';

export default function Search() {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'travel' | 'artkech' | 'general'>('all');
  const [selectedType, setSelectedType] = useState('all');
  const [isOpen, setIsOpen] = useState(false);

  const index = useMemo(() => buildSearchIndex(), []);

  const results = useMemo(() => {
    let filtered = searchContent(query, index);
    filtered = filterByCategory(filtered, selectedCategory);
    filtered = filterByType(filtered, selectedType);
    return filtered;
  }, [query, selectedCategory, selectedType, index]);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'travel':
        return 'bg-accent/20 text-accent';
      case 'artkech':
        return 'bg-secondary/20 text-secondary';
      default:
        return 'bg-muted/20 text-muted-foreground';
    }
  };

  const getTypeIcon = (type: string) => {
    const icons: { [key: string]: string } = {
      characteristic: '👤',
      process: '📋',
      responsibility: '✓',
      capability: '⚡',
      guideline: '📌',
      product: '📦',
    };
    return icons[type] || '•';
  };

  return (
    <div className="w-full">
      {/* Search Input */}
      <div className="relative mb-6">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search workspaces, processes, capabilities..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            className="pl-10 pr-10 py-3 bg-card border-border/50"
          />
          {query && (
            <button
              onClick={() => {
                setQuery('');
                setIsOpen(false);
              }}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      {isOpen && (
        <div className="mb-6 space-y-4">
          {/* Category Filter */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Category</p>
            <div className="flex gap-2 flex-wrap">
              {['all', 'travel', 'artkech', 'general'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat as any)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === cat
                      ? 'bg-accent text-accent-foreground'
                      : 'bg-card border border-border/50 text-muted-foreground hover:border-accent/50'
                  }`}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Type Filter */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Type</p>
            <div className="flex gap-2 flex-wrap">
              {['all', 'characteristic', 'process', 'capability', 'guideline'].map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                    selectedType === type
                      ? 'bg-accent text-accent-foreground'
                      : 'bg-card border border-border/50 text-muted-foreground hover:border-accent/50'
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {isOpen && (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {results.length > 0 ? (
            <>
              <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">
                {results.length} Result{results.length !== 1 ? 's' : ''}
              </p>
              {results.map((result) => (
                <Card key={result.id} className="card-premium cursor-pointer hover:bg-card/80 transition-colors">
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg">{getTypeIcon(result.type)}</span>
                          <h3 className="font-semibold text-foreground truncate">{result.title}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{result.description}</p>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="secondary" className={getCategoryColor(result.category)}>
                            {result.category === 'travel' ? '✈️ Travel' : result.category === 'artkech' ? '🎨 Creative' : '⚙️ General'}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {result.section}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </>
          ) : query ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No results found for "{query}"</p>
              <p className="text-xs text-muted-foreground mt-2">Try different keywords or filters</p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

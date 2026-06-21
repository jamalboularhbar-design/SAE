import { useState } from 'react';
import { Home, Search, FileText, ArrowRight } from 'lucide-react';
import { useLocation } from 'wouter';
import { trpc } from '@/lib/trpc';

export default function NotFound() {
  const [location, navigate] = useLocation();
  const [search, setSearch] = useState('');

  // Extract a potential search term from the URL path
  const pathSegments = location.split('/').filter(Boolean);
  const suggestedTerm = pathSegments[pathSegments.length - 1]?.replace(/-/g, ' ') || '';

  // Fetch popular documents to suggest
  const { data: popular } = trpc.documents.popular.useQuery({ limit: 6 });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/search?q=${encodeURIComponent(search.trim())}`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-2xl py-16 px-4">
        {/* 404 Header */}
        <div className="text-center mb-10">
          <p className="text-7xl font-bold text-accent/30 mb-2">404</p>
          <h1 className="text-2xl font-bold text-foreground mb-2">Page Not Found</h1>
          <p className="text-muted-foreground">
            The page <span className="font-mono text-sm bg-muted px-2 py-0.5 rounded">{location}</span> doesn't exist.
          </p>
        </div>

        {/* Search Box */}
        <div className="mb-10">
          <p className="text-sm text-muted-foreground mb-3 text-center">Try searching for what you need:</p>
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={suggestedTerm || 'Search documents...'}
                className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent/50 text-sm"
                autoFocus
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2.5 rounded-lg bg-accent text-accent-foreground text-sm font-medium hover:bg-accent/90 transition-colors"
            >
              Search
            </button>
          </form>
          {suggestedTerm && (
            <button
              onClick={() => { setSearch(suggestedTerm); navigate(`/search?q=${encodeURIComponent(suggestedTerm)}`); }}
              className="mt-2 text-xs text-accent hover:underline"
            >
              Search for "{suggestedTerm}" →
            </button>
          )}
        </div>

        {/* Popular Documents */}
        {popular && popular.length > 0 && (
          <div className="mb-10">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Popular Documents</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {popular.map(doc => (
                <button
                  key={doc.slug}
                  onClick={() => navigate(`/docs/${doc.slug}`)}
                  className="flex items-center gap-3 p-3 rounded-lg border border-border/50 hover:border-accent/30 hover:bg-accent/5 transition-colors text-left group"
                >
                  <FileText className="w-4 h-4 text-muted-foreground group-hover:text-accent shrink-0" />
                  <span className="text-sm text-foreground truncate group-hover:text-accent">{doc.title}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quick Links */}
        <div className="flex flex-wrap gap-3 justify-center">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm text-foreground hover:bg-accent/10 transition-colors"
          >
            <Home className="w-4 h-4" /> Home
          </button>
          <button
            onClick={() => navigate('/toc')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm text-foreground hover:bg-accent/10 transition-colors"
          >
            <FileText className="w-4 h-4" /> All Documents
          </button>
          <button
            onClick={() => navigate('/glossary')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm text-foreground hover:bg-accent/10 transition-colors"
          >
            <ArrowRight className="w-4 h-4" /> Glossary
          </button>
        </div>
      </div>
    </div>
  );
}

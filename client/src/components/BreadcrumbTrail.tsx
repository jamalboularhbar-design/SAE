import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbEntry {
  path: string;
  label: string;
}

function pathToLabel(path: string): string {
  if (path === '/') return 'Home';
  const segments = path.split('/').filter(Boolean);
  const last = segments[segments.length - 1];
  return last
    .replace(/-/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}

export default function BreadcrumbTrail() {
  const [location, navigate] = useLocation();
  const [trail, setTrail] = useState<BreadcrumbEntry[]>([]);

  useEffect(() => {
    if (location === '/') {
      setTrail([]);
      return;
    }

    setTrail(prev => {
      // If we're going back to a page already in the trail, truncate
      const existingIdx = prev.findIndex(e => e.path === location);
      if (existingIdx >= 0) {
        return prev.slice(0, existingIdx + 1);
      }
      // Otherwise add to trail (max 5 items)
      const entry: BreadcrumbEntry = { path: location, label: pathToLabel(location) };
      const newTrail = [...prev, entry];
      return newTrail.slice(-5);
    });
  }, [location]);

  if (location === '/' || trail.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="container py-2 flex items-center gap-1 text-xs text-muted-foreground overflow-x-auto">
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-1 hover:text-foreground transition-colors shrink-0"
      >
        <Home className="w-3 h-3" />
        <span>Home</span>
      </button>
      {trail.map((entry, idx) => (
        <span key={entry.path} className="flex items-center gap-1 shrink-0">
          <ChevronRight className="w-3 h-3 text-muted-foreground/50" />
          {idx === trail.length - 1 ? (
            <span className="text-foreground font-medium truncate max-w-[150px]">{entry.label}</span>
          ) : (
            <button
              onClick={() => navigate(entry.path)}
              className="hover:text-foreground transition-colors truncate max-w-[120px]"
            >
              {entry.label}
            </button>
          )}
        </span>
      ))}
    </nav>
  );
}

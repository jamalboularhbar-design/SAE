import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { BookmarkCheck, FileText } from 'lucide-react';
import { trpc } from '@/lib/trpc';

function getFavorites(): string[] {
  try {
    return JSON.parse(localStorage.getItem('arg-favorites') || '[]');
  } catch { return []; }
}

export default function Favorites() {
  const [, navigate] = useLocation();
  const [favoriteSlugs, setFavoriteSlugs] = useState<string[]>([]);

  useEffect(() => {
    setFavoriteSlugs(getFavorites());
  }, []);

  // Fetch all documents to match favorites
  const { data: documentsData } = trpc.documents.list.useQuery(
    { limit: 600 },
    { enabled: favoriteSlugs.length > 0 }
  );

  if (favoriteSlugs.length === 0) return null;

  const favoriteDocuments = (documentsData?.documents ?? []).filter(
    doc => favoriteSlugs.includes(doc.slug)
  );

  if (favoriteDocuments.length === 0) return null;

  return (
    <section className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-border/30">
      <div className="flex items-center gap-2 mb-4">
        <BookmarkCheck className="w-4 h-4 text-amber-400" />
        <h3 className="text-sm font-semibold text-foreground">Favorites</h3>
        <span className="text-xs text-muted-foreground">({favoriteDocuments.length})</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        {favoriteDocuments.slice(0, 6).map(doc => (
          <button
            key={doc.slug}
            onClick={() => navigate(`/docs/${doc.slug}`)}
            className="flex items-center gap-2.5 p-2.5 rounded-lg bg-amber-500/5 border border-amber-500/20 hover:border-amber-500/40 transition-colors text-left group"
          >
            <FileText className="w-3.5 h-3.5 text-amber-400/70 flex-shrink-0 group-hover:text-amber-400 transition-colors" />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-foreground truncate group-hover:text-amber-400 transition-colors">{doc.title}</p>
              <p className="text-[10px] text-muted-foreground">{doc.category}</p>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

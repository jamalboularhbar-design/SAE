import { useState } from 'react';
import { Printer, Share2, Heart, BookmarkPlus, ListPlus } from 'lucide-react';
import { trpc } from '@/lib/trpc';

function getVisitorId() {
  let id = localStorage.getItem('visitor_id');
  if (!id) {
    id = 'v_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
    localStorage.setItem('visitor_id', id);
  }
  return id;
}

interface QuickActionsToolbarProps {
  slug: string;
  title: string;
  onShare: () => void;
  isFavorited: boolean;
  onToggleFavorite: () => void;
}

export default function QuickActionsToolbar({ slug, title, onShare, isFavorited, onToggleFavorite }: QuickActionsToolbarProps) {
  const visitorId = getVisitorId();
  const [showListPicker, setShowListPicker] = useState(false);
  const [toast, setToast] = useState('');

  const { data: lists } = trpc.readingLists.list.useQuery(
    { visitorId },
    { enabled: showListPicker }
  );

  const addItemMutation = trpc.readingLists.addItem.useMutation({
    onSuccess: (result) => {
      if (result.alreadyExists) {
        showToast('Already in list');
      } else {
        showToast('Added to list');
      }
      setShowListPicker(false);
    },
  });

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2000);
  };

  return (
    <>
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-1 px-3 py-2 rounded-full bg-card/95 backdrop-blur-sm border border-border shadow-xl print:hidden max-[480px]:bottom-20">
        <button
          onClick={() => window.print()}
          className="p-2.5 rounded-full hover:bg-accent/10 text-muted-foreground hover:text-accent transition-colors"
          title="Print"
        >
          <Printer className="w-4 h-4" />
        </button>
        <button
          onClick={onShare}
          className="p-2.5 rounded-full hover:bg-accent/10 text-muted-foreground hover:text-accent transition-colors"
          title="Share"
        >
          <Share2 className="w-4 h-4" />
        </button>
        <button
          onClick={onToggleFavorite}
          className={`p-2.5 rounded-full transition-colors ${isFavorited ? 'text-red-400 bg-red-500/10' : 'text-muted-foreground hover:bg-accent/10 hover:text-accent'}`}
          title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
        </button>
        <div className="relative">
          <button
            onClick={() => setShowListPicker(!showListPicker)}
            className="p-2.5 rounded-full hover:bg-accent/10 text-muted-foreground hover:text-accent transition-colors"
            title="Add to reading list"
          >
            <ListPlus className="w-4 h-4" />
          </button>
          {showListPicker && (
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 py-1 bg-card border border-border/50 rounded-lg shadow-xl">
              {(!lists || lists.length === 0) ? (
                <p className="px-3 py-2 text-xs text-muted-foreground">No reading lists yet</p>
              ) : (
                lists.map(list => (
                  <button
                    key={list.id}
                    onClick={() => addItemMutation.mutate({ listId: list.id, documentSlug: slug })}
                    className="w-full px-3 py-2 text-left text-xs text-foreground hover:bg-accent/10 transition-colors flex items-center gap-2"
                  >
                    <BookmarkPlus className="w-3 h-3 text-muted-foreground" />
                    <span className="truncate">{list.name}</span>
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-lg bg-accent text-accent-foreground text-xs font-medium shadow-lg print:hidden">
          {toast}
        </div>
      )}
    </>
  );
}

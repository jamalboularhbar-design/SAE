import { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Keyboard } from 'lucide-react';

const shortcuts = [
  { keys: ['?'], description: 'Open this help modal' },
  { keys: ['Ctrl', 'K'], description: 'Open command palette' },
  { keys: ['Esc'], description: 'Go back / close modal' },
  { keys: ['/'], description: 'Focus search input' },
  { keys: ['Ctrl', 'P'], description: 'Print current document' },
  { keys: ['G', 'H'], description: 'Go to Home page' },
  { keys: ['G', 'L'], description: 'Go to Document Library' },
  { keys: ['G', 'G'], description: 'Go to Glossary' },
  { keys: ['G', 'T'], description: 'Go to Templates Gallery' },
  { keys: ['G', 'D'], description: 'Go to Admin Dashboard' },
];

export default function KeyboardShortcutsModal() {
  const [open, setOpen] = useState(false);
  const pendingG = useRef(false);
  const gTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) return;

      if (e.key === '?' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setOpen(true);
        return;
      }

      if (e.key === '/' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        const searchInput = document.querySelector('input[placeholder*="Search"]') as HTMLInputElement;
        searchInput?.focus();
        return;
      }

      // G-prefix navigation shortcuts
      if (e.key === 'g' && !e.ctrlKey && !e.metaKey && !pendingG.current) {
        pendingG.current = true;
        if (gTimeout.current) clearTimeout(gTimeout.current);
        gTimeout.current = setTimeout(() => { pendingG.current = false; }, 800);
        return;
      }

      if (pendingG.current) {
        pendingG.current = false;
        if (gTimeout.current) clearTimeout(gTimeout.current);

        const routes: Record<string, string> = {
          'h': '/',
          'l': '/',       // Home is also the library
          'g': '/glossary',
          't': '/templates/gallery',
          'd': '/admin/dashboard',
        };

        const route = routes[e.key.toLowerCase()];
        if (route) {
          e.preventDefault();
          window.location.href = route;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (gTimeout.current) clearTimeout(gTimeout.current);
    };
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="w-5 h-5 text-accent" />
            Keyboard Shortcuts
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3 mt-4">
          {shortcuts.map((shortcut, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
              <span className="text-sm text-muted-foreground">{shortcut.description}</span>
              <div className="flex items-center gap-1">
                {shortcut.keys.map((key, j) => (
                  <span key={j}>
                    <kbd className="px-2 py-1 rounded bg-card border border-border/50 text-xs font-mono text-foreground">
                      {key}
                    </kbd>
                    {j < shortcut.keys.length - 1 && <span className="text-muted-foreground mx-0.5">+</span>}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-muted-foreground mt-4 text-center">
          Press <kbd className="px-1.5 py-0.5 rounded bg-card border border-border/50 text-[10px] font-mono">Esc</kbd> to close
        </p>
      </DialogContent>
    </Dialog>
  );
}

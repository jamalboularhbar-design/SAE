import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';

interface KeyboardNavigationProps {
  items: { slug: string }[];
  enabled?: boolean;
}

export default function KeyboardNavigation({ items, enabled = true }: KeyboardNavigationProps) {
  const [, navigate] = useLocation();
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (!enabled || items.length === 0) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't activate if user is typing in an input
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) return;

      if (e.key === 'j' || e.key === 'k') {
        e.preventDefault();
        setIsActive(true);
        if (e.key === 'j') {
          setActiveIndex(prev => Math.min(prev + 1, items.length - 1));
        } else {
          setActiveIndex(prev => Math.max(prev - 1, 0));
        }
      } else if (e.key === 'Enter' && isActive && activeIndex >= 0) {
        e.preventDefault();
        navigate(`/docs/${items[activeIndex].slug}`);
      } else if (e.key === 'Escape') {
        setIsActive(false);
        setActiveIndex(-1);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [enabled, items, activeIndex, isActive, navigate]);

  useEffect(() => {
    if (!isActive || activeIndex < 0) return;
    const el = document.querySelector(`[data-nav-index="${activeIndex}"]`);
    if (el) {
      el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      el.classList.add('ring-2', 'ring-accent/50');
      return () => el.classList.remove('ring-2', 'ring-accent/50');
    }
  }, [activeIndex, isActive]);

  if (!isActive) return null;

  return (
    <div className="fixed bottom-20 right-4 z-50 px-3 py-2 rounded-lg bg-card border border-border/50 shadow-xl">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <kbd className="px-1.5 py-0.5 rounded bg-muted/50 font-mono text-[10px]">j</kbd>
        <kbd className="px-1.5 py-0.5 rounded bg-muted/50 font-mono text-[10px]">k</kbd>
        <span>navigate</span>
        <kbd className="px-1.5 py-0.5 rounded bg-muted/50 font-mono text-[10px]">↵</kbd>
        <span>open</span>
        <kbd className="px-1.5 py-0.5 rounded bg-muted/50 font-mono text-[10px]">esc</kbd>
        <span>exit</span>
      </div>
    </div>
  );
}

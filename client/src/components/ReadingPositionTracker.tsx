import { useEffect, useRef } from 'react';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';

interface ReadingPositionTrackerProps {
  documentSlug: string;
}

export default function ReadingPositionTracker({ documentSlug }: ReadingPositionTrackerProps) {
  const { isAuthenticated } = useAuth();
  const { data: position } = trpc.readingPosition.get.useQuery(
    { documentSlug },
    { enabled: isAuthenticated }
  );
  const saveMut = trpc.readingPosition.save.useMutation();
  const lastSaved = useRef(0);
  const hasRestored = useRef(false);

  // Restore position on mount
  useEffect(() => {
    if (!position || hasRestored.current) return;
    if (position.scrollPercent > 5) {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const targetScroll = (position.scrollPercent / 100) * maxScroll;
      setTimeout(() => {
        window.scrollTo({ top: targetScroll, behavior: 'smooth' });
      }, 500);
      hasRestored.current = true;
    }
  }, [position]);

  // Save position on scroll (debounced)
  useEffect(() => {
    if (!isAuthenticated) return;

    const handleScroll = () => {
      const now = Date.now();
      if (now - lastSaved.current < 5000) return; // Save at most every 5s
      
      const scrollTop = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll <= 0) return;
      
      const percent = Math.round((scrollTop / maxScroll) * 100);
      lastSaved.current = now;
      saveMut.mutate({ documentSlug, scrollPercent: percent });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isAuthenticated, documentSlug]);

  // Save on unmount
  useEffect(() => {
    if (!isAuthenticated) return;
    return () => {
      const scrollTop = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll <= 0) return;
      const percent = Math.round((scrollTop / maxScroll) * 100);
      saveMut.mutate({ documentSlug, scrollPercent: percent });
    };
  }, [isAuthenticated, documentSlug]);

  // Show resume indicator
  if (position && position.scrollPercent > 5 && !hasRestored.current) {
    return (
      <div className="fixed bottom-20 right-4 z-40 px-3 py-2 rounded-lg bg-accent/90 text-accent-foreground text-xs shadow-lg">
        Resuming from {position.scrollPercent}%...
      </div>
    );
  }

  return null;
}

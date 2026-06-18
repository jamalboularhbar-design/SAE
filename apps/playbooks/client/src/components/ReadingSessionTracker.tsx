import { useEffect, useRef } from 'react';
import { trpc } from '@/lib/trpc';

export default function ReadingSessionTracker({ slug }: { slug: string }) {
  const startTime = useRef(Date.now());
  const maxScroll = useRef(0);
  const recordSession = trpc.batch21.recordSession.useMutation();

  useEffect(() => {
    startTime.current = Date.now();
    maxScroll.current = 0;

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        const pct = Math.min(100, Math.round((scrollTop / docHeight) * 100));
        if (pct > maxScroll.current) maxScroll.current = pct;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    const sendSession = () => {
      const duration = Math.round((Date.now() - startTime.current) / 1000);
      if (duration < 3) return; // Ignore very short visits
      const visitorId = localStorage.getItem('visitor-id') || 'anonymous';
      recordSession.mutate({
        visitorId,
        documentSlug: slug,
        durationSeconds: duration,
        scrollDepthPercent: maxScroll.current,
        completed: maxScroll.current >= 90 ? 1 : 0,
      });
    };

    window.addEventListener('beforeunload', sendSession);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('beforeunload', sendSession);
      sendSession();
    };
  }, [slug]);

  return null; // Invisible tracker
}

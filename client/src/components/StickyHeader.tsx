import { useState, useEffect, ReactNode } from 'react';

interface StickyHeaderProps {
  children: ReactNode;
}

/** Sticky shell with scroll shadow only — no height collapse (avoids menu bounce). */
export default function StickyHeader({ children }: StickyHeaderProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className={`sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border transition-shadow duration-200 ${
        scrolled ? 'shadow-sm' : ''
      }`}
    >
      {children}
    </div>
  );
}

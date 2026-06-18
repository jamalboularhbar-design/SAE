import { useState, useEffect, ReactNode } from 'react';

interface StickyHeaderProps {
  children: ReactNode;
  collapsedContent?: ReactNode;
}

export default function StickyHeader({ children, collapsedContent }: StickyHeaderProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    const threshold = 80;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > threshold && currentScrollY > lastScrollY) {
        setIsCollapsed(true);
      } else if (currentScrollY < threshold || currentScrollY < lastScrollY - 20) {
        setIsCollapsed(false);
      }
      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className={`sticky top-0 z-40 transition-all duration-300 bg-background/95 backdrop-blur-sm border-b border-border ${
        isCollapsed ? 'py-1 shadow-sm' : 'py-0'
      }`}
    >
      <div className={`transition-all duration-300 ${isCollapsed ? 'max-h-12 overflow-hidden' : 'max-h-96'}`}>
        {isCollapsed && collapsedContent ? collapsedContent : children}
      </div>
    </div>
  );
}

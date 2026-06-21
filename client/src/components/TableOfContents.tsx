import { useMemo, useState, useEffect } from 'react';
import { List } from 'lucide-react';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
}

/**
 * Auto-generated table of contents from markdown headings.
 * Sticky sidebar that highlights the current section based on scroll position.
 */
export default function TableOfContents({ content }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');

  const headings = useMemo(() => {
    const items: TocItem[] = [];
    const lines = content.split('\n');
    for (const line of lines) {
      const match = line.match(/^(#{1,4})\s+(.+)/);
      if (match) {
        const level = match[1].length;
        const text = match[2].replace(/[*_`\[\]]/g, '').trim();
        const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        items.push({ id, text, level });
      }
    }
    return items;
  }, [content]);

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: '-20% 0% -60% 0%' }
    );

    headings.forEach(h => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length < 3) return null; // Only show for docs with 3+ headings

  const scrollToHeading = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <nav className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto">
      <div className="flex items-center gap-2 mb-3 text-muted-foreground">
        <List className="w-4 h-4" />
        <span className="text-xs font-semibold uppercase tracking-wider">On this page</span>
      </div>
      <ul className="space-y-1">
        {headings.map((h) => (
          <li key={h.id}>
            <button
              onClick={() => scrollToHeading(h.id)}
              className={`block w-full text-left text-sm py-1 transition-colors truncate ${
                activeId === h.id
                  ? 'text-accent font-medium'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              style={{ paddingLeft: `${(h.level - 1) * 12}px` }}
            >
              {h.text}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

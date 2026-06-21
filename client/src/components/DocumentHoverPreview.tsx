import { useState, useRef } from 'react';
import { trpc } from '@/lib/trpc';
import { FileText, Clock } from 'lucide-react';

interface DocumentHoverPreviewProps {
  slug: string;
  children: React.ReactNode;
}

export default function DocumentHoverPreview({ slug, children }: DocumentHoverPreviewProps) {
  const [show, setShow] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLSpanElement>(null);

  const { data: doc } = trpc.documents.getBySlug.useQuery(
    { slug },
    { enabled: show, staleTime: 60000 }
  );

  const handleMouseEnter = (e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setPosition({ x: rect.left, y: rect.bottom + 8 });
    timeoutRef.current = setTimeout(() => setShow(true), 400);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setShow(false);
  };

  const excerpt = doc?.content?.slice(0, 200).replace(/[#*_\[\]]/g, '').trim() || '';
  const wordCount = doc?.wordCount || 0;
  const readingTime = Math.ceil(wordCount / 200);

  return (
    <span
      ref={containerRef}
      className="relative inline"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {show && doc && (
        <div
          className="fixed z-[100] w-72 p-3 rounded-xl bg-popover text-popover-foreground border border-border/50 shadow-xl animate-in fade-in-0 zoom-in-95"
          style={{ left: Math.min(position.x, window.innerWidth - 300), top: position.y }}
        >
          <div className="flex items-start gap-2 mb-2">
            <FileText className="w-4 h-4 text-accent shrink-0 mt-0.5" />
            <p className="text-sm font-medium text-foreground line-clamp-2">{doc.title}</p>
          </div>
          {excerpt && (
            <p className="text-xs text-muted-foreground line-clamp-3 mb-2">{excerpt}...</p>
          )}
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" /> {readingTime} min
            </span>
            <span>{doc.category}</span>
          </div>
        </div>
      )}
    </span>
  );
}

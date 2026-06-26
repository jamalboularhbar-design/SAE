import { useState, useRef } from 'react';
import { trpc } from '@/lib/trpc';
import { Link } from 'wouter';
import { Clock, Tag } from 'lucide-react';

interface DocumentSummaryCardProps {
  slug: string;
  children: React.ReactNode;
}

export default function DocumentSummaryCard({ slug, children }: DocumentSummaryCardProps) {
  const [show, setShow] = useState(false);
  const [position, setPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const triggerRef = useRef<HTMLSpanElement>(null);

  const { data: doc } = trpc.documents.getBySlug.useQuery(
    { slug },
    { enabled: show }
  );

  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => {
      if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        setPosition({ top: rect.bottom + 8, left: Math.min(rect.left, window.innerWidth - 320) });
      }
      setShow(true);
    }, 400);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setShow(false);
  };

  return (
    <span
      ref={triggerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative inline"
    >
      {children}
      {show && doc && (
        <div
          className="fixed z-50 w-80 bg-popover text-popover-foreground border border-border rounded-lg shadow-lg p-4 animate-in fade-in-0 zoom-in-95"
          style={{ top: position.top, left: position.left }}
          onMouseEnter={() => { if (timeoutRef.current) clearTimeout(timeoutRef.current); }}
          onMouseLeave={handleMouseLeave}
        >
          <Link href={`/docs/${slug}`}>
            <h4 className="font-semibold text-sm mb-1 hover:text-primary transition-colors cursor-pointer">{doc.title}</h4>
          </Link>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
            <span className="flex items-center gap-1"><Tag className="w-3 h-3" />{doc.category}</span>
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{Math.ceil((doc.wordCount || 0) / 200)} min</span>
          </div>
          <p className="text-xs text-muted-foreground line-clamp-3">
            {(doc.content || '').replace(/[#*_\[\]()>`]/g, '').slice(0, 200)}...
          </p>
        </div>
      )}
    </span>
  );
}

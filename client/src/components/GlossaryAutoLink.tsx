import { useMemo, useState, ReactNode } from 'react';
import { trpc } from '@/lib/trpc';

interface GlossaryAutoLinkProps {
  children: ReactNode;
  className?: string;
}

/**
 * Renders children with glossary terms auto-linked as highlighted spans
 * with hover tooltips showing definitions. Works with ReactMarkdown paragraph/li components.
 */
export default function GlossaryAutoLink({ children, className }: GlossaryAutoLinkProps) {
  const { data: terms } = trpc.glossary.list.useQuery({});
  const [hoveredTerm, setHoveredTerm] = useState<string | null>(null);

  // Extract plain text from children for processing
  const textContent = useMemo(() => {
    const extractText = (node: ReactNode): string => {
      if (typeof node === 'string') return node;
      if (typeof node === 'number') return String(node);
      if (Array.isArray(node)) return node.map(extractText).join('');
      if (node && typeof node === 'object' && 'props' in node) {
        return extractText((node as any).props.children);
      }
      return '';
    };
    return extractText(children);
  }, [children]);

  const processedContent = useMemo(() => {
    if (!terms || terms.length === 0 || !textContent) return null;

    // Sort terms by length (longest first) to avoid partial matches
    const sortedTerms = [...terms].sort((a, b) => b.term.length - a.term.length);

    // Build a regex that matches any glossary term (case-insensitive, word boundary)
    const pattern = sortedTerms
      .map(t => t.term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
      .join('|');
    const regex = new RegExp(`\\b(${pattern})\\b`, 'gi');

    // Check if there are any matches at all
    if (!regex.test(textContent)) return null;

    // Reset regex
    regex.lastIndex = 0;

    // Split content into segments: plain text and matched terms
    const segments: Array<{ type: 'text' | 'term'; value: string; definition?: string }> = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(textContent)) !== null) {
      if (match.index > lastIndex) {
        segments.push({ type: 'text', value: textContent.slice(lastIndex, match.index) });
      }
      const matchedTerm = sortedTerms.find(t => t.term.toLowerCase() === match![0].toLowerCase());
      segments.push({
        type: 'term',
        value: match[0],
        definition: matchedTerm?.definition || '',
      });
      lastIndex = match.index + match[0].length;
    }
    if (lastIndex < textContent.length) {
      segments.push({ type: 'text', value: textContent.slice(lastIndex) });
    }

    return segments;
  }, [textContent, terms]);

  // If no glossary matches, render children as-is
  if (!processedContent) {
    return <span className={className}>{children}</span>;
  }

  return (
    <span className={className}>
      {processedContent.map((seg, i) => {
        if (seg.type === 'text') {
          return <span key={i}>{seg.value}</span>;
        }
        return (
          <span
            key={i}
            className="relative inline-block"
            onMouseEnter={() => setHoveredTerm(`${seg.value}-${i}`)}
            onMouseLeave={() => setHoveredTerm(null)}
          >
            <span className="border-b border-dashed border-accent/60 text-accent cursor-help">
              {seg.value}
            </span>
            {hoveredTerm === `${seg.value}-${i}` && seg.definition && (
              <span className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-popover text-popover-foreground text-xs rounded-lg shadow-lg border border-border max-w-xs whitespace-normal">
                <strong className="block mb-1">{seg.value}</strong>
                {seg.definition}
              </span>
            )}
          </span>
        );
      })}
    </span>
  );
}

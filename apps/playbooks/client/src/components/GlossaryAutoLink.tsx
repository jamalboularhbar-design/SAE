import { useMemo, ReactNode } from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { trpc } from '@/lib/trpc';
import { cn } from '@/lib/utils';

interface GlossaryAutoLinkProps {
  children: ReactNode;
  className?: string;
}

function GlossaryTermTooltip({ term, definition }: { term: string; definition: string }) {
  return (
    <TooltipPrimitive.Root delayDuration={150}>
      <TooltipPrimitive.Trigger asChild>
        <span
          tabIndex={0}
          className="border-b border-dashed border-accent/60 text-accent cursor-help outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:rounded-sm"
        >
          {term}
        </span>
      </TooltipPrimitive.Trigger>
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content
          side="bottom"
          align="center"
          sideOffset={8}
          collisionPadding={16}
          avoidCollisions
          className={cn(
            'z-[100] rounded-lg border border-border bg-popover text-popover-foreground shadow-lg',
            'animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
            'data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2',
            'min-w-[14rem] w-max max-w-[min(20rem,calc(100vw-2rem))] px-3 py-2.5'
          )}
        >
          <p className="font-semibold text-foreground text-sm leading-snug mb-1">{term}</p>
          <p className="text-muted-foreground text-xs leading-relaxed">{definition}</p>
          <TooltipPrimitive.Arrow
            className="fill-popover stroke-border"
            width={12}
            height={6}
            style={{ strokeWidth: 1 }}
          />
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  );
}

/**
 * Renders children with glossary terms auto-linked as highlighted spans
 * with hover tooltips showing definitions. Works with ReactMarkdown paragraph/li components.
 */
export default function GlossaryAutoLink({ children, className }: GlossaryAutoLinkProps) {
  const { data: terms } = trpc.glossary.list.useQuery({});

  // Extract plain text from children for processing
  const textContent = useMemo(() => {
    const extractText = (node: ReactNode): string => {
      if (typeof node === 'string') return node;
      if (typeof node === 'number') return String(node);
      if (Array.isArray(node)) return node.map(extractText).join('');
      if (node && typeof node === 'object' && 'props' in node) {
        return extractText((node as { props: { children?: ReactNode } }).props.children);
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
        if (!seg.definition) {
          return <span key={i}>{seg.value}</span>;
        }
        return (
          <GlossaryTermTooltip key={i} term={seg.value} definition={seg.definition} />
        );
      })}
    </span>
  );
}

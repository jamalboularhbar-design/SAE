import { useMemo } from 'react';
import { trpc } from '@/lib/trpc';

interface Props {
  content: string;
  currentSlug: string;
}

export default function CrossReferenceLinker({ content, currentSlug }: Props) {
  const { data: allDocs } = trpc.crossReferences.allTitles.useQuery();

  const linkedContent = useMemo(() => {
    if (!allDocs || allDocs.length === 0) return content;
    // Sort by title length descending to match longer titles first
    const sorted = [...allDocs]
      .filter(d => d.slug !== currentSlug)
      .sort((a, b) => b.title.length - a.title.length);

    let result = content;
    const replaced = new Set<string>();

    for (const doc of sorted) {
      if (replaced.has(doc.slug)) continue;
      // Only replace first occurrence, and only if not already inside a link
      const escapedTitle = doc.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(?<!\\[)\\b(${escapedTitle})\\b(?!\\])(?!\\()`, 'i');
      if (regex.test(result)) {
        result = result.replace(regex, `[$1](/docs/${doc.slug})`);
        replaced.add(doc.slug);
      }
    }
    return result;
  }, [content, allDocs, currentSlug]);

  return linkedContent;
}

// Export as a hook for use with markdown rendering
export function useCrossReferences(content: string, currentSlug: string): string {
  const { data: allDocs } = trpc.crossReferences.allTitles.useQuery();

  return useMemo(() => {
    if (!allDocs || allDocs.length === 0 || !content) return content;
    const sorted = [...allDocs]
      .filter(d => d.slug !== currentSlug)
      .sort((a, b) => b.title.length - a.title.length);

    let result = content;
    const replaced = new Set<string>();

    for (const doc of sorted) {
      if (replaced.has(doc.slug)) continue;
      const escapedTitle = doc.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(?<!\\[)\\b(${escapedTitle})\\b(?!\\])(?!\\()`, 'i');
      if (regex.test(result)) {
        result = result.replace(regex, `[$1](/docs/${doc.slug})`);
        replaced.add(doc.slug);
      }
    }
    return result;
  }, [content, allDocs, currentSlug]);
}

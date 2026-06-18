import { useParams } from 'wouter';
import { trpc } from '@/lib/trpc';
import ReactMarkdown from 'react-markdown';

/**
 * Minimal embed view of a document for iframe usage.
 * Route: /embed/:slug
 * No header, no sidebar, no navigation — just the document content.
 */
export default function EmbedDocument() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug || '';

  const { data: doc, isLoading, error } = trpc.documents.getBySlug.useQuery(
    { slug },
    { enabled: !!slug }
  );

  if (isLoading) {
    return (
      <div className="p-6 font-sans">
        <div className="animate-pulse space-y-3">
          <div className="h-6 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-full" />
        </div>
      </div>
    );
  }

  if (error || !doc) {
    return (
      <div className="p-6 font-sans text-red-600">
        <p>Document not found or unavailable.</p>
      </div>
    );
  }

  return (
    <div className="embed-document p-6 font-sans max-w-none">
      <style>{`
        body { margin: 0; padding: 0; background: white; color: #1a1a1a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
        .embed-document h1 { font-size: 1.5rem; font-weight: 700; margin-bottom: 0.5rem; }
        .embed-document .meta { font-size: 0.75rem; color: #666; margin-bottom: 1rem; padding-bottom: 0.75rem; border-bottom: 1px solid #eee; }
        .embed-document .prose { font-size: 0.875rem; line-height: 1.7; }
        .embed-document .prose h1, .embed-document .prose h2, .embed-document .prose h3 { margin-top: 1.5em; margin-bottom: 0.5em; font-weight: 600; }
        .embed-document .prose h2 { font-size: 1.25rem; }
        .embed-document .prose h3 { font-size: 1.1rem; }
        .embed-document .prose p { margin-bottom: 0.75em; }
        .embed-document .prose ul, .embed-document .prose ol { padding-left: 1.5em; margin-bottom: 0.75em; }
        .embed-document .prose li { margin-bottom: 0.25em; }
        .embed-document .prose code { background: #f5f5f5; padding: 0.15em 0.3em; border-radius: 3px; font-size: 0.85em; }
        .embed-document .prose pre { background: #f5f5f5; padding: 1em; border-radius: 6px; overflow-x: auto; margin-bottom: 1em; }
        .embed-document .prose blockquote { border-left: 3px solid #ddd; padding-left: 1em; color: #555; margin: 1em 0; }
        .embed-document .footer { margin-top: 1.5rem; padding-top: 0.75rem; border-top: 1px solid #eee; font-size: 0.7rem; color: #999; }
      `}</style>
      <h1>{doc.title}</h1>
      <div className="meta">
        {doc.category} · {Math.ceil((doc.wordCount || 0) / 200)} min read · {doc.wordCount?.toLocaleString()} words
      </div>
      <div className="prose">
        <ReactMarkdown>{doc.content || ''}</ReactMarkdown>
      </div>
      <div className="footer">
        Powered by ARG Builder
      </div>
    </div>
  );
}

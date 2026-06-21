import { trpc } from '@/lib/trpc';
import { useParams, useLocation } from 'wouter';
import { Loader2, AlertCircle, Clock, ArrowLeft } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Badge } from '@/components/ui/badge';

export default function ShareLinkPage() {
  const params = useParams<{ token: string }>();
  const [, navigate] = useLocation();

  const { data, isLoading, isError } = trpc.shareLinks.resolve.useQuery(
    { token: params.token || '' },
    { enabled: !!params.token }
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  if (isError || !data?.valid) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <Card className="max-w-md w-full">
          <CardContent className="py-12 text-center">
            {data?.expired ? (
              <>
                <Clock className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h2 className="text-xl font-semibold mb-2">Link Expired</h2>
                <p className="text-muted-foreground mb-6">This share link has expired. Please request a new link from the document owner.</p>
              </>
            ) : (
              <>
                <AlertCircle className="w-12 h-12 mx-auto mb-4 text-destructive opacity-50" />
                <h2 className="text-xl font-semibold mb-2">Invalid Link</h2>
                <p className="text-muted-foreground mb-6">This share link is invalid or has been revoked.</p>
              </>
            )}
            <Button onClick={() => navigate('/')}>Go to Home</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Render the document directly via share token (works for draft/private docs)
  const doc = data.document;

  if (!doc) {
    // Fallback: redirect to normal doc page if no inline doc data
    window.location.href = `/docs/${data.slug}`;
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Share banner */}
      <div className="bg-accent/10 border-b border-accent/30 py-2 px-4 text-center">
        <p className="text-sm text-accent font-medium">
          Shared document — this link will expire on {new Date(data.expiresAt!).toLocaleDateString()}
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-accent mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Library
        </button>

        <article>
          <header className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="secondary">{doc.category}</Badge>
              {doc.status !== 'published' && (
                <Badge variant="outline" className="text-amber-500 border-amber-500/30">
                  {doc.status}
                </Badge>
              )}
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">{doc.title}</h1>
            <p className="text-sm text-muted-foreground">
              Shared via secure link • {doc.readingTime || 5} min read
            </p>
          </header>

          <div className="prose prose-invert max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {doc.content || ''}
            </ReactMarkdown>
          </div>
        </article>
      </div>
    </div>
  );
}

import { trpc } from '@/lib/trpc';
import { useLocation } from 'wouter';
import { ArrowLeft, LinkIcon, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';
import ContextualHelp from '@/components/ContextualHelp';

export default function AdminBrokenLinksPage() {
  const [, navigate] = useLocation();
  const { data: brokenLinks, isLoading } = trpc.brokenLinks.check.useQuery();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/50">
        <div className="container h-14 flex items-center gap-3">
          <button onClick={() => navigate('/')} className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <LinkIcon className="w-5 h-5 text-accent" />
          <h1 className="text-lg font-bold text-foreground">Broken Links Checker</h1>
          <ContextualHelp title="Broken Links" description="Scans all documents for internal links (e.g., /docs/slug) that point to non-existent documents. Fix these to improve navigation." />
        </div>
      </header>

      <div className="container py-8 max-w-4xl">
        {isLoading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-accent" /></div>
        ) : brokenLinks && brokenLinks.length > 0 ? (
          <>
            <div className="flex items-center gap-2 mb-6 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <p className="text-sm text-amber-200">Found {brokenLinks.length} broken internal link{brokenLinks.length > 1 ? 's' : ''}</p>
            </div>

            <div className="space-y-3">
              {brokenLinks.map((link, i) => (
                <div key={i} className="p-4 rounded-xl border border-border/50 bg-card/30">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <button
                        onClick={() => navigate(`/docs/${link.sourceSlug}`)}
                        className="text-sm font-medium text-foreground hover:text-accent transition-colors truncate block"
                      >
                        {link.sourceTitle}
                      </button>
                      <p className="text-xs text-muted-foreground mt-1">
                        Link text: <span className="text-foreground">"{link.linkText}"</span>
                      </p>
                      <p className="text-xs text-red-400 mt-1 font-mono">
                        → {link.brokenLink} <span className="text-muted-foreground">(not found)</span>
                      </p>
                    </div>
                    <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-1" />
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <CheckCircle className="w-12 h-12 text-green-500 mb-4" />
            <h2 className="text-lg font-semibold text-foreground mb-2">All Clear!</h2>
            <p className="text-sm text-muted-foreground">No broken internal links found across all published documents.</p>
          </div>
        )}
      </div>
    </div>
  );
}

import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { ArrowLeft, Globe, Scan, AlertTriangle, CheckCircle, Loader2, ExternalLink } from 'lucide-react';
import { useLocation } from 'wouter';

export default function AdminBrokenLinkScannerPage() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const isAdmin = user?.role === 'admin';
  const { data: results, isLoading, refetch } = trpc.brokenLinkScanner.list.useQuery(undefined, { enabled: isAdmin });
  const scanMut = trpc.brokenLinkScanner.scan.useMutation({
    onSuccess: (r) => { refetch(); toast.success(`Scan complete: ${r?.saved ?? 0} broken links found`); },
    onError: () => toast.error('Scan failed'),
  });

  if (!isAdmin) return <div className="p-8 text-center text-muted-foreground">Admin access required</div>;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/50">
        <div className="container h-14 flex items-center gap-3">
          <button onClick={() => navigate('/')} className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <Globe className="w-5 h-5 text-accent" />
          <h1 className="text-lg font-bold text-foreground">External Broken Link Scanner</h1>
          <div className="ml-auto">
            <Button onClick={() => scanMut.mutate()} disabled={scanMut.isPending} size="sm">
              {scanMut.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Scan className="w-4 h-4 mr-2" />}
              Run Scan
            </Button>
          </div>
        </div>
      </header>
      <div className="container py-8 max-w-4xl">
        {isLoading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-accent" /></div>
        ) : results && results.length > 0 ? (
          <>
            <div className="flex items-center gap-2 mb-6 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <p className="text-sm text-amber-200">{results.length} broken external link{results.length > 1 ? 's' : ''} detected</p>
            </div>
            <div className="space-y-3">
              {results.map((link: any, i: number) => (
                <div key={i} className="p-4 rounded-xl border border-border/50 bg-card/30">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-foreground truncate">{link.documentTitle || `Doc #${link.documentId}`}</p>
                      <a href={link.linkUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:underline mt-1 flex items-center gap-1 truncate">
                        <ExternalLink className="w-3 h-3 shrink-0" />
                        {link.linkUrl}
                      </a>
                      <div className="flex items-center gap-2 mt-2">
                        {link.statusCode && <Badge variant="destructive" className="text-xs">HTTP {link.statusCode}</Badge>}
                        {link.errorMessage && <span className="text-xs text-red-400 truncate">{link.errorMessage}</span>}
                        <Badge variant="outline" className="text-xs">{link.linkType}</Badge>
                      </div>
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
            <h2 className="text-lg font-semibold text-foreground mb-2">No Broken Links</h2>
            <p className="text-sm text-muted-foreground">Run a scan to check all document content for broken external URLs.</p>
          </div>
        )}
      </div>
    </div>
  );
}

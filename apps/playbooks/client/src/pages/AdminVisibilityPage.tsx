import { useLocation } from 'wouter';
import { useAuth } from '@/_core/hooks/useAuth';
import { trpc } from '@/lib/trpc';
import { ArrowLeft, Shield, Globe, Lock, FileText } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminVisibilityPage() {
  const [, navigate] = useLocation();
  const { user } = useAuth();

  const { data: privateDocs, refetch } = trpc.visibility.private.useQuery();
  const { data: allDocs } = trpc.documents.list.useQuery({ limit: 200 });
  const setVisibility = trpc.visibility.set.useMutation({
    onSuccess: () => { refetch(); toast.success('Visibility updated'); },
  });

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Admin access required.</p>
      </div>
    );
  }

  const publicDocs = (allDocs?.documents || []).filter(d => !privateDocs?.some(p => p.slug === d.slug));

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/50">
        <div className="container h-14 flex items-center gap-3">
          <button onClick={() => navigate('/admin/editor')} className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <Shield className="w-5 h-5 text-accent" />
          <h1 className="text-lg font-bold text-foreground">Document Visibility</h1>
        </div>
      </header>

      <div className="container py-6 max-w-3xl">
        {/* Private documents */}
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3">
            <Lock className="w-4 h-4 text-orange-400" />
            Private Documents ({privateDocs?.length || 0})
          </h2>
          <p className="text-xs text-muted-foreground mb-3">These documents are only visible to admins.</p>
          {!privateDocs || privateDocs.length === 0 ? (
            <p className="text-sm text-muted-foreground p-4 border border-border/50 rounded-lg text-center">No private documents.</p>
          ) : (
            <div className="space-y-1">
              {privateDocs.map(doc => (
                <div key={doc.slug} className="flex items-center gap-3 p-3 rounded-lg border border-border/50 hover:bg-card/50">
                  <FileText className="w-4 h-4 text-muted-foreground shrink-0" />
                  <span className="text-sm text-foreground truncate flex-1">{doc.title}</span>
                  <span className="text-[10px] text-muted-foreground">{doc.category}</span>
                  <button
                    onClick={() => setVisibility.mutate({ slug: doc.slug, visibility: 'public' })}
                    className="text-xs px-2 py-1 rounded bg-green-500/10 text-green-500 hover:bg-green-500/20"
                  >
                    Make Public
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Public documents (can be made private) */}
        <div>
          <h2 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3">
            <Globe className="w-4 h-4 text-green-500" />
            Public Documents ({publicDocs.length})
          </h2>
          <p className="text-xs text-muted-foreground mb-3">Click the lock icon to restrict access.</p>
          <div className="space-y-1 max-h-[400px] overflow-y-auto">
            {publicDocs.map(doc => (
              <div key={doc.slug} className="flex items-center gap-3 p-2 rounded-lg hover:bg-card/50">
                <FileText className="w-4 h-4 text-muted-foreground shrink-0" />
                <span className="text-sm text-foreground truncate flex-1">{doc.title}</span>
                <span className="text-[10px] text-muted-foreground">{doc.category}</span>
                <button
                  onClick={() => setVisibility.mutate({ slug: doc.slug, visibility: 'private' })}
                  className="text-xs px-2 py-1 rounded bg-orange-500/10 text-orange-400 hover:bg-orange-500/20"
                >
                  <Lock className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

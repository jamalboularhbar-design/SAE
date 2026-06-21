import { useState } from 'react';
import { useLocation } from 'wouter';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import { ArrowLeft, Merge, ArrowDown, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminMergePage() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const { data: docsData } = trpc.documents.list.useQuery({ offset: 0, limit: 500 });
  const [sourceSlug, setSourceSlug] = useState('');
  const [targetSlug, setTargetSlug] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  const mergeMut = trpc.merge.merge.useMutation({
    onSuccess: (data) => {
      toast.success(`Documents merged! New word count: ${data?.mergedWordCount || 0}`);
      setSourceSlug('');
      setTargetSlug('');
      setConfirmed(false);
    },
    onError: () => toast.error('Failed to merge documents'),
  });

  const handleMerge = () => {
    if (!sourceSlug || !targetSlug || sourceSlug === targetSlug) return;
    mergeMut.mutate({ sourceSlug, targetSlug });
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Admin access required.</p>
      </div>
    );
  }

  const docs = docsData?.documents || [];

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/50">
        <div className="container h-14 flex items-center gap-3">
          <button onClick={() => navigate('/admin/dashboard')} className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <Merge className="w-5 h-5 text-accent" />
          <h1 className="text-lg font-bold text-foreground">Merge Documents</h1>
        </div>
      </header>

      <div className="container py-6 max-w-xl">
        <div className="p-4 rounded-xl bg-orange-500/5 border border-orange-500/20 mb-6">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-orange-300 font-medium">Destructive operation</p>
              <p className="text-xs text-orange-300/70 mt-1">
                Merging will append the source document's content to the target document. The source document will remain unchanged but should be deleted manually after verification.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {/* Source */}
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">Source document (content to merge from)</label>
            <select
              value={sourceSlug}
              onChange={e => { setSourceSlug(e.target.value); setConfirmed(false); }}
              className="w-full text-sm rounded-lg bg-card/30 border border-border/50 px-3 py-2.5 text-foreground"
            >
              <option value="">Select source...</option>
              {docs.filter(d => d.slug !== targetSlug).map(d => (
                <option key={d.slug} value={d.slug}>{d.title} ({d.category})</option>
              ))}
            </select>
          </div>

          <div className="flex justify-center">
            <ArrowDown className="w-5 h-5 text-accent" />
          </div>

          {/* Target */}
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">Target document (content will be appended here)</label>
            <select
              value={targetSlug}
              onChange={e => { setTargetSlug(e.target.value); setConfirmed(false); }}
              className="w-full text-sm rounded-lg bg-card/30 border border-border/50 px-3 py-2.5 text-foreground"
            >
              <option value="">Select target...</option>
              {docs.filter(d => d.slug !== sourceSlug).map(d => (
                <option key={d.slug} value={d.slug}>{d.title} ({d.category})</option>
              ))}
            </select>
          </div>

          {/* Confirmation */}
          {sourceSlug && targetSlug && (
            <div className="mt-6 p-4 rounded-xl bg-card/30 border border-border/30">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={confirmed}
                  onChange={e => setConfirmed(e.target.checked)}
                  className="rounded border-border"
                />
                <span className="text-sm text-foreground">
                  I understand this will permanently modify the target document
                </span>
              </label>
            </div>
          )}

          <button
            onClick={handleMerge}
            disabled={!sourceSlug || !targetSlug || !confirmed || mergeMut.isPending}
            className="w-full mt-4 px-4 py-2.5 rounded-lg bg-accent text-accent-foreground font-medium disabled:opacity-50"
          >
            {mergeMut.isPending ? 'Merging...' : 'Merge Documents'}
          </button>
        </div>
      </div>
    </div>
  );
}

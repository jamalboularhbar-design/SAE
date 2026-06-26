import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import { ArrowLeft, Mail, Save, Loader2, CheckCircle } from 'lucide-react';

export default function AdminEmailDigestPage() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const { data: config, isLoading } = trpc.batch21.emailDigest.useQuery(undefined, { enabled: isAdmin });
  const updateDigest = trpc.batch21.updateEmailDigest.useMutation();

  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'monthly' | 'disabled'>('weekly');
  const [includeMetrics, setIncludeMetrics] = useState(true);
  const [includeTopDocs, setIncludeTopDocs] = useState(true);
  const [includeNewDocs, setIncludeNewDocs] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (config) {
      setFrequency(config.frequency);
      setIncludeMetrics(!!config.includeMetrics);
      setIncludeTopDocs(!!config.includeTopDocs);
      setIncludeNewDocs(!!config.includeNewDocs);
    }
  }, [config]);

  const handleSave = async () => {
    await updateDigest.mutateAsync({
      frequency,
      includeMetrics: includeMetrics ? 1 : 0,
      includeTopDocs: includeTopDocs ? 1 : 0,
      includeNewDocs: includeNewDocs ? 1 : 0,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (!isAdmin) {
    return <div className="min-h-screen bg-background flex items-center justify-center"><p className="text-muted-foreground">Admin access required.</p></div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/50">
        <div className="container h-14 flex items-center gap-3">
          <button onClick={() => navigate('/admin/editor')} className="text-muted-foreground hover:text-foreground"><ArrowLeft className="w-5 h-5" /></button>
          <Mail className="w-5 h-5 text-[#d4af37]" />
          <h1 className="text-lg font-bold text-foreground">Email Digest Settings</h1>
        </div>
      </header>
      <div className="container py-6 max-w-lg">
        {isLoading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
        ) : (
          <div className="bg-card/60 border border-border/50 rounded-xl p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Frequency</label>
              <div className="grid grid-cols-4 gap-2">
                {(['daily', 'weekly', 'monthly', 'disabled'] as const).map((f) => (
                  <button key={f} onClick={() => setFrequency(f)}
                    className={`px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${
                      frequency === f ? 'bg-[#d4af37]/15 border-[#d4af37]/40 text-[#d4af37]' : 'bg-card/40 border-border/50 text-muted-foreground hover:text-foreground'
                    }`}>{f.charAt(0).toUpperCase() + f.slice(1)}</button>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              <label className="block text-sm font-medium text-foreground">Include in Digest</label>
              {[
                { label: 'Key Metrics (views, downloads, ratings)', checked: includeMetrics, set: setIncludeMetrics },
                { label: 'Top Documents by Engagement', checked: includeTopDocs, set: setIncludeTopDocs },
                { label: 'Newly Created Documents', checked: includeNewDocs, set: setIncludeNewDocs },
              ].map((opt) => (
                <label key={opt.label} className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={opt.checked} onChange={(e) => opt.set(e.target.checked)}
                    className="w-4 h-4 rounded border-border accent-[#d4af37]" />
                  <span className="text-sm text-muted-foreground">{opt.label}</span>
                </label>
              ))}
            </div>
            <button onClick={handleSave} disabled={updateDigest.isPending}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#d4af37]/15 border border-[#d4af37]/40 rounded-lg text-sm font-medium text-[#d4af37] hover:bg-[#d4af37]/25 disabled:opacity-50 transition-colors">
              {saved ? <><CheckCircle className="w-4 h-4" /> Saved!</> : updateDigest.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4" /> Save Settings</>}
            </button>
            <p className="text-[11px] text-muted-foreground text-center">
              Email digests will be sent to the site owner at the configured frequency. Feature coming soon — configuration saved for when email delivery is enabled.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

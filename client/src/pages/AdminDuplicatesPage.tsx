import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Copy, Scan, Check, EyeOff, Loader2 } from 'lucide-react';
import { Link } from 'wouter';

export default function AdminDuplicatesPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const { data: pairs, refetch } = trpc.duplicates.pairs.useQuery(undefined, { enabled: isAdmin });
  const scanMut = trpc.duplicates.scan.useMutation({
    onSuccess: (r) => { refetch(); toast.success(`Found ${r.found} potential duplicate pairs`); },
    onError: () => toast.error('Scan failed'),
  });
  const updateMut = trpc.duplicates.updateStatus.useMutation({ onSuccess: () => { refetch(); toast.success('Updated'); } });

  if (!isAdmin) return <div className="p-8 text-center text-muted-foreground">Admin access required</div>;

  const pending = pairs?.filter((p: any) => p.status === 'pending') || [];
  const resolved = pairs?.filter((p: any) => p.status !== 'pending') || [];

  return (
    <div className="container max-w-4xl py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Copy className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">Duplicate Content Detector</h1>
            <p className="text-muted-foreground">Scan documents for similar content and flag duplicates</p>
          </div>
        </div>
        <Button onClick={() => scanMut.mutate()} disabled={scanMut.isPending}>
          {scanMut.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Scan className="w-4 h-4 mr-2" />}
          Run Scan
        </Button>
      </div>

      {pending.length > 0 && (
        <Card className="mb-6">
          <CardHeader><CardTitle className="text-lg">Potential Duplicates ({pending.length})</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pending.map((p: any) => (
                <div key={p.id} className="bg-muted/30 rounded-lg p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Link href={`/documents/${p.slug1}`} className="text-sm font-medium hover:text-primary">{p.title1}</Link>
                        <span className="text-muted-foreground">&harr;</span>
                        <Link href={`/documents/${p.slug2}`} className="text-sm font-medium hover:text-primary">{p.title2}</Link>
                      </div>
                      <Badge variant="outline" className="text-xs">{p.similarityScore}% similar</Badge>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <Button size="sm" variant="outline" onClick={() => updateMut.mutate({ id: p.id, status: 'resolved' })}>
                        <Check className="w-3.5 h-3.5 mr-1" /> Resolved
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => updateMut.mutate({ id: p.id, status: 'ignored' })}>
                        <EyeOff className="w-3.5 h-3.5 mr-1" /> Ignore
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {resolved.length > 0 && (
        <Card>
          <CardHeader><CardTitle className="text-lg text-muted-foreground">Resolved ({resolved.length})</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              {resolved.map((p: any) => (
                <div key={p.id} className="flex items-center gap-3 text-sm opacity-60">
                  <Badge variant="secondary">{p.status}</Badge>
                  <span>{p.title1} &harr; {p.title2}</span>
                  <span className="text-muted-foreground">({p.similarityScore}%)</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {(!pairs || pairs.length === 0) && !scanMut.isPending && (
        <div className="text-center py-16 text-muted-foreground">
          <Copy className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p>No duplicates detected yet. Click "Run Scan" to check for similar content.</p>
        </div>
      )}
    </div>
  );
}

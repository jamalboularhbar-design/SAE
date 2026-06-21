import { useState, useEffect } from 'react';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Archive, RotateCcw, Settings, AlertTriangle } from 'lucide-react';
import { Link } from 'wouter';

export default function AdminArchivalPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [days, setDays] = useState(90);
  const [enabled, setEnabled] = useState(false);

  const { data: policy } = trpc.archival.policy.useQuery(undefined, { enabled: isAdmin });
  useEffect(() => { if (policy) { setDays(policy.daysWithoutViews); setEnabled(!!policy.enabled); } }, [policy]);
  const { data: staleDocs } = trpc.archival.staleDocs.useQuery({ days }, { enabled: isAdmin });
  const { data: archived, refetch: refetchArchived } = trpc.archival.archived.useQuery(undefined, { enabled: isAdmin });

  const updatePolicyMut = trpc.archival.updatePolicy.useMutation({ onSuccess: () => toast.success('Policy updated') });
  const archiveMut = trpc.archival.archive.useMutation({ onSuccess: () => { refetchArchived(); toast.success('Document archived'); } });
  const unarchiveMut = trpc.archival.unarchive.useMutation({ onSuccess: () => { refetchArchived(); toast.success('Document restored'); } });

  if (!isAdmin) return <div className="p-8 text-center text-muted-foreground">Admin access required</div>;

  return (
    <div className="container max-w-4xl py-8">
      <div className="flex items-center gap-3 mb-8">
        <Archive className="w-8 h-8 text-primary" />
        <div>
          <h1 className="text-2xl font-bold">Document Archival</h1>
          <p className="text-muted-foreground">Auto-archive stale documents and manage archived content</p>
        </div>
      </div>

      {/* Policy Settings */}
      <Card className="mb-6">
        <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Settings className="w-5 h-5" /> Archival Policy</CardTitle></CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <label className="text-sm">Archive docs not updated in</label>
            <Input type="number" value={days} onChange={e => setDays(Number(e.target.value))} className="w-24" min={1} />
            <span className="text-sm text-muted-foreground">days</span>
            <label className="flex items-center gap-2 ml-4">
              <input type="checkbox" checked={enabled} onChange={e => setEnabled(e.target.checked)} className="rounded" />
              <span className="text-sm">Enabled</span>
            </label>
          </div>
          <Button size="sm" onClick={() => updatePolicyMut.mutate({ daysWithoutViews: days, enabled })}>
            Save Policy
          </Button>
        </CardContent>
      </Card>

      {/* Stale Documents */}
      <Card className="mb-6">
        <CardHeader><CardTitle className="text-lg flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-amber-500" /> Stale Documents ({staleDocs?.length || 0})</CardTitle></CardHeader>
        <CardContent>
          {staleDocs && staleDocs.length > 0 ? (
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {staleDocs.map((d: any) => (
                <div key={d.id} className="flex items-center justify-between bg-muted/30 rounded px-3 py-2">
                  <div>
                    <Link href={`/documents/${d.slug}`} className="text-sm font-medium hover:text-primary">{d.title}</Link>
                    <p className="text-xs text-muted-foreground">{d.category} &middot; {d.viewCount} views &middot; Updated {new Date(d.updatedAt).toLocaleDateString()}</p>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => archiveMut.mutate({ documentId: d.id, reason: 'stale' })}>
                    <Archive className="w-3.5 h-3.5 mr-1" /> Archive
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No stale documents found for the current threshold.</p>
          )}
        </CardContent>
      </Card>

      {/* Archived Documents */}
      <Card>
        <CardHeader><CardTitle className="text-lg">Archived Documents ({archived?.length || 0})</CardTitle></CardHeader>
        <CardContent>
          {archived && archived.length > 0 ? (
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {archived.map((a: any) => (
                <div key={a.id} className="flex items-center justify-between bg-muted/30 rounded px-3 py-2">
                  <div>
                    <span className="text-sm font-medium">{a.title}</span>
                    <p className="text-xs text-muted-foreground">{a.category} &middot; Archived {new Date(a.archivedAt).toLocaleDateString()} &middot; <Badge variant="outline" className="text-xs">{a.reason}</Badge></p>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => unarchiveMut.mutate({ archiveId: a.id })}>
                    <RotateCcw className="w-3.5 h-3.5 mr-1" /> Restore
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No archived documents.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

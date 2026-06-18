import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Camera, Eye, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  documentId: number;
  currentTitle: string;
  currentContent: string;
}

export default function DocumentSnapshots({ documentId, currentTitle, currentContent }: Props) {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [name, setName] = useState('');
  const [expanded, setExpanded] = useState(false);
  const [viewingId, setViewingId] = useState<number | null>(null);

  const { data: snapshots, refetch } = trpc.snapshots.list.useQuery({ documentId });
  const { data: viewingSnapshot } = trpc.snapshots.get.useQuery({ id: viewingId! }, { enabled: !!viewingId });
  const createMutation = trpc.snapshots.create.useMutation({
    onSuccess: () => { toast.success('Snapshot created'); setName(''); refetch(); },
    onError: () => toast.error('Failed to create snapshot'),
  });

  if (!snapshots || snapshots.length === 0) {
    if (!isAdmin) return null;
  }

  return (
    <Card className="bg-card/80 border-border/50 mt-4">
      <CardHeader className="pb-2 cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <CardTitle className="text-sm flex items-center gap-2">
          <Camera className="w-4 h-4" />
          Snapshots
          {snapshots && snapshots.length > 0 && <Badge variant="secondary" className="text-xs">{snapshots.length}</Badge>}
          {expanded ? <ChevronUp className="w-4 h-4 ml-auto" /> : <ChevronDown className="w-4 h-4 ml-auto" />}
        </CardTitle>
      </CardHeader>
      {expanded && (
        <CardContent className="pt-0">
          {isAdmin && (
            <div className="flex gap-2 mb-3">
              <Input
                placeholder="Snapshot name (e.g. v1.0 Release)"
                value={name}
                onChange={e => setName(e.target.value)}
                className="text-sm"
              />
              <Button
                size="sm"
                disabled={!name.trim() || createMutation.isPending}
                onClick={() => createMutation.mutate({ documentId, name: name.trim(), title: currentTitle, content: currentContent || '' })}
              >
                {createMutation.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Camera className="w-3 h-3" />}
              </Button>
            </div>
          )}
          <div className="space-y-2">
            {snapshots?.map(s => (
              <div key={s.id} className="flex items-center justify-between py-1.5 px-2 rounded hover:bg-accent/20 text-sm">
                <div>
                  <span className="font-medium">{s.name}</span>
                  <span className="text-xs text-muted-foreground ml-2">{new Date(s.createdAt).toLocaleDateString()}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setViewingId(viewingId === s.id ? null : s.id)}>
                  <Eye className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
          {viewingSnapshot && (
            <div className="mt-3 p-3 rounded bg-muted/30 border border-border/50">
              <div className="text-xs text-muted-foreground mb-1">Snapshot: {viewingSnapshot.name}</div>
              <div className="text-sm font-medium mb-2">{viewingSnapshot.title}</div>
              <pre className="text-xs whitespace-pre-wrap max-h-60 overflow-y-auto">{viewingSnapshot.content?.slice(0, 2000)}{(viewingSnapshot.content?.length || 0) > 2000 ? '...' : ''}</pre>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}

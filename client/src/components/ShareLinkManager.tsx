import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Link2, Copy, Trash2, Clock, Plus } from 'lucide-react';

interface ShareLinkManagerProps {
  documentSlug: string;
}

export default function ShareLinkManager({ documentSlug }: ShareLinkManagerProps) {
  const { user } = useAuth();
  const [hours, setHours] = useState(24);
  const [copied, setCopied] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const { data: links, refetch } = trpc.shareLinks.listForDoc.useQuery(
    { documentSlug },
    { enabled: user?.role === 'admin' }
  );
  const createMutation = trpc.shareLinks.create.useMutation({ onSuccess: () => refetch() });
  const deleteMutation = trpc.shareLinks.delete.useMutation({ onSuccess: () => refetch() });

  if (user?.role !== 'admin') return null;

  if (!open) {
    return (
      <div className="flex justify-end py-1">
        <button onClick={() => setOpen(true)} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-accent transition-colors" title="Manage expiring share links">
          <Link2 className="w-3 h-3" /> Share links
        </button>
      </div>
    );
  }

  const copyLink = (token: string) => {
    const url = `${window.location.origin}/share/${token}`;
    navigator.clipboard.writeText(url);
    setCopied(token);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="border border-border/50 rounded-lg p-4 mt-4">
      <div className="flex items-center gap-2 mb-3">
        <Link2 className="w-4 h-4 text-accent" />
        <h4 className="text-sm font-medium">Expiring Share Links</h4>
      <button onClick={() => setOpen(false)} className="ml-auto text-xs text-muted-foreground hover:text-foreground transition-colors">Hide</button>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <Input
          type="number"
          min={1}
          max={720}
          value={hours}
          onChange={(e) => setHours(Number(e.target.value))}
          className="w-24 text-sm"
        />
        <span className="text-xs text-muted-foreground">hours</span>
        <Button
          size="sm"
          onClick={() => createMutation.mutate({ documentSlug, expiresInHours: hours })}
          disabled={createMutation.isPending}
        >
          <Plus className="w-3 h-3 mr-1" /> Generate Link
        </Button>
      </div>

      {links && links.length > 0 && (
        <div className="space-y-2">
          {links.map((link) => {
            const expired = new Date(link.expiresAt) < new Date();
            return (
              <div key={link.id} className="flex items-center gap-2 text-xs p-2 rounded bg-card/50 border border-border/30">
                <code className="flex-1 truncate text-muted-foreground">
                  /share/{link.token.slice(0, 12)}...
                </code>
                <Badge variant={expired ? 'destructive' : 'secondary'} className="text-[10px]">
                  {expired ? 'expired' : <><Clock className="w-3 h-3 mr-0.5 inline" />{new Date(link.expiresAt).toLocaleDateString()}</>}
                </Badge>
                <span className="text-muted-foreground">{link.accessCount} views</span>
                {!expired && (
                  <Button size="sm" variant="ghost" onClick={() => copyLink(link.token)} className="h-6 px-2">
                    {copied === link.token ? 'Copied!' : <Copy className="w-3 h-3" />}
                  </Button>
                )}
                <Button size="sm" variant="ghost" onClick={() => deleteMutation.mutate({ id: link.id })} className="h-6 px-2 text-destructive hover:text-destructive">
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

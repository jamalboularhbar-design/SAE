import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Webhook, Plus, Trash2, ToggleLeft, ToggleRight, Loader2 } from 'lucide-react';

const EVENT_TYPES = ['document.created', 'document.updated', 'document.deleted', 'document.published', 'document.archived', 'comment.created', '*'];

export default function AdminWebhooksPage() {
  const { data: hooks, isLoading } = trpc.webhooks.list.useQuery();
  const createMutation = trpc.webhooks.create.useMutation();
  const updateMutation = trpc.webhooks.update.useMutation();
  const deleteMutation = trpc.webhooks.delete.useMutation();
  const utils = trpc.useUtils();

  const [showForm, setShowForm] = useState(false);
  const [url, setUrl] = useState('');
  const [secret, setSecret] = useState('');
  const [selectedEvents, setSelectedEvents] = useState<string[]>(['*']);

  const handleCreate = async () => {
    if (!url.trim()) return;
    await createMutation.mutateAsync({ url: url.trim(), events: selectedEvents, secret: secret || undefined });
    setUrl('');
    setSecret('');
    setSelectedEvents(['*']);
    setShowForm(false);
    utils.webhooks.list.invalidate();
  };

  const handleToggle = async (id: number, currentActive: number) => {
    await updateMutation.mutateAsync({ id, active: currentActive === 0 });
    utils.webhooks.list.invalidate();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this webhook?')) return;
    await deleteMutation.mutateAsync({ id });
    utils.webhooks.list.invalidate();
  };

  const toggleEvent = (event: string) => {
    setSelectedEvents(prev => prev.includes(event) ? prev.filter(e => e !== event) : [...prev, event]);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Webhook className="w-6 h-6 text-accent" />
            <h1 className="text-2xl font-bold text-foreground">Webhooks</h1>
          </div>
          <Button onClick={() => setShowForm(!showForm)} size="sm">
            <Plus className="w-4 h-4 mr-1" /> Add Webhook
          </Button>
        </div>

        {showForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-sm">New Webhook</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/webhook"
                className="w-full px-3 py-2 rounded-lg bg-card border border-border text-foreground text-sm"
              />
              <input
                type="text"
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
                placeholder="Secret (optional)"
                className="w-full px-3 py-2 rounded-lg bg-card border border-border text-foreground text-sm"
              />
              <div className="flex flex-wrap gap-2">
                {EVENT_TYPES.map(event => (
                  <button
                    key={event}
                    onClick={() => toggleEvent(event)}
                    className={`px-2 py-1 rounded text-xs border transition-colors ${
                      selectedEvents.includes(event)
                        ? 'bg-accent text-white border-accent'
                        : 'bg-card text-muted-foreground border-border hover:border-accent/50'
                    }`}
                  >
                    {event}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={handleCreate} disabled={!url.trim() || createMutation.isPending}>
                  Create
                </Button>
                <Button size="sm" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="space-y-3">
          {(hooks || []).map((hook: any) => (
            <Card key={hook.id}>
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-mono text-foreground truncate">{hook.url}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs px-1.5 py-0.5 rounded ${hook.active ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                        {hook.active ? 'Active' : 'Inactive'}
                      </span>
                      {hook.failCount > 0 && (
                        <span className="text-xs text-red-400">{hook.failCount} failures</span>
                      )}
                      <span className="text-xs text-muted-foreground">
                        Events: {(() => { try { return JSON.parse(hook.events).join(', '); } catch { return hook.events; } })()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <button onClick={() => handleToggle(hook.id, hook.active)} className="text-muted-foreground hover:text-accent transition-colors">
                      {hook.active ? <ToggleRight className="w-5 h-5 text-green-500" /> : <ToggleLeft className="w-5 h-5" />}
                    </button>
                    <button onClick={() => handleDelete(hook.id)} className="text-muted-foreground hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {(!hooks || hooks.length === 0) && (
            <p className="text-center text-muted-foreground py-8">No webhooks configured yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

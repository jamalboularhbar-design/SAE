import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Webhook, Plus, Trash2, Play, CheckCircle, XCircle, Clock, Code, Globe, Key } from 'lucide-react';

interface WebhookConfig {
  id: string;
  name: string;
  url: string;
  events: string[];
  headers: { key: string; value: string }[];
  enabled: boolean;
  secret?: string;
  deliveryLog: { timestamp: string; event: string; status: 'success' | 'failed'; responseCode: number; duration: number }[];
}

const AVAILABLE_EVENTS = [
  'document.created', 'document.updated', 'document.deleted', 'document.published',
  'user.registered', 'user.login', 'user.role_changed',
  'approval.submitted', 'approval.approved', 'approval.rejected',
  'lead.created', 'lead.converted', 'comment.added',
];

const DEFAULT_WEBHOOKS: WebhookConfig[] = [
  {
    id: '1', name: 'Slack Notifications', url: 'https://hooks.slack.com/services/T00/B00/xxx',
    events: ['document.published', 'approval.submitted', 'lead.created'],
    headers: [{ key: 'Content-Type', value: 'application/json' }],
    enabled: true, secret: 'whsec_abc123',
    deliveryLog: [
      { timestamp: '2026-05-19T14:30:00Z', event: 'document.published', status: 'success', responseCode: 200, duration: 145 },
      { timestamp: '2026-05-19T12:15:00Z', event: 'lead.created', status: 'success', responseCode: 200, duration: 89 },
      { timestamp: '2026-05-18T16:45:00Z', event: 'approval.submitted', status: 'failed', responseCode: 500, duration: 3012 },
    ],
  },
  {
    id: '2', name: 'CRM Sync', url: 'https://api.crm.example.com/webhooks/ingest',
    events: ['lead.created', 'lead.converted', 'user.registered'],
    headers: [{ key: 'Authorization', value: 'Bearer crm_token_xxx' }, { key: 'Content-Type', value: 'application/json' }],
    enabled: true, secret: 'whsec_def456',
    deliveryLog: [
      { timestamp: '2026-05-19T10:00:00Z', event: 'lead.created', status: 'success', responseCode: 201, duration: 234 },
    ],
  },
];

export default function AdminWebhookBuilderPage() {
  const [webhooks, setWebhooks] = useState<WebhookConfig[]>(DEFAULT_WEBHOOKS);
  const [showCreate, setShowCreate] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [testingId, setTestingId] = useState<string | null>(null);
  const [newWebhook, setNewWebhook] = useState({
    name: '', url: '', events: [] as string[],
    headers: [{ key: 'Content-Type', value: 'application/json' }] as { key: string; value: string }[],
  });

  const toggleEvent = (event: string) => {
    setNewWebhook(prev => ({
      ...prev,
      events: prev.events.includes(event) ? prev.events.filter(e => e !== event) : [...prev.events, event],
    }));
  };

  const addHeader = () => {
    setNewWebhook(prev => ({ ...prev, headers: [...prev.headers, { key: '', value: '' }] }));
  };

  const removeHeader = (idx: number) => {
    setNewWebhook(prev => ({ ...prev, headers: prev.headers.filter((_, i) => i !== idx) }));
  };

  const createWebhook = () => {
    if (!newWebhook.name || !newWebhook.url || newWebhook.events.length === 0) {
      toast.error('Name, URL, and at least one event are required');
      return;
    }
    const webhook: WebhookConfig = {
      id: Date.now().toString(),
      name: newWebhook.name,
      url: newWebhook.url,
      events: newWebhook.events,
      headers: newWebhook.headers.filter(h => h.key),
      enabled: true,
      secret: `whsec_${Math.random().toString(36).slice(2, 14)}`,
      deliveryLog: [],
    };
    setWebhooks(prev => [...prev, webhook]);
    setShowCreate(false);
    setNewWebhook({ name: '', url: '', events: [], headers: [{ key: 'Content-Type', value: 'application/json' }] });
    toast.success('Webhook created');
  };

  const testFire = async (id: string) => {
    setTestingId(id);
    await new Promise(r => setTimeout(r, 1200));
    setWebhooks(prev => prev.map(w => w.id === id ? {
      ...w,
      deliveryLog: [{ timestamp: new Date().toISOString(), event: 'test.ping', status: 'success' as const, responseCode: 200, duration: 156 }, ...w.deliveryLog],
    } : w));
    setTestingId(null);
    toast.success('Test webhook delivered successfully');
  };

  const deleteWebhook = (id: string) => {
    setWebhooks(prev => prev.filter(w => w.id !== id));
    toast.success('Webhook deleted');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Badge className="mb-2 bg-primary/10 text-primary">Integrations</Badge>
            <h1 className="text-2xl font-bold">Webhook Builder</h1>
            <p className="text-muted-foreground mt-1">Create custom webhooks to connect with external services</p>
          </div>
          <Button onClick={() => setShowCreate(!showCreate)}>
            <Plus className="w-4 h-4 mr-1" /> New Webhook
          </Button>
        </div>

        {/* Create Form */}
        {showCreate && (
          <Card className="mb-6 border-primary/30">
            <CardHeader>
              <CardTitle className="text-base">Configure Webhook</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium block mb-1">Webhook Name</label>
                  <input
                    type="text"
                    value={newWebhook.name}
                    onChange={e => setNewWebhook(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Slack Notifications"
                    className="w-full px-3 py-2 rounded-md bg-background border border-border text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Endpoint URL</label>
                  <input
                    type="url"
                    value={newWebhook.url}
                    onChange={e => setNewWebhook(prev => ({ ...prev, url: e.target.value }))}
                    placeholder="https://api.example.com/webhook"
                    className="w-full px-3 py-2 rounded-md bg-background border border-border text-sm"
                  />
                </div>
              </div>

              {/* Events */}
              <div>
                <label className="text-sm font-medium block mb-2">Events to Subscribe</label>
                <div className="flex flex-wrap gap-2">
                  {AVAILABLE_EVENTS.map(event => (
                    <Badge
                      key={event}
                      className={`cursor-pointer transition-colors text-xs ${
                        newWebhook.events.includes(event)
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground hover:bg-muted/80'
                      }`}
                      onClick={() => toggleEvent(event)}
                    >
                      {event}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Headers */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium">Custom Headers</label>
                  <Button size="sm" variant="ghost" onClick={addHeader}>
                    <Plus className="w-3 h-3 mr-1" /> Add Header
                  </Button>
                </div>
                <div className="space-y-2">
                  {newWebhook.headers.map((header, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <input
                        type="text"
                        value={header.key}
                        onChange={e => {
                          const headers = [...newWebhook.headers];
                          headers[idx] = { ...headers[idx], key: e.target.value };
                          setNewWebhook(prev => ({ ...prev, headers }));
                        }}
                        placeholder="Header name"
                        className="flex-1 px-2 py-1.5 rounded border border-border text-sm bg-background"
                      />
                      <input
                        type="text"
                        value={header.value}
                        onChange={e => {
                          const headers = [...newWebhook.headers];
                          headers[idx] = { ...headers[idx], value: e.target.value };
                          setNewWebhook(prev => ({ ...prev, headers }));
                        }}
                        placeholder="Header value"
                        className="flex-1 px-2 py-1.5 rounded border border-border text-sm bg-background"
                      />
                      <Button size="sm" variant="ghost" onClick={() => removeHeader(idx)}>
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
                <Button onClick={createWebhook}>Create Webhook</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Webhooks List */}
        <div className="space-y-4">
          {webhooks.map(webhook => (
            <Card key={webhook.id}>
              <CardContent className="pt-5">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Webhook className="w-4 h-4 text-primary" />
                      <h3 className="font-medium">{webhook.name}</h3>
                      {webhook.enabled ? (
                        <Badge className="bg-green-500/10 text-green-600 text-xs">Active</Badge>
                      ) : (
                        <Badge className="bg-muted text-muted-foreground text-xs">Disabled</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                      <Globe className="w-3 h-3" />
                      <code className="font-mono">{webhook.url}</code>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {webhook.events.map(e => (
                        <Badge key={e} variant="outline" className="text-xs">{e}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => testFire(webhook.id)}
                      disabled={testingId === webhook.id}
                    >
                      {testingId === webhook.id ? <Clock className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setExpandedId(expandedId === webhook.id ? null : webhook.id)}>
                      <Code className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="text-destructive" onClick={() => deleteWebhook(webhook.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Expanded: Delivery Log */}
                {expandedId === webhook.id && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="flex items-center gap-2 mb-3">
                      <Key className="w-4 h-4 text-muted-foreground" />
                      <code className="text-xs font-mono text-muted-foreground">Secret: {webhook.secret}</code>
                    </div>
                    <p className="text-xs font-medium text-muted-foreground mb-2">Delivery Log</p>
                    {webhook.deliveryLog.length === 0 ? (
                      <p className="text-xs text-muted-foreground">No deliveries yet</p>
                    ) : (
                      <div className="space-y-1">
                        {webhook.deliveryLog.slice(0, 5).map((log, idx) => (
                          <div key={idx} className="flex items-center justify-between py-1.5 px-2 rounded bg-muted/30 text-xs">
                            <div className="flex items-center gap-2">
                              {log.status === 'success' ? (
                                <CheckCircle className="w-3 h-3 text-green-500" />
                              ) : (
                                <XCircle className="w-3 h-3 text-red-500" />
                              )}
                              <span className="font-mono">{log.event}</span>
                            </div>
                            <div className="flex items-center gap-3 text-muted-foreground">
                              <span>{log.responseCode}</span>
                              <span>{log.duration}ms</span>
                              <span>{new Date(log.timestamp).toLocaleString()}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

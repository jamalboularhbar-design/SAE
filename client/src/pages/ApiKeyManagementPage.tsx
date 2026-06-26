import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Key, Plus, Copy, Trash2, Shield, Clock, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

const availableScopes = [
  { value: 'read:documents', label: 'Read Documents' },
  { value: 'write:documents', label: 'Write Documents' },
  { value: 'ai:summarize', label: 'AI Summarize' },
  { value: 'ai:write', label: 'AI Write' },
  { value: 'ai:search', label: 'AI Search' },
  { value: 'admin:users', label: 'Admin: Users' },
  { value: 'admin:config', label: 'Admin: Config' },
];

export default function ApiKeyManagementPage() {

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyExpiry, setNewKeyExpiry] = useState('90');
  const [selectedScopes, setSelectedScopes] = useState<string[]>(['read:documents']);
  const [createdKey, setCreatedKey] = useState<string | null>(null);
  const [showKey, setShowKey] = useState(false);

  const { data: keys, refetch } = trpc.apiKeyManager.list.useQuery();
  const createMutation = trpc.apiKeyManager.create.useMutation();
  const revokeMutation = trpc.apiKeyManager.revoke.useMutation();

  const handleCreate = async () => {
    if (!newKeyName.trim()) {
      toast.error('Name required');
      return;
    }
    try {
      const result = await createMutation.mutateAsync({
        name: newKeyName,
        scopes: selectedScopes,
        expiresInDays: parseInt(newKeyExpiry),
      });
      setCreatedKey(result.key);
      toast.success('API Key Created — copy the key now, it won\'t be shown again.');
      refetch();
    } catch {
      toast.error('Failed to create key');
    }
  };

  const handleRevoke = async (keyId: number) => {
    try {
      await revokeMutation.mutateAsync({ keyId });
      toast.success('Key revoked');
      refetch();
    } catch {
      toast.error('Failed to revoke key');
    }
  };

  const handleCopyKey = () => {
    if (createdKey) {
      navigator.clipboard.writeText(createdKey);
      toast.success('Copied to clipboard');
    }
  };

  const toggleScope = (scope: string) => {
    setSelectedScopes(prev =>
      prev.includes(scope) ? prev.filter(s => s !== scope) : [...prev, scope]
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20">
              <Key className="h-7 w-7 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">API Key Management</h1>
              <p className="text-sm text-muted-foreground">Create and manage API keys for programmatic access</p>
            </div>
          </div>
          <Dialog open={showCreateDialog} onOpenChange={(open) => { setShowCreateDialog(open); if (!open) { setCreatedKey(null); setNewKeyName(''); setSelectedScopes(['read:documents']); } }}>
            <DialogTrigger asChild>
              <Button className="gap-2"><Plus className="h-4 w-4" /> Create Key</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{createdKey ? 'Key Created Successfully' : 'Create New API Key'}</DialogTitle>
                <DialogDescription>
                  {createdKey ? 'Copy this key now. It will not be shown again.' : 'Configure your new API key with a name, scopes, and expiration.'}
                </DialogDescription>
              </DialogHeader>
              {createdKey ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                    <code className="flex-1 text-xs font-mono text-foreground break-all">
                      {showKey ? createdKey : createdKey.substring(0, 10) + '•'.repeat(30)}
                    </code>
                    <Button variant="ghost" size="sm" onClick={() => setShowKey(!showKey)}>
                      {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={handleCopyKey}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-amber-400">
                    <AlertTriangle className="h-3 w-3" />
                    <span>Store this key securely. It cannot be retrieved later.</span>
                  </div>
                  <Button onClick={() => setShowCreateDialog(false)} className="w-full">Done</Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Key Name</label>
                    <Input placeholder="e.g., Production API, CI/CD Pipeline" value={newKeyName} onChange={e => setNewKeyName(e.target.value)} />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Expiration</label>
                    <Select value={newKeyExpiry} onValueChange={setNewKeyExpiry}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30 days</SelectItem>
                        <SelectItem value="90">90 days</SelectItem>
                        <SelectItem value="180">180 days</SelectItem>
                        <SelectItem value="365">1 year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Scopes</label>
                    <div className="flex flex-wrap gap-2">
                      {availableScopes.map(scope => (
                        <Badge
                          key={scope.value}
                          variant={selectedScopes.includes(scope.value) ? 'default' : 'outline'}
                          className="cursor-pointer text-xs"
                          onClick={() => toggleScope(scope.value)}
                        >
                          {scope.label}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Button onClick={handleCreate} disabled={createMutation.isPending} className="w-full">
                    {createMutation.isPending ? 'Creating...' : 'Create API Key'}
                  </Button>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>

        {/* Keys List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Your API Keys</CardTitle>
            <CardDescription>Manage active and revoked keys</CardDescription>
          </CardHeader>
          <CardContent>
            {!keys || keys.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Key className="h-10 w-10 mx-auto mb-3 opacity-50" />
                <p className="text-sm">No API keys yet. Create one to get started.</p>
              </div>
            ) : (
              <div className="space-y-3">
               {keys.map((key: any) => (
                  <div key={key.id} className={`flex items-center gap-4 p-4 rounded-lg border ${key.isRevoked ? 'border-border/50 opacity-60' : 'border-border'}`}>
                    <div className="p-2 rounded-md bg-muted">
                      <Shield className={`h-4 w-4 ${key.isRevoked ? 'text-muted-foreground' : 'text-cyan-400'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-foreground">{key.name}</span>
                        {key.isRevoked ? (
                          <Badge variant="destructive" className="text-xs">Revoked</Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs">Active</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                        <code>{key.keyPrefix}...•••</code>
                        <span>{key.totalRequests} requests</span>
                        {key.expiresAt && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Expires {new Date(key.expiresAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {key.scopes.map((scope: string) => (
                          <Badge key={scope} variant="secondary" className="text-xs">{scope}</Badge>
                        ))}
                      </div>
                    </div>
                    {!key.isRevoked && (
                      <Button variant="ghost" size="sm" onClick={() => handleRevoke(key.id)} className="text-destructive hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

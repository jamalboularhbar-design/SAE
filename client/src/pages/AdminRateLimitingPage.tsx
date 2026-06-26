import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Shield, Activity, AlertTriangle, Settings, Save, RotateCcw } from 'lucide-react';

interface RateLimitRule {
  id: string;
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'ALL';
  limit: number;
  window: number; // seconds
  currentUsage: number;
  enabled: boolean;
  burstLimit?: number;
}

const DEFAULT_RULES: RateLimitRule[] = [
  { id: '1', endpoint: '/api/trpc/documents.*', method: 'GET', limit: 100, window: 60, currentUsage: 42, enabled: true, burstLimit: 150 },
  { id: '2', endpoint: '/api/trpc/documents.create', method: 'POST', limit: 20, window: 60, currentUsage: 3, enabled: true, burstLimit: 30 },
  { id: '3', endpoint: '/api/trpc/auth.*', method: 'ALL', limit: 10, window: 60, currentUsage: 1, enabled: true, burstLimit: 15 },
  { id: '4', endpoint: '/api/trpc/search.*', method: 'GET', limit: 50, window: 60, currentUsage: 28, enabled: true, burstLimit: 80 },
  { id: '5', endpoint: '/api/trpc/leads.*', method: 'POST', limit: 30, window: 60, currentUsage: 7, enabled: true, burstLimit: 45 },
  { id: '6', endpoint: '/api/trpc/analytics.*', method: 'GET', limit: 200, window: 60, currentUsage: 156, enabled: true, burstLimit: 300 },
  { id: '7', endpoint: '/api/trpc/*.delete', method: 'DELETE', limit: 5, window: 60, currentUsage: 0, enabled: true, burstLimit: 10 },
  { id: '8', endpoint: '/api/trpc/llm.*', method: 'POST', limit: 10, window: 300, currentUsage: 4, enabled: true, burstLimit: 15 },
];

export default function AdminRateLimitingPage() {
  const [rules, setRules] = useState<RateLimitRule[]>(DEFAULT_RULES);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [globalEnabled, setGlobalEnabled] = useState(true);

  const getUsagePercent = (rule: RateLimitRule) => Math.round((rule.currentUsage / rule.limit) * 100);
  const getUsageColor = (percent: number) => {
    if (percent >= 90) return 'bg-red-500';
    if (percent >= 70) return 'bg-amber-500';
    return 'bg-green-500';
  };

  const updateRule = (id: string, field: keyof RateLimitRule, value: number | boolean) => {
    setRules(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const handleSave = () => {
    toast.success('Rate limiting configuration saved');
    setEditingId(null);
  };

  const handleReset = () => {
    setRules(DEFAULT_RULES);
    toast.success('Configuration reset to defaults');
  };

  const totalRequests = rules.reduce((sum, r) => sum + r.currentUsage, 0);
  const throttledEndpoints = rules.filter(r => getUsagePercent(r) >= 90).length;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Badge className="mb-2 bg-primary/10 text-primary">API Security</Badge>
            <h1 className="text-2xl font-bold">Rate Limiting</h1>
            <p className="text-muted-foreground mt-1">Configure per-endpoint rate limits and monitor usage</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={handleReset}>
              <RotateCcw className="w-4 h-4 mr-1" /> Reset
            </Button>
            <Button size="sm" onClick={handleSave}>
              <Save className="w-4 h-4 mr-1" /> Save Config
            </Button>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-5">
              <p className="text-xs text-muted-foreground">Total Requests/min</p>
              <p className="text-2xl font-bold mt-1">{totalRequests}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-5">
              <p className="text-xs text-muted-foreground">Active Rules</p>
              <p className="text-2xl font-bold mt-1">{rules.filter(r => r.enabled).length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-5">
              <p className="text-xs text-muted-foreground">Near Limit</p>
              <p className="text-2xl font-bold mt-1 text-amber-500">{throttledEndpoints}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-5">
              <p className="text-xs text-muted-foreground">Global Status</p>
              <div className="flex items-center gap-2 mt-1">
                <div className={`w-3 h-3 rounded-full ${globalEnabled ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-sm font-medium">{globalEnabled ? 'Enforcing' : 'Disabled'}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Global Toggle */}
        <Card className="mb-6">
          <CardContent className="pt-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium text-sm">Global Rate Limiting</p>
                  <p className="text-xs text-muted-foreground">Enable or disable all rate limiting rules</p>
                </div>
              </div>
              <Button
                variant={globalEnabled ? 'default' : 'outline'}
                size="sm"
                onClick={() => { setGlobalEnabled(!globalEnabled); toast.success(globalEnabled ? 'Rate limiting disabled' : 'Rate limiting enabled'); }}
              >
                {globalEnabled ? 'Enabled' : 'Disabled'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Rules Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Activity className="w-4 h-4" /> Endpoint Rules
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {rules.map(rule => {
                const percent = getUsagePercent(rule);
                return (
                  <div key={rule.id} className={`p-4 rounded-lg border border-border ${!rule.enabled ? 'opacity-50' : ''}`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="text-xs font-mono">{rule.method}</Badge>
                        <code className="text-sm font-mono">{rule.endpoint}</code>
                        {percent >= 90 && <AlertTriangle className="w-4 h-4 text-red-500" />}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setEditingId(editingId === rule.id ? null : rule.id)}
                        >
                          <Settings className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant={rule.enabled ? 'default' : 'outline'}
                          className="text-xs h-7"
                          onClick={() => updateRule(rule.id, 'enabled', !rule.enabled)}
                        >
                          {rule.enabled ? 'On' : 'Off'}
                        </Button>
                      </div>
                    </div>

                    {/* Usage Bar */}
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${getUsageColor(percent)}`}
                          style={{ width: `${Math.min(percent, 100)}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground w-24 text-right">
                        {rule.currentUsage}/{rule.limit} ({percent}%)
                      </span>
                    </div>

                    {/* Edit Panel */}
                    {editingId === rule.id && (
                      <div className="mt-3 pt-3 border-t border-border grid grid-cols-3 gap-3">
                        <div>
                          <label className="text-xs text-muted-foreground block mb-1">Limit (req/window)</label>
                          <input
                            type="number"
                            value={rule.limit}
                            onChange={e => updateRule(rule.id, 'limit', parseInt(e.target.value) || 0)}
                            className="w-full px-2 py-1 rounded border border-border text-sm bg-background"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground block mb-1">Window (seconds)</label>
                          <input
                            type="number"
                            value={rule.window}
                            onChange={e => updateRule(rule.id, 'window', parseInt(e.target.value) || 60)}
                            className="w-full px-2 py-1 rounded border border-border text-sm bg-background"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground block mb-1">Burst Limit</label>
                          <input
                            type="number"
                            value={rule.burstLimit || 0}
                            onChange={e => updateRule(rule.id, 'burstLimit', parseInt(e.target.value) || 0)}
                            className="w-full px-2 py-1 rounded border border-border text-sm bg-background"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

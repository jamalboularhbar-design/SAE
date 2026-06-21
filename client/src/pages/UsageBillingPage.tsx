import { useState, useMemo } from 'react';
import { useAuth } from '@/_core/hooks/useAuth';
import { trpc } from '@/lib/trpc';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreditCard, BarChart3, Zap, TrendingUp, Calendar, Download, AlertTriangle } from 'lucide-react';

interface UsageMetric {
  service: string;
  calls: number;
  tokens: number;
  limit: number;
  cost: number;
}

export default function UsageBillingPage() {
  const { user } = useAuth();
  const { data: aiConfigs } = trpc.aiConfigManager.getAll.useQuery();
  const [billingPeriod, setBillingPeriod] = useState<'current' | 'previous'>('current');

  const usageMetrics: UsageMetric[] = useMemo(() => {
    if (!aiConfigs) return [];
    return aiConfigs.map((config: { serviceName: string; totalCalls: number; totalTokensUsed: number }) => ({
      service: config.serviceName,
      calls: config.totalCalls,
      tokens: config.totalTokensUsed,
      limit: 10000,
      cost: Math.round(config.totalTokensUsed * 0.00003 * 100) / 100,
    }));
  }, [aiConfigs]);

  const totalCalls = usageMetrics.reduce((s, m) => s + m.calls, 0);
  const totalTokens = usageMetrics.reduce((s, m) => s + m.tokens, 0);
  const totalCost = usageMetrics.reduce((s, m) => s + m.cost, 0);
  const avgCallsPerDay = Math.round(totalCalls / 30);

  const planTier = totalCalls > 5000 ? 'Enterprise' : totalCalls > 1000 ? 'Professional' : 'Starter';
  const planColors = { Starter: 'text-blue-400', Professional: 'text-purple-400', Enterprise: 'text-amber-400' };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500/20 to-teal-500/20">
              <CreditCard className="h-7 w-7 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Usage & Billing</h1>
              <p className="text-sm text-muted-foreground">Monitor AI service consumption and manage your subscription</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={`${planColors[planTier as keyof typeof planColors]} border`}>{planTier} Plan</Badge>
            <Button variant="outline" size="sm" className="gap-1">
              <Download className="h-3 w-3" /> Export
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-2 mb-1">
                <Zap className="h-4 w-4 text-amber-400" />
                <span className="text-xs text-muted-foreground">Total API Calls</span>
              </div>
              <div className="text-2xl font-bold text-foreground">{totalCalls.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground mt-1">~{avgCallsPerDay}/day avg</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-2 mb-1">
                <BarChart3 className="h-4 w-4 text-blue-400" />
                <span className="text-xs text-muted-foreground">Tokens Used</span>
              </div>
              <div className="text-2xl font-bold text-foreground">{(totalTokens / 1000).toFixed(1)}K</div>
              <div className="text-xs text-muted-foreground mt-1">This billing period</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="h-4 w-4 text-emerald-400" />
                <span className="text-xs text-muted-foreground">Estimated Cost</span>
              </div>
              <div className="text-2xl font-bold text-foreground">${totalCost.toFixed(2)}</div>
              <div className="text-xs text-muted-foreground mt-1">Based on usage</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="h-4 w-4 text-purple-400" />
                <span className="text-xs text-muted-foreground">Billing Cycle</span>
              </div>
              <div className="text-2xl font-bold text-foreground">12</div>
              <div className="text-xs text-muted-foreground mt-1">Days remaining</div>
            </CardContent>
          </Card>
        </div>

        {/* Usage Breakdown */}
        <Tabs defaultValue="breakdown">
          <TabsList className="mb-4">
            <TabsTrigger value="breakdown">Service Breakdown</TabsTrigger>
            <TabsTrigger value="history">Billing History</TabsTrigger>
            <TabsTrigger value="limits">Rate Limits</TabsTrigger>
          </TabsList>

          <TabsContent value="breakdown">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">AI Service Usage</CardTitle>
                <CardDescription>Consumption by service for the current billing period</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {usageMetrics.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">No usage data available yet.</p>
                  ) : (
                    usageMetrics.map(metric => {
                      const usagePercent = Math.min((metric.calls / metric.limit) * 100, 100);
                      const isNearLimit = usagePercent > 80;
                      return (
                        <div key={metric.service} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-foreground capitalize">{metric.service}</span>
                              {isNearLimit && <AlertTriangle className="h-3 w-3 text-amber-400" />}
                            </div>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span>{metric.calls.toLocaleString()} calls</span>
                              <span>{(metric.tokens / 1000).toFixed(1)}K tokens</span>
                              <span className="font-medium text-foreground">${metric.cost.toFixed(2)}</span>
                            </div>
                          </div>
                          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${isNearLimit ? 'bg-amber-500' : 'bg-primary'}`}
                              style={{ width: `${usagePercent}%` }}
                            />
                          </div>
                          <div className="text-xs text-muted-foreground text-right">
                            {metric.calls.toLocaleString()} / {metric.limit.toLocaleString()} calls ({usagePercent.toFixed(0)}%)
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Billing History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <CreditCard className="h-10 w-10 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">Billing history will appear once Stripe is connected.</p>
                  <p className="text-xs mt-1">Configure payment in Settings → Payment to enable invoicing.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="limits">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Rate Limits by Plan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { plan: 'Starter', calls: '1,000', tokens: '500K', price: '$29/mo' },
                    { plan: 'Professional', calls: '10,000', tokens: '5M', price: '$99/mo' },
                    { plan: 'Enterprise', calls: 'Unlimited', tokens: 'Unlimited', price: 'Custom' },
                  ].map(tier => (
                    <div key={tier.plan} className={`p-4 rounded-lg border ${tier.plan === planTier ? 'border-primary bg-primary/5' : 'border-border'}`}>
                      <div className="text-sm font-medium text-foreground mb-2">{tier.plan}</div>
                      <div className="space-y-1 text-xs text-muted-foreground">
                        <div>API Calls: {tier.calls}/mo</div>
                        <div>Tokens: {tier.tokens}/mo</div>
                        <div className="font-medium text-foreground pt-1">{tier.price}</div>
                      </div>
                      {tier.plan === planTier && <Badge className="mt-2 text-xs">Current Plan</Badge>}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

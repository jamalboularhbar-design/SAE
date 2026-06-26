import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { trpc } from '@/lib/trpc';
import { Link } from 'wouter';
import {
  TrendingUp, Users, Target, BarChart3, ArrowUpRight, ArrowDownRight,
  Zap, Mail, Share2, MousePointerClick
} from 'lucide-react';

export default function AdminGrowthDashboardPage() {
  const { data: trials } = trpc.trials.list.useQuery();
  const { data: leads } = trpc.leads.list.useQuery(undefined);
  const { data: referrals } = trpc.referrals.getStats.useQuery(undefined, { retry: false });

  // Calculate metrics
  const trialsList = trials?.trials || [];
  const totalTrials = trialsList.length;
  const activeTrials = trialsList.filter((t: any) => t.status === 'active').length;
  const convertedTrials = trialsList.filter((t: any) => t.status === 'converted').length;
  const expiredTrials = trialsList.filter((t: any) => t.status === 'expired').length;
  const conversionRate = totalTrials > 0 ? ((convertedTrials / totalTrials) * 100).toFixed(1) : '0';

  const totalLeads = leads?.length || 0;
  const demoRequests = leads?.filter((l: any) => l.source === 'demo_request_form').length || 0;
  const chatEscalations = leads?.filter((l: any) => l.source === 'chat_sales_escalation').length || 0;
  const organicLeads = leads?.filter((l: any) => !l.source || l.source === 'landing_page').length || 0;

  // UTM attribution
  const utmSources: Record<string, number> = {};
  leads?.forEach((l: any) => {
    if (l.utmSource) {
      utmSources[l.utmSource] = (utmSources[l.utmSource] || 0) + 1;
    }
  });
  const topSources = Object.entries(utmSources).sort((a, b) => b[1] - a[1]).slice(0, 5);

  // A/B test data from localStorage
  let abData: Record<string, number> = {};
  try {
    abData = JSON.parse(localStorage.getItem('ab_conversions_hero_cta_v1') || '{}');
  } catch {}
  const abTotal = Object.values(abData).reduce((a, b) => a + b, 0);

  const totalReferrals = referrals?.total || 0;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-primary" />
              Growth Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Consolidated view of trials, leads, referrals, and conversion metrics
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/admin/trials">
              <Badge variant="outline" className="cursor-pointer hover:bg-accent">Trial Manager &rarr;</Badge>
            </Link>
            <Link href="/admin/email-templates">
              <Badge variant="outline" className="cursor-pointer hover:bg-accent">Email Templates &rarr;</Badge>
            </Link>
          </div>
        </div>

        {/* Top KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Total Trials</p>
                  <p className="text-2xl font-bold">{totalTrials}</p>
                </div>
                <Users className="w-8 h-8 text-blue-500/20" />
              </div>
              <div className="flex items-center gap-1 mt-2">
                <Badge variant="outline" className="text-xs">{activeTrials} active</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Conversion Rate</p>
                  <p className="text-2xl font-bold">{conversionRate}%</p>
                </div>
                <Target className="w-8 h-8 text-green-500/20" />
              </div>
              <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                {convertedTrials > 0 ? (
                  <span className="flex items-center text-green-500"><ArrowUpRight className="w-3 h-3" /> {convertedTrials} converted</span>
                ) : (
                  <span>{expiredTrials} expired</span>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Total Leads</p>
                  <p className="text-2xl font-bold">{totalLeads}</p>
                </div>
                <BarChart3 className="w-8 h-8 text-amber-500/20" />
              </div>
              <div className="flex items-center gap-1 mt-2">
                <Badge variant="outline" className="text-xs">{demoRequests} demos</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Referrals</p>
                  <p className="text-2xl font-bold">{totalReferrals}</p>
                </div>
                <Share2 className="w-8 h-8 text-purple-500/20" />
              </div>
              <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                <span>via referral codes</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Trial Funnel */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary" />
                Trial Funnel
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <FunnelBar label="Started Trial" value={totalTrials} max={totalTrials} color="bg-blue-500" />
                <FunnelBar label="Active (in progress)" value={activeTrials} max={totalTrials} color="bg-amber-500" />
                <FunnelBar label="Converted to Paid" value={convertedTrials} max={totalTrials} color="bg-green-500" />
                <FunnelBar label="Expired" value={expiredTrials} max={totalTrials} color="bg-red-500/70" />
              </div>
            </CardContent>
          </Card>

          {/* Lead Sources */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <MousePointerClick className="w-4 h-4 text-primary" />
                Lead Sources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <SourceRow label="Demo Requests" value={demoRequests} icon={<Target className="w-4 h-4" />} />
                <SourceRow label="Chat Escalations" value={chatEscalations} icon={<Mail className="w-4 h-4" />} />
                <SourceRow label="Organic / Landing" value={organicLeads} icon={<TrendingUp className="w-4 h-4" />} />
                <SourceRow label="Referral Program" value={totalReferrals} icon={<Share2 className="w-4 h-4" />} />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* UTM Attribution */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-primary" />
                UTM Source Attribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              {topSources.length > 0 ? (
                <div className="space-y-2">
                  {topSources.map(([source, count]) => (
                    <div key={source} className="flex items-center justify-between">
                      <span className="text-sm">{source}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${(count / totalLeads) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground w-8 text-right">{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No UTM-tagged leads yet. Share links with ?utm_source=... to track.</p>
              )}
            </CardContent>
          </Card>

          {/* A/B Test Results */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <MousePointerClick className="w-4 h-4 text-primary" />
                A/B Test: Hero CTA
              </CardTitle>
            </CardHeader>
            <CardContent>
              {abTotal > 0 ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                    <div>
                      <p className="text-sm font-medium">Variant A: "Start Free Trial"</p>
                      <p className="text-xs text-muted-foreground">{abData['start_trial'] || 0} clicks</p>
                    </div>
                    <Badge variant={((abData['start_trial'] || 0) >= (abData['see_action'] || 0)) ? 'default' : 'outline'}>
                      {abTotal > 0 ? (((abData['start_trial'] || 0) / abTotal) * 100).toFixed(0) : 0}%
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                    <div>
                      <p className="text-sm font-medium">Variant B: "See It In Action"</p>
                      <p className="text-xs text-muted-foreground">{abData['see_action'] || 0} clicks</p>
                    </div>
                    <Badge variant={((abData['see_action'] || 0) > (abData['start_trial'] || 0)) ? 'default' : 'outline'}>
                      {abTotal > 0 ? (((abData['see_action'] || 0) / abTotal) * 100).toFixed(0) : 0}%
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground text-center">
                    Total: {abTotal} CTA clicks tracked
                  </p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No A/B test data yet. Clicks will be tracked as visitors interact with the hero CTA.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function FunnelBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm">{label}</span>
        <span className="text-sm font-medium">{value}</span>
      </div>
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function SourceRow({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground">{icon}</span>
        <span className="text-sm">{label}</span>
      </div>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}

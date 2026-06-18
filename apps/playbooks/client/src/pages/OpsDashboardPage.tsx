import { useState } from 'react';
import { useLocation, Link } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, LayoutDashboard, CheckCircle2, AlertTriangle, Calendar, Users, Building2, Clock, TrendingUp, Activity } from 'lucide-react';
import { trpc } from '@/lib/trpc';

export default function OpsDashboardPage() {
  const [, navigate] = useLocation();
  const { data: incidents = [] } = trpc.incidents.list.useQuery({ persona: 'riad-routes' });
  const { data: guests = [] } = trpc.guestCrm.list.useQuery({ persona: 'riad-routes' });
  const { data: providers = [] } = trpc.providerPartners.list.useQuery({ status: 'active' });

  const openIncidents = incidents.filter((i: any) => i.status === 'open' || i.status === 'investigating');
  const criticalIncidents = incidents.filter((i: any) => i.severity === 'critical' && i.status !== 'closed');
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <LayoutDashboard className="w-6 h-6 text-cyan-400" />
              Operations Dashboard
            </h1>
            <p className="text-sm text-muted-foreground">{today} — Real-time operational overview</p>
          </div>
          <Badge variant="outline" className="text-xs">
            <Activity className="w-3 h-3 mr-1 text-green-400" /> Live
          </Badge>
        </div>

        {/* Key Metrics Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className={criticalIncidents.length > 0 ? 'border-red-500/50' : ''}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <AlertTriangle className={`w-5 h-5 ${criticalIncidents.length > 0 ? 'text-red-400' : 'text-green-400'}`} />
                <Badge variant="outline" className="text-xs">{criticalIncidents.length > 0 ? 'ACTION' : 'OK'}</Badge>
              </div>
              <p className="text-2xl font-bold mt-2">{openIncidents.length}</p>
              <p className="text-xs text-muted-foreground">Open Incidents</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <Building2 className="w-5 h-5 text-orange-400" />
                <Badge variant="outline" className="text-xs">ACTIVE</Badge>
              </div>
              <p className="text-2xl font-bold mt-2">{providers.length}</p>
              <p className="text-xs text-muted-foreground">Provider Partners</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <Users className="w-5 h-5 text-amber-400" />
                <Badge variant="outline" className="text-xs">CRM</Badge>
              </div>
              <p className="text-2xl font-bold mt-2">{guests.length}</p>
              <p className="text-xs text-muted-foreground">Guest Profiles</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <TrendingUp className="w-5 h-5 text-green-400" />
                <Badge variant="outline" className="text-xs">MTD</Badge>
              </div>
              <p className="text-2xl font-bold mt-2">94%</p>
              <p className="text-xs text-muted-foreground">SLA Compliance</p>
            </CardContent>
          </Card>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Incidents */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center justify-between">
                <span className="flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-red-400" /> Recent Incidents</span>
                <Link href="/incident-log"><Button variant="ghost" size="sm" className="text-xs">View All</Button></Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {openIncidents.length === 0 ? (
                <div className="flex items-center gap-2 text-sm text-green-400 py-4">
                  <CheckCircle2 className="w-4 h-4" /> All clear — no open incidents
                </div>
              ) : (
                <div className="space-y-2">
                  {openIncidents.slice(0, 5).map((inc: any) => (
                    <div key={inc.id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                      <div>
                        <p className="text-sm font-medium">{inc.title}</p>
                        <p className="text-xs text-muted-foreground">{inc.providerName || 'General'}</p>
                      </div>
                      <Badge className={inc.severity === 'critical' ? 'bg-red-500/20 text-red-300' : inc.severity === 'high' ? 'bg-orange-500/20 text-orange-300' : 'bg-amber-500/20 text-amber-300'}>
                        {inc.severity}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-400" /> Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                <Link href="/daily-checklist">
                  <Button variant="outline" className="w-full h-auto py-3 flex-col text-xs">
                    <CheckCircle2 className="w-4 h-4 mb-1 text-green-400" />
                    Daily Checklist
                  </Button>
                </Link>
                <Link href="/shift-handover">
                  <Button variant="outline" className="w-full h-auto py-3 flex-col text-xs">
                    <Clock className="w-4 h-4 mb-1 text-amber-400" />
                    Shift Handover
                  </Button>
                </Link>
                <Link href="/pre-arrival-checklist">
                  <Button variant="outline" className="w-full h-auto py-3 flex-col text-xs">
                    <Calendar className="w-4 h-4 mb-1 text-purple-400" />
                    Pre-Arrival
                  </Button>
                </Link>
                <Link href="/booking-pipeline">
                  <Button variant="outline" className="w-full h-auto py-3 flex-col text-xs">
                    <TrendingUp className="w-4 h-4 mb-1 text-blue-400" />
                    Pipeline
                  </Button>
                </Link>
                <Link href="/guest-crm">
                  <Button variant="outline" className="w-full h-auto py-3 flex-col text-xs">
                    <Users className="w-4 h-4 mb-1 text-amber-400" />
                    Guest CRM
                  </Button>
                </Link>
                <Link href="/incident-log">
                  <Button variant="outline" className="w-full h-auto py-3 flex-col text-xs">
                    <AlertTriangle className="w-4 h-4 mb-1 text-red-400" />
                    Log Incident
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Provider Status */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center justify-between">
                <span className="flex items-center gap-2"><Building2 className="w-4 h-4 text-orange-400" /> Provider Status</span>
                <Link href="/provider-directory"><Button variant="ghost" size="sm" className="text-xs">View All</Button></Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {providers.slice(0, 5).map((p: any) => (
                  <div key={p.id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                    <div>
                      <p className="text-sm font-medium">{p.name}</p>
                      <p className="text-xs text-muted-foreground">{p.tier} • {p.location}</p>
                    </div>
                    <Badge variant="outline" className="text-xs text-green-400">Active</Badge>
                  </div>
                ))}
                {providers.length === 0 && <p className="text-sm text-muted-foreground py-4">No providers loaded</p>}
              </div>
            </CardContent>
          </Card>

          {/* VIP Guests */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center justify-between">
                <span className="flex items-center gap-2"><Users className="w-4 h-4 text-purple-400" /> VIP Guests</span>
                <Link href="/guest-crm"><Button variant="ghost" size="sm" className="text-xs">View All</Button></Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {guests.filter((g: any) => g.vipLevel === 'platinum' || g.vipLevel === 'gold').slice(0, 5).map((g: any) => (
                  <div key={g.id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                    <div>
                      <p className="text-sm font-medium">{g.name}</p>
                      <p className="text-xs text-muted-foreground">{g.nationality} • {g.totalStays} stays</p>
                    </div>
                    <Badge className={g.vipLevel === 'platinum' ? 'bg-purple-500/20 text-purple-300' : 'bg-amber-500/20 text-amber-300'}>
                      {g.vipLevel}
                    </Badge>
                  </div>
                ))}
                {guests.length === 0 && <p className="text-sm text-muted-foreground py-4">No guests in CRM yet</p>}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

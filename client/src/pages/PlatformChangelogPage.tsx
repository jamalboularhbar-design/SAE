import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Rocket, Bug, Sparkles, Shield, Zap, ArrowUp, Filter } from 'lucide-react';

interface ReleaseEntry {
  version: string;
  date: string;
  title: string;
  type: 'major' | 'minor' | 'patch' | 'security';
  highlights: string[];
  details?: string;
}

const RELEASES: ReleaseEntry[] = [
  {
    version: '2.5.0',
    date: '2026-05-20',
    title: 'AI Services Suite & Enterprise Readiness',
    type: 'major',
    highlights: [
      'Full AI services hub with 10 AI-powered tools (summarizer, writer, search, lead scoring, etc.)',
      'Enterprise onboarding wizard with 7-step guided setup and DB persistence',
      'Custom field definitions per document category',
      'Workflow SLA tracking with breach alerts and resolution',
      'Admin impersonation mode for support debugging',
    ],
  },
  {
    version: '2.4.0',
    date: '2026-05-18',
    title: 'Platform Maturity & Collaboration',
    type: 'major',
    highlights: [
      'Client-facing portal with project tracking and shared documents',
      'Team collaboration workspace with tasks and discussions',
      'API key management with scopes and expiration',
      'Usage analytics and billing dashboard',
      'Global ⌘K command palette from any page',
    ],
  },
  {
    version: '2.3.0',
    date: '2026-05-16',
    title: 'Operational Depth Features',
    type: 'major',
    highlights: [
      'Admin dashboard home with live KPI cards',
      'Document approval workflow with submit/approve/reject',
      'Bulk user import via CSV with validation',
      'Scheduled report generation configuration',
      'API rate limiting dashboard and webhook builder',
    ],
  },
  {
    version: '2.2.0',
    date: '2026-05-14',
    title: 'Enterprise Security & Compliance',
    type: 'major',
    highlights: [
      'White-label branding panel with custom colors and logos',
      'SSO/SAML configuration for enterprise identity providers',
      'Audit log viewer with advanced filtering',
      'GDPR compliance tools (data export, deletion, consent)',
      'Multi-language support (EN, FR, AR, ES) with RTL',
    ],
  },
  {
    version: '2.1.0',
    date: '2026-05-12',
    title: 'Growth & Revenue Features',
    type: 'minor',
    highlights: [
      '3-tier pricing page with feature comparison matrix',
      'Lead capture and CRM integration (Close.com)',
      'Free trial system with 14-day nurture sequence',
      'Referral program with tracking and rewards',
      'ROI calculator and case studies page',
    ],
  },
  {
    version: '2.0.0',
    date: '2026-05-10',
    title: 'Platform Relaunch with Multi-Brand Workspaces',
    type: 'major',
    highlights: [
      'Complete redesign with Riad & Routes and ArtKech Design Studio workspaces',
      'Advanced search with NLP and command palette',
      'Document knowledge graph visualization',
      'Process timelines and interactive workflows',
      'Mobile-responsive design with bottom navigation',
    ],
  },
  {
    version: '1.5.2',
    date: '2026-05-08',
    title: 'Security Patch',
    type: 'security',
    highlights: [
      'Fixed XSS vulnerability in document embed feature',
      'Updated authentication token rotation policy',
      'Added rate limiting to public API endpoints',
    ],
  },
  {
    version: '1.5.0',
    date: '2026-05-06',
    title: 'Analytics & Performance',
    type: 'minor',
    highlights: [
      'Visitor analytics with geographic distribution',
      'Performance benchmarks and content health scoring',
      'Reading session tracking and engagement metrics',
      'Broken link scanner with auto-detection',
    ],
  },
];

const TYPE_CONFIG = {
  major: { label: 'Major', color: 'bg-blue-600', icon: Rocket },
  minor: { label: 'Minor', color: 'bg-green-600', icon: Sparkles },
  patch: { label: 'Patch', color: 'bg-amber-600', icon: Bug },
  security: { label: 'Security', color: 'bg-red-600', icon: Shield },
};

export default function PlatformChangelogPage() {
  const [filter, setFilter] = useState<string>('all');

  const filteredReleases = filter === 'all'
    ? RELEASES
    : RELEASES.filter(r => r.type === filter);

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <ArrowUp className="w-7 h-7 text-accent" />
            Platform Changelog
          </h1>
          <p className="text-muted-foreground mt-2">
            Track every release, feature addition, and security patch across the NexusAI Playbooks platform.
          </p>
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          <Filter className="w-4 h-4 text-muted-foreground" />
          {['all', 'major', 'minor', 'patch', 'security'].map(f => (
            <Button
              key={f}
              variant={filter === f ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(f)}
              className="capitalize"
            >
              {f}
            </Button>
          ))}
        </div>

        {/* Timeline */}
        <div className="relative">
          <div className="absolute left-6 top-0 bottom-0 w-px bg-border" />
          <div className="space-y-6">
            {filteredReleases.map((release) => {
              const config = TYPE_CONFIG[release.type];
              const Icon = config.icon;
              return (
                <div key={release.version} className="relative pl-14">
                  <div className={`absolute left-4 top-3 w-5 h-5 rounded-full ${config.color} flex items-center justify-center`}>
                    <Icon className="w-3 h-3 text-white" />
                  </div>
                  <Card>
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-bold">v{release.version}</span>
                          <Badge className={`text-xs ${config.color} text-white`}>{config.label}</Badge>
                        </div>
                        <span className="text-xs text-muted-foreground">{release.date}</span>
                      </div>
                      <h3 className="font-semibold text-base mb-3">{release.title}</h3>
                      <ul className="space-y-1.5">
                        {release.highlights.map((h, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <Zap className="w-3 h-3 mt-1 text-accent shrink-0" />
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>Showing {filteredReleases.length} of {RELEASES.length} releases</p>
        </div>
      </div>
    </div>
  );
}

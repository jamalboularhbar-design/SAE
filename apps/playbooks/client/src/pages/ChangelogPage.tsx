import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, Zap, Shield, BarChart3, Users, Brain, Globe, Rocket } from 'lucide-react';
import { Link } from 'wouter';
import SEO, { PAGE_SEO } from '@/components/SEO';

interface ChangelogEntry {
  date: string;
  version: string;
  title: string;
  description: string;
  type: 'feature' | 'improvement' | 'security' | 'performance';
  icon: React.ReactNode;
  highlights: string[];
}

const CHANGELOG: ChangelogEntry[] = [
  {
    date: '2026-05-18',
    version: '2.8.0',
    title: 'Referral Program & Email Nurture Automation',
    description: 'Share ARG Builder with colleagues and earn free months. Plus, automated email nurture sequences keep trial users engaged.',
    type: 'feature',
    icon: <Users className="w-5 h-5" />,
    highlights: [
      'Unique referral codes with tracking dashboard',
      '5-step automated nurture email sequence',
      'Heartbeat-powered daily email processing',
      'Trial conversion funnel analytics',
    ],
  },
  {
    date: '2026-05-15',
    version: '2.7.0',
    title: 'Enterprise Pricing & Free Trial System',
    description: 'Three-tier pricing with annual discounts and a 14-day free trial that gives prospects full access to evaluate the platform.',
    type: 'feature',
    icon: <Rocket className="w-5 h-5" />,
    highlights: [
      'Starter / Professional / Enterprise tiers',
      '14-day full-access free trial',
      'Annual billing with 20% discount',
      'Case studies for 3 industry verticals',
    ],
  },
  {
    date: '2026-05-12',
    version: '2.6.0',
    title: 'Two-Factor Authentication & Team Invites',
    description: 'Enterprise-grade security with TOTP-based 2FA and a multi-user invite system with role-based access control.',
    type: 'security',
    icon: <Shield className="w-5 h-5" />,
    highlights: [
      'TOTP/2FA with QR code setup',
      'Recovery codes for account access',
      'Multi-user invite with viewer/editor/admin roles',
      'Team management dashboard',
    ],
  },
  {
    date: '2026-05-09',
    version: '2.5.0',
    title: 'AI-Powered Search & Knowledge Graph',
    description: 'Semantic search across all documents with an interactive knowledge graph showing document relationships and dependencies.',
    type: 'feature',
    icon: <Brain className="w-5 h-5" />,
    highlights: [
      'AI semantic search with natural language queries',
      'Interactive force-directed knowledge graph',
      'Document relationship mapping',
      'Search analytics with popular query tracking',
    ],
  },
  {
    date: '2026-05-06',
    version: '2.4.0',
    title: 'UTM Tracking & Conversion Analytics',
    description: 'Full UTM parameter tracking across the funnel with conversion attribution and A/B test infrastructure.',
    type: 'improvement',
    icon: <BarChart3 className="w-5 h-5" />,
    highlights: [
      'UTM source/medium/campaign tracking',
      'Industry-specific landing page variants',
      'Lead source attribution in CRM',
      'CSV export for all analytics data',
    ],
  },
  {
    date: '2026-05-03',
    version: '2.3.0',
    title: 'Multi-Language Support & Accessibility',
    description: 'Documents can now be translated and served in multiple languages with full accessibility compliance.',
    type: 'feature',
    icon: <Globe className="w-5 h-5" />,
    highlights: [
      'Document translation management',
      'Locale-aware content delivery',
      'WCAG 2.1 AA accessibility compliance',
      'Screen reader optimized navigation',
    ],
  },
  {
    date: '2026-04-28',
    version: '2.2.0',
    title: 'Performance Optimization & CDN',
    description: 'Blazing fast document loading with edge caching, lazy loading, and optimized bundle sizes.',
    type: 'performance',
    icon: <Zap className="w-5 h-5" />,
    highlights: [
      '60% faster initial page load',
      'Edge-cached document delivery',
      'Lazy-loaded images and code blocks',
      'Optimized bundle splitting',
    ],
  },
  {
    date: '2026-04-22',
    version: '2.1.0',
    title: 'Reading Goals & Gamification',
    description: 'Set personal reading goals, track streaks, earn achievements, and compete on team leaderboards.',
    type: 'feature',
    icon: <Sparkles className="w-5 h-5" />,
    highlights: [
      'Daily/weekly/monthly reading goals',
      'Streak tracking with achievements',
      'Team leaderboard rankings',
      'Progress visualization dashboard',
    ],
  },
];

const TYPE_STYLES = {
  feature: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  improvement: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  security: 'bg-green-500/10 text-green-500 border-green-500/20',
  performance: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
};

const TYPE_LABELS = {
  feature: 'New Feature',
  improvement: 'Improvement',
  security: 'Security',
  performance: 'Performance',
};

export default function ChangelogPage() {
  return (
    <div className="min-h-screen bg-background">
      <SEO {...PAGE_SEO.changelog} />
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <span className="text-lg font-bold text-primary cursor-pointer">ARG Builder</span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/product">
              <span className="text-sm text-muted-foreground hover:text-foreground cursor-pointer">Product</span>
            </Link>
            <Link href="/pricing">
              <span className="text-sm text-muted-foreground hover:text-foreground cursor-pointer">Pricing</span>
            </Link>
            <Link href="/start-trial">
              <span className="text-sm font-medium text-primary cursor-pointer">Start Free Trial</span>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <Badge variant="outline" className="mb-4">Product Updates</Badge>
          <h1 className="text-4xl font-bold mb-4">What's New in ARG Builder</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We ship improvements every week. Here's what's been added recently to make your operational intelligence platform even more powerful.
          </p>
        </div>
      </section>

      {/* Timeline */}
      <section className="pb-20">
        <div className="max-w-3xl mx-auto px-4">
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-6 top-0 bottom-0 w-px bg-border" />

            <div className="space-y-8">
              {CHANGELOG.map((entry, i) => (
                <div key={i} className="relative pl-16">
                  {/* Timeline dot */}
                  <div className="absolute left-4 top-6 w-5 h-5 rounded-full bg-background border-2 border-primary flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  </div>

                  <Card className="overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <time className="text-xs text-muted-foreground font-mono">
                          {new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </time>
                        <Badge variant="outline" className="text-xs">v{entry.version}</Badge>
                        <Badge className={`text-xs ${TYPE_STYLES[entry.type]}`}>
                          {TYPE_LABELS[entry.type]}
                        </Badge>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0 mt-0.5">
                          {entry.icon}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold mb-1">{entry.title}</h3>
                          <p className="text-sm text-muted-foreground mb-3">{entry.description}</p>
                          <ul className="space-y-1">
                            {entry.highlights.map((h, j) => (
                              <li key={j} className="text-sm text-muted-foreground flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary/50 shrink-0" />
                                {h}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 border-t border-border text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-3">Ready to experience these features?</h2>
          <p className="text-muted-foreground mb-6">Start your 14-day free trial and see how ARG Builder transforms your team's operations.</p>
          <Link href="/start-trial">
            <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition">
              Start Free Trial
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}

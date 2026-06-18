import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import SEO, { PAGE_SEO } from '@/components/SEO';
import {
  TrendingUp, Clock, Users, BookOpen, Brain, Shield,
  ArrowRight, CheckCircle2, BarChart3
} from 'lucide-react';

const METRICS = [
  {
    value: '87%',
    label: 'Faster Onboarding',
    description: 'Average reduction in new hire ramp-up time across all customers',
    icon: Clock,
    color: 'text-blue-500',
  },
  {
    value: '15hrs',
    label: 'Saved Per Week',
    description: 'Average time saved per team searching for operational documents',
    icon: TrendingUp,
    color: 'text-green-500',
  },
  {
    value: '94%',
    label: 'Doc Findability',
    description: 'Percentage of searches that return the correct document on first try',
    icon: Brain,
    color: 'text-purple-500',
  },
  {
    value: '3.2x',
    label: 'More Engagement',
    description: 'Increase in team documentation engagement vs. traditional wikis',
    icon: Users,
    color: 'text-amber-500',
  },
  {
    value: '60%',
    label: 'Fewer Repeat Questions',
    description: 'Reduction in repetitive questions to senior team members',
    icon: BookOpen,
    color: 'text-cyan-500',
  },
  {
    value: '99.9%',
    label: 'Uptime SLA',
    description: 'Platform availability guarantee for Enterprise customers',
    icon: Shield,
    color: 'text-rose-500',
  },
];

const BENCHMARKS = [
  {
    category: 'Onboarding Speed',
    before: '3-6 months to full productivity',
    after: '2-4 weeks with guided reading paths',
    improvement: '87% faster',
  },
  {
    category: 'Document Discovery',
    before: '15-30 min to find the right doc',
    after: '<30 seconds with AI semantic search',
    improvement: '98% faster',
  },
  {
    category: 'Knowledge Retention',
    before: 'No measurement possible',
    after: 'Quiz scores + reading progress tracking',
    improvement: 'Fully measurable',
  },
  {
    category: 'Compliance Readiness',
    before: '2-3 weeks audit preparation',
    after: '2 days with automated tracking',
    improvement: '85% faster',
  },
  {
    category: 'Team Alignment',
    before: 'Siloed knowledge across tools',
    after: 'Single source of truth with graph view',
    improvement: '100% visibility',
  },
];

const INDUSTRY_RESULTS = [
  {
    industry: 'Travel & Hospitality',
    company: 'Luxury tour operator (45 agents)',
    results: ['New agent ramp-up: 3 months → 2 weeks', 'Destination knowledge searches: 15hrs/week saved', 'Guest satisfaction scores: +12% improvement'],
  },
  {
    industry: 'Healthcare',
    company: 'Regional health network (200+ staff)',
    results: ['Audit prep time: 2 weeks → 2 days', 'Protocol compliance: 78% → 96%', 'Staff onboarding: 6 weeks → 10 days'],
  },
  {
    industry: 'SaaS & Technology',
    company: 'Series B startup (80 engineers)',
    results: ['Architecture doc discovery: 30min → 30sec', 'Onboarding time: 4 months → 3 weeks', 'Repeat questions to seniors: -60%'],
  },
  {
    industry: 'Manufacturing',
    company: 'Multi-facility manufacturer (150 workers)',
    results: ['Defect rate reduction: 34% in Q1', 'SOP compliance: 65% → 94%', 'Safety incident reduction: 41%'],
  },
];

export default function SuccessMetricsPage() {
  return (
    <div className="min-h-screen bg-background">
      <SEO {...PAGE_SEO.successMetrics} />
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <span className="text-lg font-bold text-primary cursor-pointer">ARG Builder</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/case-studies">
              <span className="text-sm text-muted-foreground hover:text-foreground cursor-pointer">Case Studies</span>
            </Link>
            <Link href="/start-trial">
              <Button size="sm">Start Free Trial</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 px-4 text-center">
        <Badge variant="outline" className="mb-4">Customer Success Metrics</Badge>
        <h1 className="text-4xl font-bold mb-4">Measurable Results, Not Promises</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
          Real performance data from ARG Builder customers across industries. These are average improvements measured over the first 90 days of deployment.
        </p>
      </section>

      {/* Key Metrics Grid */}
      <section className="px-4 pb-16">
        <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {METRICS.map((m, i) => (
            <Card key={i} className="hover:border-primary/30 transition">
              <CardContent className="p-6">
                <m.icon className={`w-8 h-8 ${m.color} mb-3`} />
                <p className="text-3xl font-bold mb-1">{m.value}</p>
                <p className="text-sm font-medium mb-1">{m.label}</p>
                <p className="text-xs text-muted-foreground">{m.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Before/After Benchmarks */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Before & After Benchmarks</h2>
          <div className="space-y-4">
            {BENCHMARKS.map((b, i) => (
              <div key={i} className="grid md:grid-cols-4 gap-4 items-center p-4 bg-background rounded-lg border border-border">
                <div>
                  <p className="text-sm font-medium">{b.category}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground mb-1">Before</p>
                  <p className="text-sm text-red-400">{b.before}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground mb-1">After</p>
                  <p className="text-sm text-green-400">{b.after}</p>
                </div>
                <div className="text-center">
                  <Badge className="bg-primary/10 text-primary">{b.improvement}</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industry Results */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Results by Industry</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {INDUSTRY_RESULTS.map((ir, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Badge variant="outline" className="mb-3">{ir.industry}</Badge>
                  <p className="text-sm text-muted-foreground mb-4">{ir.company}</p>
                  <ul className="space-y-2">
                    {ir.results.map((r, j) => (
                      <li key={j} className="flex gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                        {r}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 text-center">
        <div className="max-w-xl mx-auto">
          <BarChart3 className="w-10 h-10 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-3">See These Results for Your Team</h2>
          <p className="text-muted-foreground mb-6">
            Start a 14-day free trial and measure the impact on your operations within the first week.
          </p>
          <div className="flex gap-3 justify-center">
            <Link href="/start-trial">
              <Button size="lg" className="gap-2">
                Start Free Trial <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/request-demo">
              <Button variant="outline" size="lg">
                Request Custom Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

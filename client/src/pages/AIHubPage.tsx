import { useAuth } from '@/_core/hooks/useAuth';
import { Link } from 'wouter';
import {
  Brain, FileText, Pen, Target, Search, Tags, ClipboardList, Workflow,
  BarChart3, Settings, Sparkles, ArrowRight, MessageSquare, Hexagon, Copy,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { trpc } from '@/lib/trpc';
import { BRAND } from '@/lib/brand';
import SEO, { PAGE_SEO } from '@/components/SEO';
import JsonLd from '@/components/marketing/JsonLd';
import ExamplePromptsPanel from '@/components/product/ExamplePromptsPanel';
import FoundingUrgencyBar from '@/components/marketing/FoundingUrgencyBar';
import MarketingNav from '@/components/MarketingNav';
import { AI_TOOL_CATALOG, AI_TOOL_CATEGORIES } from '@shared/aiToolCatalog';
import { toast } from 'sonner';

const ICONS: Record<string, LucideIcon> = {
  [BRAND.nexusOsName]: Hexagon,
  'AI Chat Assistant': MessageSquare,
  'Writing Assistant': Pen,
  'Document Summarizer': FileText,
  'Semantic Search': Search,
  'Smart Recommendations': Sparkles,
  'Template Generator': FileText,
  'Auto-Tag': Tags,
  'Workflow Builder': Workflow,
  'Meeting Notes': ClipboardList,
  'Lead Scoring': Target,
  'Sentiment Analysis': BarChart3,
};

const COLORS: Record<string, string> = {
  [BRAND.nexusOsName]: 'text-teal-400',
  'AI Chat Assistant': 'text-violet-400',
  'Writing Assistant': 'text-emerald-400',
  'Document Summarizer': 'text-blue-400',
  'Semantic Search': 'text-cyan-400',
  'Smart Recommendations': 'text-purple-400',
  'Template Generator': 'text-teal-400',
  'Auto-Tag': 'text-pink-400',
  'Workflow Builder': 'text-indigo-400',
  'Meeting Notes': 'text-yellow-400',
  'Lead Scoring': 'text-orange-400',
  'Sentiment Analysis': 'text-rose-400',
};

export default function AIHubPage() {
  const { user } = useAuth({ redirectOnUnauthenticated: false });
  const { data: configs } = trpc.aiConfigManager.getAll.useQuery();

  const getServiceStats = (serviceName: string) => {
    const key = serviceName.toLowerCase().replace(/\s+/g, '');
    const config = configs?.find((c: { serviceName: string }) => c.serviceName === key || c.serviceName.includes(key.slice(0, 8)));
    return config ? { calls: config.totalCalls, tokens: config.totalTokensUsed, enabled: config.isEnabled === 1 } : { calls: 0, tokens: 0, enabled: true };
  };

  const copyPrompt = (prompt: string) => {
    void navigator.clipboard.writeText(prompt);
    toast.success('Example prompt copied');
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO {...PAGE_SEO.aiHub} canonical={`${BRAND.appUrl}/ai`} />
      <JsonLd
        id="ai-hub"
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: BRAND.aiHubTitle,
          description: BRAND.aiHubTagline,
          url: `${BRAND.appUrl}/ai`,
          applicationCategory: 'BusinessApplication',
        }}
      />

      {!user && <MarketingNav subtitle={BRAND.aiHubName} backHref="/" backLabel="Home" showProductLinks={false} />}

      <div className={`container max-w-7xl mx-auto px-4 ${!user ? 'pt-28' : 'pt-8'} pb-12`}>
        <div className="mb-10">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-500/20">
                <Brain className="h-8 w-8 text-purple-400" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-purple-400 mb-0.5">
                  {BRAND.parentName}
                </p>
                <h1 className="text-3xl font-bold text-foreground">{BRAND.aiHubTitle}</h1>
                <p className="text-muted-foreground">{BRAND.aiHubTagline}</p>
              </div>
            </div>
            <Link href="/ai/chat">
              <Button className="gap-2 bg-purple-600 hover:bg-purple-700 shrink-0">
                <MessageSquare className="h-4 w-4" />
                Start AI Chat
              </Button>
            </Link>
          </div>
          <div className="flex flex-wrap items-center gap-3 mt-4">
            <Badge variant="outline" className="text-sm px-3 py-1 border-purple-500/30 text-purple-300">
              {AI_TOOL_CATALOG.length} AI Tools
            </Badge>
            {configs && (
              <Badge variant="outline" className="text-sm px-3 py-1">
                {configs.reduce((sum: number, c: { totalCalls: number }) => sum + c.totalCalls, 0).toLocaleString()} Total API Calls
              </Badge>
            )}
            {user?.role === 'admin' && (
              <Link href="/admin/ai-config">
                <Button variant="outline" size="sm" className="gap-2">
                  <Settings className="h-4 w-4" />
                  Configure Models
                </Button>
              </Link>
            )}
          </div>
        </div>

        {!user && <FoundingUrgencyBar className="mb-8" />}

        <ExamplePromptsPanel className="mb-10" title="Try these example prompts" />

        {AI_TOOL_CATEGORIES.map((category) => {
          const services = AI_TOOL_CATALOG.filter((s) => s.category === category);
          if (services.length === 0) return null;
          return (
            <div key={category} className="mb-10">
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-500" />
                {category}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {services.map((service) => {
                  const stats = getServiceStats(service.name);
                  const Icon = ICONS[service.name] ?? Sparkles;
                  const color = COLORS[service.name] ?? 'text-purple-400';

                  const card = (
                    <Card className={`h-full hover:border-purple-500/40 transition-colors cursor-pointer group ${service.featured ? 'border-purple-500/30 bg-purple-500/5' : ''}`}>
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-md bg-muted">
                              <Icon className={`h-5 w-5 ${color}`} />
                            </div>
                            <div>
                              <CardTitle className="text-base">{service.name}</CardTitle>
                              {service.featured && (
                                <Badge className="mt-1 text-[10px] bg-purple-600">Featured</Badge>
                              )}
                            </div>
                          </div>
                          <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <CardDescription className="text-sm">{service.description}</CardDescription>
                        <div className="rounded-lg bg-muted/40 border border-border/50 p-3">
                          <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Use case</p>
                          <p className="text-xs text-foreground/90">{service.useCase}</p>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            copyPrompt(service.examplePrompt);
                          }}
                          className="w-full text-left rounded-lg border border-dashed border-purple-500/25 p-2 hover:bg-purple-500/5 transition-colors"
                        >
                          <p className="text-[10px] uppercase tracking-wider text-purple-400 mb-0.5 flex items-center gap-1">
                            <Copy className="w-3 h-3" /> Example prompt
                          </p>
                          <p className="text-xs text-muted-foreground line-clamp-2">&ldquo;{service.examplePrompt}&rdquo;</p>
                        </button>
                        {stats.calls > 0 && (
                          <p className="text-xs text-muted-foreground">{stats.calls.toLocaleString()} calls</p>
                        )}
                      </CardContent>
                    </Card>
                  );

                  if (service.external) {
                    return (
                      <a key={service.path} href={service.path}>
                        {card}
                      </a>
                    );
                  }
                  return (
                    <Link key={service.path} href={service.path}>
                      {card}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}

        <div className="mt-8 p-6 rounded-lg border border-dashed border-border bg-card/30">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Operational Playbooks</h3>
              <p className="text-sm text-muted-foreground mt-1">
                AI tools are wired to 570+ SOPs — browse the library, then search, write, and summarize as you work.
              </p>
            </div>
            <Link href={user ? '/' : '/toc'}>
              <Button variant="outline" className="gap-2 shrink-0">
                {user ? `Back to ${BRAND.productName}` : 'Browse library'}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

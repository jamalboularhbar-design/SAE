import { Link } from 'wouter';
import { ArrowRight, BookOpen, Brain, Hexagon, Network } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BRAND } from '@/lib/brand';
import SEO, { PAGE_SEO } from '@/components/SEO';
import JsonLd from '@/components/marketing/JsonLd';
import MarketingNav from '@/components/MarketingNav';

/** SEO content cluster — autonomous ops topics (expand with real posts over time) */
const ARTICLES = [
  {
    slug: 'autonomous-ops-stack',
    title: 'The autonomous ops stack: Library → Graph → Intelligence → Runtime',
    excerpt: 'Why modern operators need four layers — not another blank wiki or static template pack.',
    category: 'Strategy',
    href: '/product#platform-journey',
  },
  {
    slug: 'multi-brand-workspaces',
    title: 'Running multiple client brands without document sprawl',
    excerpt: 'How fractional COOs and agencies isolate workspaces while sharing agency SOPs.',
    category: 'Case study',
    href: '/case-studies',
  },
  {
    slug: 'nexus-os-approval-gates',
    title: 'Ask once, execute safely: approval gates in Nexus OS',
    excerpt: 'Multi-agent automation with human checkpoints before Slack, Notion, or Gmail actions.',
    category: 'Nexus OS',
    href: '/runtime',
  },
  {
    slug: 'semantic-search-playbooks',
    title: 'Semantic search beats folder archaeology',
    excerpt: 'Plain-English queries across 570+ playbooks — when keyword search stops working.',
    category: 'AI',
    href: '/ai/search',
  },
  {
    slug: 'knowledge-graph-dependencies',
    title: 'Find load-bearing SOPs before someone leaves',
    excerpt: 'Using the knowledge graph to see dependencies and cross-references across functions.',
    category: 'Platform',
    href: '/graph',
  },
  {
    slug: 'founding-member-roi',
    title: 'Documented ROI from live deployments',
    excerpt: '94% adoption in 10 days, 420% ROI — metrics from Riad & Routes and ArtKech rollouts.',
    category: 'Proof',
    href: '/case-studies?study=riad-routes',
  },
] as const;

export default function ResourcesBlogPage() {
  return (
    <div className="min-h-screen bg-background">
      <SEO {...PAGE_SEO.resources} canonical={`${BRAND.appUrl}/resources`} />
      <JsonLd
        id="resources-blog"
        data={{
          '@context': 'https://schema.org',
          '@type': 'Blog',
          name: `${BRAND.productName} Resources`,
          description: PAGE_SEO.resources.description,
          url: `${BRAND.appUrl}/resources`,
          publisher: { '@type': 'Organization', name: BRAND.parentName },
        }}
      />

      <MarketingNav
        subtitle="Resources"
        backHref="/"
        backLabel="Home"
        showProductLinks={false}
      />

      <div className="max-w-4xl mx-auto px-4 pt-28 pb-20">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-3">Resources & learning</h1>
          <p className="text-lg text-muted-foreground">
            Guides and playbooks for building autonomous operations — library, graph, AI, and runtime.
          </p>
        </div>

        <div className="grid gap-4 mb-12">
          {ARTICLES.map((article) => (
            <Link key={article.slug} href={article.href}>
              <article className="p-5 rounded-xl border border-border bg-card hover:border-teal-500/30 transition-colors cursor-pointer group">
                <span className="text-xs font-medium text-teal-600 dark:text-teal-400 uppercase tracking-wider">
                  {article.category}
                </span>
                <h2 className="text-lg font-semibold mt-1 mb-2 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                  {article.title}
                </h2>
                <p className="text-sm text-muted-foreground">{article.excerpt}</p>
                <span className="text-xs text-primary mt-3 inline-flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  Read <ArrowRight className="w-3 h-3" />
                </span>
              </article>
            </Link>
          ))}
        </div>

        <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-start gap-3">
            <BookOpen className="w-6 h-6 text-purple-400 shrink-0" />
            <div>
              <p className="font-semibold">Explore the platform</p>
              <p className="text-sm text-muted-foreground">Jump from reading to doing — library, graph, AI, runtime.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/toc"><Button size="sm" variant="outline" className="gap-1"><BookOpen className="w-3.5 h-3.5" /> Library</Button></Link>
            <Link href="/graph"><Button size="sm" variant="outline" className="gap-1"><Network className="w-3.5 h-3.5" /> Graph</Button></Link>
            <Link href="/ai"><Button size="sm" variant="outline" className="gap-1"><Brain className="w-3.5 h-3.5" /> AI</Button></Link>
            <Link href="/runtime"><Button size="sm" variant="outline" className="gap-1"><Hexagon className="w-3.5 h-3.5" /> Runtime</Button></Link>
          </div>
        </div>
      </div>
    </div>
  );
}

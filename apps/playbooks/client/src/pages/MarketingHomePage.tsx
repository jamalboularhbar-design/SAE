import { Link } from 'wouter';
import {
  ArrowRight, Brain, FolderOpen, Network, Hexagon, CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BRAND } from '@/lib/brand';
import { PLATFORM_STATS } from '@shared/platformStats';
import { totalDocuments } from '@/lib/documentCatalog';
import SEO from '@/components/SEO';
import JsonLd from '@/components/marketing/JsonLd';
import MarketingNav from '@/components/MarketingNav';
import LogoMark from '@/components/LogoMark';
import ProductPlatformJourney from '@/components/product/ProductPlatformJourney';
import ProductCaseStudyROI from '@/components/product/ProductCaseStudyROI';
import SocialProofStrip from '@/components/product/SocialProofStrip';
import FoundingUrgencyBar from '@/components/marketing/FoundingUrgencyBar';
import HubSpecialistStrip from '@/components/product/HubSpecialistStrip';
import VerticalShowcase from '@/components/VerticalShowcase';

const BENEFITS = [
  {
    title: 'Stop starting from blank pages',
    desc: `${totalDocuments}+ playbooks across ${PLATFORM_STATS.businessFunctions} functions — structured the way a COO would build them.`,
  },
  {
    title: 'Ask once, execute everywhere',
    desc: `${BRAND.nexusOsName} runs multi-agent workflows across Slack, Notion, and Gmail with approval gates.`,
  },
  {
    title: 'Built for multi-brand operators',
    desc: 'Fractional COOs, agencies, and boutique teams — one platform, isolated client workspaces.',
  },
];

export default function MarketingHomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <SEO
        title="Home"
        description={BRAND.seoDescription}
        canonical={`${BRAND.appUrl}/`}
      />
      <JsonLd
        id="software-app"
        data={{
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: BRAND.productName,
          applicationCategory: 'BusinessApplication',
          operatingSystem: 'Web',
          description: BRAND.seoDescription,
          url: BRAND.appUrl,
          offers: {
            '@type': 'Offer',
            price: '39',
            priceCurrency: 'USD',
            priceValidUntil: '2027-12-31',
          },
        }}
      />

      <MarketingNav subtitle="Playbooks + Runtime" />

      {/* Hero */}
      <section className="pt-32 pb-16 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-teal-500/8 via-purple-500/5 to-transparent pointer-events-none" />
        <div className="max-w-5xl mx-auto relative text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] mb-6 tracking-tight">
            Every playbook your company needs.
            <br />
            <span className="bg-gradient-to-r from-teal-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Already written. AI-powered.
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
            {BRAND.description} Your Hub Specialist roster (jamal-hub-v2) powers {BRAND.nexusOsName} —
            ask once, your expert team executes.
          </p>

          <FoundingUrgencyBar className="max-w-2xl mx-auto mb-8 text-left" />

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
            <Link href="/product">
              <Button size="lg" className="bg-teal-500 hover:bg-teal-400 text-black font-semibold px-8 gap-2">
                See full product tour <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/toc">
              <Button size="lg" variant="outline" className="border-teal-500/40 px-8 gap-2">
                <FolderOpen className="w-5 h-5" /> Browse library
              </Button>
            </Link>
          </div>

          <p className="text-sm text-muted-foreground font-mono">
            {PLATFORM_STATS.documents}+ docs · {PLATFORM_STATS.graphEdges.toLocaleString()} graph edges · {PLATFORM_STATS.aiTools} AI tools
          </p>
        </div>
      </section>

      {/* Quick explore */}
      <section className="px-4 pb-12">
        <div className="max-w-4xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { icon: FolderOpen, label: 'Library', href: '/toc', color: 'text-teal-400' },
            { icon: Network, label: 'Graph', href: '/graph', color: 'text-cyan-400' },
            { icon: Brain, label: 'Intelligence', href: '/ai', color: 'text-purple-400' },
            { icon: Hexagon, label: 'Runtime', href: '/runtime', color: 'text-indigo-400' },
          ].map((item) => (
            <Link key={item.href} href={item.href}>
              <div className="p-4 rounded-xl border border-border bg-card/50 hover:border-teal-500/30 transition-colors text-center cursor-pointer group">
                <item.icon className={`w-6 h-6 ${item.color} mx-auto mb-2`} />
                <p className="text-sm font-semibold group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                  {item.label}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <ProductPlatformJourney />

      <HubSpecialistStrip />

      {/* Benefits */}
      <section className="py-20 px-4 bg-muted/20">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-10">Why operators switch to {BRAND.productName}</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {BENEFITS.map((b) => (
              <div key={b.title} className="p-6 rounded-xl border border-border bg-card">
                <CheckCircle2 className="w-5 h-5 text-teal-500 mb-3" />
                <h3 className="font-semibold mb-2">{b.title}</h3>
                <p className="text-sm text-muted-foreground">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ProductCaseStudyROI />

      <section className="px-4 py-12" data-tour="vertical-demos">
        <div className="max-w-6xl mx-auto">
          <VerticalShowcase compact />
        </div>
      </section>

      <section className="px-4 pb-8">
        <div className="max-w-6xl mx-auto">
          <SocialProofStrip />
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <FoundingUrgencyBar variant="card" />
          <Link href="/product#demo">
            <Button variant="link" className="text-muted-foreground gap-1">
              Or explore interactive demos first <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      <footer className="py-10 px-4 border-t border-border/60 pb-28 sm:pb-12">
        <div className="max-w-2xl mx-auto flex flex-col items-center gap-3 text-center">
          <LogoMark size="md" />
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} {BRAND.parentName} · {BRAND.domain}
          </p>
        </div>
      </footer>
    </div>
  );
}

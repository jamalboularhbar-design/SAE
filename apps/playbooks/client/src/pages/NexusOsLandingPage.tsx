import { Link } from 'wouter';
import { ArrowRight, Hexagon, Slack, Mail, FileText, Shield, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BRAND } from '@/lib/brand';
import SEO from '@/components/SEO';
import JsonLd from '@/components/marketing/JsonLd';
import MarketingNav from '@/components/MarketingNav';
import NexusOsDemoTeaser from '@/components/product/NexusOsDemoTeaser';
import ExamplePromptsPanel from '@/components/product/ExamplePromptsPanel';
import FoundingUrgencyBar from '@/components/marketing/FoundingUrgencyBar';
import IntegrationsStrip from '@/components/product/IntegrationsStrip';
import HubSpecialistStrip from '@/components/product/HubSpecialistStrip';
import { HUB_ROSTER_STATS } from '@/lib/hub';

const FLOW_STEPS = [
  { step: '1', title: 'Ask in plain English', desc: 'One prompt — Chief of Staff receives the job.' },
  { step: '2', title: 'Hub routes specialists', desc: 'jamal-hub-v2 scores your roster and picks the best team.' },
  { step: '3', title: 'Playbooks + parallel work', desc: 'Specialists pull from your library and draft in parallel.' },
  { step: '4', title: 'Approval → publish', desc: 'You approve — then Slack, Notion, or Gmail actions fire.' },
];

export default function NexusOsLandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        {...{
          title: `${BRAND.nexusOsName} — Runtime`,
          description: `${BRAND.nexusOsTagline} Multi-agent execution across Slack, Notion, and Gmail — built on ${BRAND.productName} playbooks.`,
          canonical: `${BRAND.appUrl}/runtime`,
        }}
      />
      <JsonLd
        id="nexus-os-product"
        data={{
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: BRAND.nexusOsName,
          description: BRAND.nexusOsTagline,
          brand: { '@type': 'Brand', name: BRAND.productName },
          url: `${BRAND.appUrl}/runtime`,
        }}
      />

      <MarketingNav
        title={BRAND.nexusOsName}
        subtitle="Runtime"
        backHref="/product"
        backLabel="Product"
        showProductLinks={false}
        primaryCta={
          <a href={`${BRAND.nexusOsPath}/`}>
            <Button size="sm" className="bg-indigo-600 hover:bg-indigo-500 text-white gap-1.5">
              Open console <ArrowRight className="w-4 h-4" />
            </Button>
          </a>
        }
      />

      <section className="pt-28 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 text-xs font-medium mb-6">
                <Hexagon className="w-3.5 h-3.5" /> {BRAND.nexusOsName}
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-4">
                Ask once.
                <br />
                <span className="text-indigo-400">Your team executes.</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                {BRAND.nexusOsTagline} Powered by your Hub Specialist roster (jamal-hub-v2) — Chief of Staff
                orchestrates {HUB_ROSTER_STATS.specialists} experts across Riad & Routes, ArtKech,
                ARG-Builder, and JB.
              </p>

              <div className="flex flex-wrap gap-3 mb-8">
                <a href={`${BRAND.nexusOsPath}/`}>
                  <Button size="lg" className="bg-indigo-600 hover:bg-indigo-500 text-white gap-2">
                    Try Nexus OS <ArrowRight className="w-5 h-5" />
                  </Button>
                </a>
                <Link href="/product#demo">
                  <Button size="lg" variant="outline" className="border-border">
                    See platform demo
                  </Button>
                </Link>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  { icon: Slack, label: 'Slack notifications & threads' },
                  { icon: FileText, label: 'Notion pages & databases' },
                  { icon: Mail, label: 'Gmail drafts & sends' },
                  { icon: Shield, label: 'Approval gates on every run' },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Icon className="w-4 h-4 text-indigo-400 shrink-0" />
                    {label}
                  </div>
                ))}
              </div>
            </div>

            <NexusOsDemoTeaser />
          </div>
        </div>
      </section>

      <section className="py-16 px-4 border-y border-border/60 bg-muted/10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-10">How a request becomes execution</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {FLOW_STEPS.map((s) => (
              <div key={s.step} className="p-5 rounded-xl border border-border bg-card relative">
                <span className="absolute -top-2.5 left-4 px-2 py-0.5 rounded bg-indigo-600 text-white text-xs font-mono">
                  {s.step}
                </span>
                <Zap className="w-5 h-5 text-indigo-400 mb-3 mt-1" />
                <h3 className="font-semibold mb-1">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <HubSpecialistStrip />

      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8">
          <ExamplePromptsPanel title="Example commands — Hub workspaces" />
          <div className="space-y-6">
            <FoundingUrgencyBar variant="card" />
            <p className="text-sm text-muted-foreground">
              Nexus OS early access is included with {BRAND.productName} membership and Founding Member plans.
              The interactive demo above is read-only — the full Hub at{' '}
              <a href={`${BRAND.nexusOsPath}/`} className="text-indigo-400 hover:underline">{BRAND.nexusOsPath}</a>{' '}
              loads jamal-hub-v2 when you sign in.
            </p>
          </div>
        </div>
      </section>

      <section className="px-4 pb-16">
        <div className="max-w-6xl mx-auto">
          <IntegrationsStrip />
        </div>
      </section>
    </div>
  );
}

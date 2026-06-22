import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import { Link } from 'wouter';
import { useState } from 'react';
import {
  Search, Layers, History, FolderOpen, Download, Bookmark,
  CheckCircle2, ArrowRight, Brain, Pen, MessageSquare, Sparkles, X, Minus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { totalDocuments, categoryCounts } from '@/lib/documentCatalog';
import { BRAND } from '@/lib/brand';
import SEO from '@/components/SEO';
import VerticalShowcase from '@/components/VerticalShowcase';
import LogoMark from '@/components/LogoMark';
import MarketingNav from '@/components/MarketingNav';

const FUNCTION_COUNT = Object.keys(categoryCounts).length;
const AI_TOOL_COUNT = 11;

const STATS = [
  { n: String(totalDocuments), label: 'structured operating documents, each one decision-ready' },
  { n: String(FUNCTION_COUNT), label: 'business functions covered, from pricing to security compliance' },
  { n: String(AI_TOOL_COUNT), label: 'AI tools built in — writing, search, chat, summarizer, and more' },
];

const AUDIENCES = [
  { title: 'Solo founders', desc: 'Run with the structure of a 50-person company. Reference, decide, execute.' },
  { title: 'Small teams (2–20)', desc: 'One shared source of truth. Onboard people into documented process, not tribal memory.' },
  { title: 'Fractional COOs, consultants & agencies', desc: 'Manage playbooks for multiple brands in one workspace — with AI to write, search, and summarize.' },
];

const FEATURES = [
  { icon: Search, title: 'Full-text search', desc: `Find the exact framework in seconds, across all ${totalDocuments} documents.` },
  { icon: Layers, title: 'Structured categories', desc: `${FUNCTION_COUNT} functions, consistently organized. No orphan docs, no duplicates.` },
  { icon: History, title: 'Versioning & freshness', desc: "Documents carry version history and review status. You know what's current." },
  { icon: FolderOpen, title: 'Collections & reading paths', desc: 'Sequence documents into onboarding tracks, launch checklists, or client deliverables.' },
  { icon: Download, title: 'Export', desc: 'PDF, DOCX, and zip export. Your reference travels with you.' },
  { icon: Bookmark, title: 'Annotations & bookmarks', desc: 'Mark what applies to your company. The reference adapts to you.' },
];

const AI_TOOLS = [
  { icon: Pen, title: 'Writing Assistant', desc: 'Draft, rewrite, and expand SOPs in your voice.' },
  { icon: Search, title: 'Semantic Search', desc: 'Ask in plain English — find the right playbook instantly.' },
  { icon: MessageSquare, title: 'AI Chat', desc: 'Doc-aware assistant for operational questions.' },
  { icon: Sparkles, title: 'Summarizer & more', desc: 'Executive summaries, auto-tagging, workflows, meeting notes.' },
];

const COMPARISON = [
  { feature: 'Pre-written operating library', us: `${totalDocuments} docs ready`, notion: 'Start blank', templates: 'Static files' },
  { feature: 'Built-in AI tools', us: `${AI_TOOL_COUNT} tools at /ai`, notion: 'Add-on AI', templates: 'None' },
  { feature: 'Multi-brand workspaces', us: 'Native', notion: 'Workspaces only', templates: 'N/A' },
  { feature: 'Structured architecture', us: 'COO-grade taxonomy', notion: 'You design it', templates: 'Inconsistent' },
  { feature: 'Search & versioning', us: 'Full platform', notion: 'Yes', templates: 'Manual' },
  { feature: 'Time to deploy', us: 'Minutes', notion: 'Weeks–months', templates: 'Hours (setup)' },
];

const STEPS = [
  { title: 'Join', desc: 'One plan, full library access. No onboarding calls, no configuration.' },
  { title: 'Search or browse', desc: 'Start from your most urgent function: pricing, hiring, launch, compliance.' },
  { title: 'Apply with AI', desc: 'Use the Intelligence Hub to summarize, rewrite, and query your playbooks as you work.' },
];

const FAQS = [
  { q: 'Is this just a template pack?', a: 'No. Templates are dead files. ARG-Builder is a maintained platform: versioned documents, consistent architecture, search, collections, 11 AI tools, and updates as the library grows.' },
  { q: 'What AI features are included?', a: `All members get access to ${BRAND.aiHubTitle}: writing assistant, semantic search, AI chat, document summarizer, auto-tagging, workflow builder, and more — at ${BRAND.aiHubPath}.` },
  { q: 'Who writes the documents?', a: 'The library is built and maintained with AI-assisted research and drafting, structured under a single editorial architecture. Every document carries its preparation credit and review status.' },
  { q: 'Can I use these for client work?', a: 'Yes — consultants and agencies use Playbooks to structure client deliverables across multiple brand workspaces. White-label arrangements: ask.' },
];

function CompareCell({ value, highlight }: { value: string; highlight?: boolean }) {
  if (value === 'Yes' || value === 'Native' || value.startsWith(String(totalDocuments)) || value.includes('tools')) {
    return <span className="text-teal-700 dark:text-teal-400 font-medium">{value}</span>;
  }
  if (value === 'None' || value === 'Start blank' || value === 'N/A') {
    return <span className="text-muted-foreground flex items-center justify-center gap-1"><X className="w-3.5 h-3.5" />{value}</span>;
  }
  if (value === 'Add-on AI' || value === 'Manual' || value === 'Inconsistent') {
    return <span className="text-muted-foreground flex items-center justify-center gap-1"><Minus className="w-3.5 h-3.5" />{value}</span>;
  }
  return <span className={highlight ? 'text-teal-700 dark:text-teal-400 font-medium' : 'text-muted-foreground'}>{value}</span>;
}

export default function LandingPage() {
  const { user } = useAuth({ redirectOnUnauthenticated: false });
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const { data: stripeConfig } = trpc.stripe.isConfigured.useQuery();
  const submitWaitlist = trpc.leads.submit.useMutation({
    onSuccess: () => {
      toast.success("You're on the Playbooks waitlist.");
      setWaitlistEmail('');
    },
    onError: () => toast.error('Could not save — try again or email hello@argbuilder.io'),
  });
  const createCheckout = trpc.stripe.createCheckoutSession.useMutation({
    onSuccess: (data) => {
      if (data.checkoutUrl) {
        window.open(data.checkoutUrl, '_blank');
        toast.info('Redirecting to checkout...');
      }
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const subscribe = (billingPeriod: 'monthly' | 'annual') => {
    if (!user) {
      window.location.href = '/login';
      return;
    }
    if (!stripeConfig?.configured) {
      toast.error(`Payments are not enabled yet. Email ${BRAND.supportEmail} and we will set you up directly.`);
      return;
    }
    createCheckout.mutate({ tierId: 'membership', billingPeriod });
  };

  const sortedCategories = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1]);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <SEO {...{ title: 'Product', description: `${BRAND.description} ${totalDocuments}+ documents, ${AI_TOOL_COUNT} AI tools, ${FUNCTION_COUNT} business functions.` }} />

      <MarketingNav subtitle="Playbooks" />

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-teal-500/5 via-purple-500/5 to-transparent" />
        <div className="max-w-7xl mx-auto relative text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-500/10 border border-teal-500/20 mb-4">
            <span className="w-2 h-2 rounded-full bg-teal-400" />
            <span className="text-sm font-medium text-teal-700 dark:text-teal-300">{BRAND.productName}</span>
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-8 ml-0 sm:ml-2">
            <Brain className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            <span className="text-sm font-medium text-purple-700 dark:text-purple-300">{AI_TOOL_COUNT} AI tools included</span>
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.1] mb-6 tracking-tight">
            Every playbook your company needs.<br />
            <span className="bg-gradient-to-r from-teal-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Already written. AI-powered.
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed">
            {BRAND.productName} is an operating reference platform: {totalDocuments} structured documents covering
            all {FUNCTION_COUNT} functions of a running company — plus {BRAND.aiHubTitle} for writing, semantic search,
            and doc-aware chat. Searchable, versioned, and organized the way a COO would build it.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#pricing">
              <Button size="lg" className="bg-teal-500 hover:bg-teal-400 text-black font-semibold px-8 py-6 text-lg">
                Become a Founding Member <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </a>
            <Link href="/ai">
              <Button size="lg" variant="outline" className="border-purple-500/40 text-purple-800 dark:text-purple-200 hover:bg-purple-500/10 px-8 py-6 text-lg gap-2">
                <Brain className="w-5 h-5" /> Explore AI Hub
              </Button>
            </Link>
          </div>
          <p className="mt-5 text-sm text-muted-foreground font-mono">{totalDocuments} documents · {FUNCTION_COUNT} functions · {AI_TOOL_COUNT} AI tools</p>
          <div className="relative mt-16 mx-auto max-w-5xl">
            <div className="absolute -inset-4 bg-gradient-to-r from-teal-500/20 via-purple-500/10 to-teal-500/20 rounded-2xl blur-3xl" />
            <div className="relative rounded-xl overflow-hidden border border-border shadow-2xl bg-card p-6 sm:p-8 text-left">
              <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-muted/50 border border-border mb-6">
                <Search className="w-4 h-4 text-teal-600 dark:text-teal-700 dark:text-teal-400 shrink-0" />
                <span className="text-sm text-muted-foreground">Search {totalDocuments} documents — pricing, hiring, incident response…</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { cat: 'Revenue & Pricing', title: 'Pricing Strategy & Financial Models', meta: 'Frameworks · Decision tables · Templates' },
                  { cat: 'Strategy & Operations', title: 'Annual Planning & OKR System', meta: 'Cadence · Metrics · Review templates' },
                  { cat: 'AI Intelligence', title: 'Writing Assistant + Semantic Search', meta: 'Draft SOPs · Natural language query · Chat' },
                ].map((d) => (
                  <div key={d.title} className="p-5 rounded-lg bg-muted/30 border border-border/60">
                    <span className={`inline-block text-[11px] font-medium px-2 py-0.5 rounded-full mb-3 ${d.cat === 'AI Intelligence' ? 'text-purple-700 dark:text-purple-700 dark:text-purple-400 bg-purple-500/10 border border-purple-500/20' : 'text-teal-700 dark:text-teal-400 bg-teal-500/10 border border-teal-500/20'}`}>{d.cat}</span>
                    <p className="text-sm font-semibold text-foreground leading-snug mb-2">{d.title}</p>
                    <p className="text-xs text-muted-foreground">{d.meta}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Waitlist + vertical demos */}
      <section className="py-12 px-4 border-b border-border">
        <div className="max-w-xl mx-auto mb-12">
          <p className="text-sm text-muted-foreground text-center mb-3">Launch updates & template drops:</p>
          <div className="flex gap-2">
            <input
              type="email"
              value={waitlistEmail}
              onChange={(e) => setWaitlistEmail(e.target.value)}
              placeholder="you@company.com"
              className="flex-1 px-4 py-2.5 rounded-lg bg-input border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50"
            />
            <Button
              className="bg-teal-500 hover:bg-teal-400 text-black font-semibold shrink-0"
              disabled={submitWaitlist.isPending}
              onClick={() => {
                if (!waitlistEmail.trim()) {
                  toast.error('Enter your email');
                  return;
                }
                submitWaitlist.mutate({
                  fullName: 'Product waitlist',
                  email: waitlistEmail.trim(),
                  source: 'product_waitlist',
                  utmSource: 'product',
                  utmMedium: 'hero',
                });
              }}
            >
              Join waitlist
            </Button>
          </div>
        </div>
        <div className="max-w-6xl mx-auto">
          <VerticalShowcase compact />
        </div>
      </section>

      {/* Why */}
      <section id="why" className="py-24 px-4 bg-gradient-to-b from-transparent to-muted/30">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-700 dark:text-teal-400 text-xs font-medium mb-6">
            Why this exists
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            You're running a company without an operations manual.<br />
            <span className="text-teal-700 dark:text-teal-400">Nobody has time to write one.</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed">
            Solo founders and small teams run on memory and improvisation. Consultants charge five figures to document what
            you need. Template packs give you forty Word files and silence. Notion gives you blank pages.
            {BRAND.productName} is the third option: a complete operating reference with {AI_TOOL_COUNT} AI tools built in —
            maintained as software, not a folder of files.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {STATS.map((s) => (
              <div key={s.label} className="p-6 rounded-xl bg-muted/30 border border-border/60 text-left">
                <div className="text-4xl font-bold text-teal-700 dark:text-teal-400 mb-2">{s.n}</div>
                <p className="text-sm text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Intelligence */}
      <section id="intelligence" className="py-24 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-transparent pointer-events-none" />
        <div className="max-w-6xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-700 dark:text-purple-400 text-xs font-medium mb-6">
            <Brain className="w-3.5 h-3.5" /> {BRAND.aiHubName}
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">{BRAND.aiHubTitle}</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed">
            {BRAND.aiHubTagline}. Not a bolt-on — {AI_TOOL_COUNT} AI tools wired into your playbooks from day one.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {AI_TOOLS.map((t) => (
              <div key={t.title} className="p-6 rounded-xl bg-muted/30 border border-purple-500/20 hover:border-purple-500/40 transition-colors text-left">
                <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center mb-4">
                  <t.icon className="w-5 h-5 text-purple-700 dark:text-purple-400" />
                </div>
                <h3 className="font-semibold mb-2">{t.title}</h3>
                <p className="text-sm text-muted-foreground">{t.desc}</p>
              </div>
            ))}
          </div>
          <Link href="/ai">
            <Button size="lg" className="bg-purple-600 hover:bg-purple-500 text-primary-foreground font-semibold gap-2">
              <Brain className="w-5 h-5" /> Open {BRAND.aiHubTitle}
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Audience */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Built for operators, not enterprises</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed">
            {BRAND.productName} isn't a wiki you have to fill or an enterprise tool you have to configure. It deploys
            complete. Each document follows the same architecture — frameworks, decision tables, templates,
            metrics. Learn the structure once, navigate everything.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {AUDIENCES.map((a) => (
              <div key={a.title} className="p-8 rounded-xl bg-muted/30 border border-border/60 hover:border-teal-500/30 transition-colors text-left">
                <h3 className="text-lg font-semibold mb-2">{a.title}</h3>
                <p className="text-sm text-muted-foreground">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Library */}
      <section id="library" className="py-24 px-4 bg-gradient-to-b from-transparent to-muted/30">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">All {FUNCTION_COUNT} functions. One architecture.</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-10">
            Every document ends in templates and decision tables — take the structure, fill in your company.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            {sortedCategories.map(([name, count]) => (
              <Link key={name} href={`/category/${encodeURIComponent(name)}`}>
                <span className="inline-block px-4 py-2 rounded-full bg-muted/30 border border-border text-sm text-muted-foreground hover:border-teal-500/40 transition-colors cursor-pointer">
                  <span className="text-teal-700 dark:text-teal-400 font-semibold mr-1.5">{count}</span>{name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Platform */}
      <section id="platform" className="py-24 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-12">A reference platform, not a folder of files</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f) => (
              <div key={f.title} className="p-8 rounded-xl bg-muted/30 border border-border/60 hover:border-teal-500/30 transition-colors text-left">
                <div className="w-11 h-11 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center mb-5">
                  <f.icon className="w-5 h-5 text-teal-700 dark:text-teal-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Compare */}
      <section id="compare" className="py-24 px-4 bg-gradient-to-b from-transparent to-muted/30">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-center">How {BRAND.parentName} compares</h2>
          <p className="text-lg text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Pre-built library + AI intelligence + platform — not blank pages or dead template files.
          </p>
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/20">
                  <th className="text-left p-4 font-semibold text-muted-foreground">Feature</th>
                  <th className="p-4 font-semibold text-teal-700 dark:text-teal-400">{BRAND.productName}</th>
                  <th className="p-4 font-semibold text-muted-foreground">Notion</th>
                  <th className="p-4 font-semibold text-muted-foreground">Template packs</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row) => (
                  <tr key={row.feature} className="border-b border-border/60 hover:bg-muted/20">
                    <td className="p-4 text-foreground/80 font-medium">{row.feature}</td>
                    <td className="p-4 text-center"><CompareCell value={row.us} highlight /></td>
                    <td className="p-4 text-center"><CompareCell value={row.notion} /></td>
                    <td className="p-4 text-center"><CompareCell value={row.templates} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-12">Working in minutes, not months</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {STEPS.map((s, i) => (
              <div key={s.title} className="relative p-8 rounded-xl bg-muted/30 border border-border/60 text-left">
                <span className="absolute -top-3 left-6 px-3 py-0.5 rounded-md bg-background border border-teal-500/30 text-teal-700 dark:text-teal-400 text-xs font-mono font-semibold">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="text-lg font-semibold mb-2 mt-1">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Templates flywheel */}
      <section id="templates" className="py-24 px-4 border-t border-border/60">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-teal-700 dark:text-teal-400 text-sm font-semibold uppercase tracking-wider mb-3">Templates → Playbooks flywheel</p>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">Start with templates. Scale on the platform.</h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Not ready for SaaS? Buy curated SOP bundles from ${49} — Notion, Markdown, and Google Docs.
                Every bundle includes credit toward {BRAND.productName} when you're ready to run live with AI.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/product/templates">
                  <Button className="bg-teal-500 hover:bg-teal-400 text-black font-semibold w-full sm:w-auto">
                    View template bundles <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link href="/start-trial?plan=professional&utm_source=product&utm_medium=templates_section">
                  <Button variant="outline" className="border-border text-foreground hover:bg-muted/50 w-full sm:w-auto">
                    Skip to free trial
                  </Button>
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { name: 'Starter Pack', price: '$49', docs: '50 SOPs' },
                { name: 'Agency Pack', price: '$99', docs: '100+ ops' },
                { name: 'Complete Library', price: '$199', docs: '280+ docs' },
                { name: 'Template Club', price: '$29/mo', docs: 'All + monthly' },
              ].map((b) => (
                <div key={b.name} className="p-4 rounded-xl bg-muted/30 border border-border">
                  <p className="font-semibold text-sm">{b.name}</p>
                  <p className="text-teal-700 dark:text-teal-400 text-lg font-bold">{b.price}</p>
                  <p className="text-xs text-muted-foreground">{b.docs}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-4 bg-gradient-to-b from-transparent to-muted/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">One plan. Everything.</h2>
          <p className="text-lg text-muted-foreground mb-14">Library + platform + {AI_TOOL_COUNT} AI tools. No tiers, no per-seat math.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-8 rounded-2xl bg-muted/30 border border-border text-left flex flex-col">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Membership</h3>
              <div className="text-5xl font-bold my-4">$39<span className="text-base text-muted-foreground font-medium">/month</span></div>
              <ul className="space-y-3 mb-8 flex-1">
                {[`Full access to all ${totalDocuments} documents`, `${BRAND.aiHubTitle} (${AI_TOOL_COUNT} tools)`, 'Search, collections, annotations', 'PDF, DOCX & zip export', 'Every update as the library grows', 'Cancel anytime'].map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 text-teal-700 dark:text-teal-400 mt-0.5 shrink-0" />{f}
                  </li>
                ))}
              </ul>
              <Button
                variant="outline"
                className="w-full border-border text-foreground hover:bg-muted/50"
                onClick={() => subscribe('monthly')}
                disabled={createCheckout.isPending}
              >
                {createCheckout.isPending ? 'Processing...' : 'Start now'}
              </Button>
            </div>
            <div className="relative p-8 rounded-2xl bg-gradient-to-b from-teal-500/10 to-muted/30 border border-teal-500/30 text-left flex flex-col">
              <span className="absolute -top-3 left-7 px-3.5 py-1 rounded-full bg-teal-500 text-black text-xs font-bold">Founding Member</span>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mt-1">Annual</h3>
              <div className="text-5xl font-bold mt-4 mb-1">$290<span className="text-base text-muted-foreground font-medium">/year</span></div>
              <p className="text-teal-700 dark:text-teal-400 text-sm font-semibold mb-4">Save 38% — price locked permanently</p>
              <ul className="space-y-3 mb-8 flex-1">
                {['Everything in Membership', 'All AI tools included', 'Price locked at $290 — forever', 'Direct line to the founder', 'Your requests shape what gets documented next'].map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 text-teal-700 dark:text-teal-400 mt-0.5 shrink-0" />{f}
                  </li>
                ))}
              </ul>
              <Button
                className="w-full bg-teal-500 hover:bg-teal-400 text-black font-semibold"
                onClick={() => subscribe('annual')}
                disabled={createCheckout.isPending}
              >
                {createCheckout.isPending ? 'Processing...' : 'Become a Founding Member'}
                {!createCheckout.isPending && <ArrowRight className="w-4 h-4 ml-2" />}
              </Button>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-7">Founding pricing ends when the first 10 seats are taken — cohort then closes.</p>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-center">Fair questions</h2>
          <div className="space-y-4">
            {FAQS.map((f) => (
              <details key={f.q} className="rounded-xl bg-muted/30 border border-border overflow-hidden group">
                <summary className="cursor-pointer px-6 py-5 font-semibold text-[15px] list-none flex justify-between items-center">
                  {f.q}<span className="text-teal-700 dark:text-teal-400 text-xl font-normal group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="px-6 pb-5 text-sm text-muted-foreground leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-28 px-4 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(45,212,191,0.08),transparent_70%)]" />
        <div className="max-w-3xl mx-auto text-center relative">
          <h2 className="text-3xl sm:text-5xl font-bold mb-5">Your company, documented — with AI built in.</h2>
          <p className="text-lg text-muted-foreground mb-10">
            The companies that scale cleanly run on structure instead of memory.
            {BRAND.productName} gives you the structure and the intelligence to use it.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-teal-500 hover:bg-teal-400 text-black font-semibold px-8 py-6 text-lg"
              onClick={() => subscribe('annual')}
              disabled={createCheckout.isPending}
            >
              {createCheckout.isPending ? 'Processing...' : 'Become a Founding Member — $290/year'}
              {!createCheckout.isPending && <ArrowRight className="w-5 h-5 ml-2" />}
            </Button>
            <Link href="/ai">
              <Button size="lg" variant="outline" className="border-purple-500/40 text-purple-800 dark:text-purple-200 hover:bg-purple-500/10 px-8 py-6 text-lg">
                Try AI Hub free inside app
              </Button>
            </Link>
          </div>
          <p className="mt-6 text-sm text-muted-foreground font-mono">{totalDocuments} documents · {FUNCTION_COUNT} functions · {AI_TOOL_COUNT} AI tools</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border/60">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <LogoMark size="sm" />
            <span className="text-sm text-muted-foreground">
              {BRAND.productName} — {BRAND.tagline.toLowerCase()}.
            </span>
          </div>
          <div className="flex items-center gap-6 text-xs text-muted-foreground">
            <span>&copy; {new Date().getFullYear()} {BRAND.parentName}</span>
            <span>·</span>
            <span>{BRAND.domain}</span>
            <span>·</span>
            <span>{BRAND.supportEmail}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

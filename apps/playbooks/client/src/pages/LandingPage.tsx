import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import { Link } from 'wouter';
import {
  Search, Layers, History, FolderOpen, Download, Bookmark,
  CheckCircle2, ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { totalDocuments, categoryCounts } from '@/lib/documentCatalog';

const FUNCTION_COUNT = Object.keys(categoryCounts).length;

function LogoMark({ size = 'md' }: { size?: 'sm' | 'md' }) {
  const cls = size === 'sm' ? 'w-7 h-7 text-[10px]' : 'w-8 h-8 text-[11px]';
  return (
    <div className={`${cls} rounded-lg bg-teal-500 text-black font-bold flex items-center justify-center tracking-tight shrink-0`}>
      ARG
    </div>
  );
}

const STATS = [
  { n: String(totalDocuments), label: 'structured operating documents, each one decision-ready' },
  { n: String(FUNCTION_COUNT), label: 'business functions covered, from pricing to security compliance' },
  { n: '0', label: 'documents you have to write before your company has an operating manual' },
];

const AUDIENCES = [
  { title: 'Solo founders', desc: 'Run with the structure of a 50-person company. Reference, decide, execute.' },
  { title: 'Small teams (2–20)', desc: 'One shared source of truth. Onboard people into documented process, not tribal memory.' },
  { title: 'Fractional COOs, consultants & agencies', desc: 'Deliver structured operational documentation to clients without writing it from zero.' },
];

const FEATURES = [
  { icon: Search, title: 'Full-text search', desc: `Find the exact framework in seconds, across all ${totalDocuments} documents.` },
  { icon: Layers, title: 'Structured categories', desc: `${FUNCTION_COUNT} functions, consistently organized. No orphan docs, no duplicates.` },
  { icon: History, title: 'Versioning & freshness', desc: 'Documents carry version history and review status. You know what’s current.' },
  { icon: FolderOpen, title: 'Collections & reading paths', desc: 'Sequence documents into onboarding tracks, launch checklists, or client deliverables.' },
  { icon: Download, title: 'Export', desc: 'PDF, DOCX, and zip export. Your reference travels with you.' },
  { icon: Bookmark, title: 'Annotations & bookmarks', desc: 'Mark what applies to your company. The reference adapts to you.' },
];

const STEPS = [
  { title: 'Join', desc: 'One plan, full library access. No onboarding calls, no configuration.' },
  { title: 'Search or browse', desc: 'Start from your most urgent function: pricing, hiring, launch, compliance.' },
  { title: 'Apply', desc: 'Every document ends in templates and decision tables. Take the structure, fill in your company.' },
];

const FAQS = [
  { q: 'Is this just a template pack?', a: 'No. Templates are dead files. This is a maintained platform: versioned documents, consistent architecture, search, collections, and updates as the library grows. The difference is the same as between a map PDF and a navigation system.' },
  { q: 'Who writes the documents?', a: 'The library is built and maintained by the founder with AI-assisted research and drafting, structured under a single editorial architecture. Every document carries its preparation credit and review status.' },
  { q: 'What if a document I need is missing?', a: 'Founding Members request documents directly. The library grows where its members operate.' },
  { q: 'Can I use these for client work?', a: 'Yes — consultants and fractional operators use the reference to structure client deliverables. White-label arrangements: ask.' },
];

export default function LandingPage() {
  const { user } = useAuth({ redirectOnUnauthenticated: false });
  const { data: stripeConfig } = trpc.stripe.isConfigured.useQuery();
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
      toast.error('Payments are not enabled yet. Email hello@argbuilder.io and we will set you up directly.');
      return;
    }
    createCheckout.mutate({ tierId: 'membership', billingPeriod });
  };

  const sortedCategories = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1]);

  return (
    <div className="min-h-screen bg-[#0B1120] text-white overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0B1120]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LogoMark />
            <span className="text-xl font-bold tracking-tight">ARG-Builder</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-gray-400">
            <a href="#why" className="hover:text-white transition-colors">Why</a>
            <a href="#library" className="hover:text-white transition-colors">Library</a>
            <a href="#platform" className="hover:text-white transition-colors">Platform</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </div>
          <div className="flex items-center gap-3">
            {user ? (
              <Link href="/">
                <Button size="sm" className="bg-teal-500 hover:bg-teal-400 text-black font-semibold">
                  Go to App <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            ) : (
              <a href="#pricing">
                <Button size="sm" className="bg-teal-500 hover:bg-teal-400 text-black font-semibold">
                  Become a Founding Member
                </Button>
              </a>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-teal-500/5 via-transparent to-transparent" />
        <div className="max-w-7xl mx-auto relative text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-500/10 border border-teal-500/20 mb-8">
            <span className="w-2 h-2 rounded-full bg-teal-400" />
            <span className="text-sm font-medium text-teal-300">The complete operating reference for small companies</span>
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.1] mb-6 tracking-tight">
            Every playbook your company needs.<br />
            <span className="bg-gradient-to-r from-teal-400 via-cyan-400 to-teal-300 bg-clip-text text-transparent">
              Already written. Already structured.
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto mb-10 leading-relaxed">
            ARG-Builder is an operating reference platform: {totalDocuments} structured documents covering
            all {FUNCTION_COUNT} functions of a running company — sales, marketing, engineering, finance,
            customer success, security, and more. Searchable, versioned, and organized the way a COO would build it.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#pricing">
              <Button size="lg" className="bg-teal-500 hover:bg-teal-400 text-black font-semibold px-8 py-6 text-lg">
                Become a Founding Member <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </a>
            <a href="#library">
              <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/5 px-8 py-6 text-lg">
                Browse the Library
              </Button>
            </a>
          </div>
          <p className="mt-5 text-sm text-gray-600 font-mono">{totalDocuments} documents · {FUNCTION_COUNT} functions · one decision</p>
          <div className="relative mt-16 mx-auto max-w-5xl">
            <div className="absolute -inset-4 bg-gradient-to-r from-teal-500/20 via-cyan-500/10 to-teal-500/20 rounded-2xl blur-3xl" />
            <div className="relative rounded-xl overflow-hidden border border-white/10 shadow-2xl bg-[#0E1628] p-6 sm:p-8 text-left">
              {/* Mock search bar */}
              <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white/[0.04] border border-white/10 mb-6">
                <Search className="w-4 h-4 text-teal-400 shrink-0" />
                <span className="text-sm text-gray-500">Search {totalDocuments} documents — pricing, hiring, incident response…</span>
              </div>
              {/* Mock document cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { cat: 'Revenue & Pricing', title: 'Pricing Strategy & Financial Models', meta: 'Frameworks · Decision tables · Templates' },
                  { cat: 'Strategy & Operations', title: 'Annual Planning & OKR System', meta: 'Cadence · Metrics · Review templates' },
                  { cat: 'Engineering', title: 'Incident Response Playbook', meta: 'Severity levels · Escalation · Postmortems' },
                ].map((d) => (
                  <div key={d.title} className="p-5 rounded-lg bg-white/[0.03] border border-white/5">
                    <span className="inline-block text-[11px] text-teal-400 font-medium px-2 py-0.5 rounded-full bg-teal-500/10 border border-teal-500/20 mb-3">{d.cat}</span>
                    <p className="text-sm font-semibold text-white leading-snug mb-2">{d.title}</p>
                    <p className="text-xs text-gray-500">{d.meta}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why */}
      <section id="why" className="py-24 px-4 bg-gradient-to-b from-transparent to-white/[0.02]">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-medium mb-6">
            Why this exists
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            You're running a company without an operations manual.<br />
            <span className="text-teal-400">Nobody has time to write one.</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto mb-12 leading-relaxed">
            Solo founders and small teams run on memory and improvisation. The knowledge exists — in courses
            you bought, threads you bookmarked, advice you half-remember — but none of it is structured,
            current, or findable at the moment of decision. Consultants charge five figures to document what
            you need. Template packs give you forty Word files and silence. ARG-Builder is the third option:
            a complete, interconnected operating reference, maintained as software.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {STATS.map((s) => (
              <div key={s.label} className="p-6 rounded-xl bg-white/[0.03] border border-white/5 text-left">
                <div className="text-4xl font-bold text-teal-400 mb-2">{s.n}</div>
                <p className="text-sm text-gray-400">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Audience */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Built for operators, not enterprises</h2>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto mb-12 leading-relaxed">
            ARG-Builder isn't a wiki you have to fill or an enterprise tool you have to configure. It deploys
            complete. Each document follows the same architecture — frameworks, decision tables, templates,
            metrics. Learn the structure once, navigate everything.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {AUDIENCES.map((a) => (
              <div key={a.title} className="p-8 rounded-xl bg-white/[0.03] border border-white/5 hover:border-teal-500/30 transition-colors text-left">
                <h3 className="text-lg font-semibold mb-2">{a.title}</h3>
                <p className="text-sm text-gray-400">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Library */}
      <section id="library" className="py-24 px-4 bg-gradient-to-b from-transparent to-white/[0.02]">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">All {FUNCTION_COUNT} functions. One architecture.</h2>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto mb-10">
            Every document ends in templates and decision tables — take the structure, fill in your company.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            {sortedCategories.map(([name, count]) => (
              <Link key={name} href={`/category/${encodeURIComponent(name)}`}>
                <span className="inline-block px-4 py-2 rounded-full bg-white/[0.03] border border-white/10 text-sm text-gray-400 hover:border-teal-500/40 transition-colors cursor-pointer">
                  <span className="text-teal-400 font-semibold mr-1.5">{count}</span>{name}
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
              <div key={f.title} className="p-8 rounded-xl bg-white/[0.03] border border-white/5 hover:border-teal-500/30 transition-colors text-left">
                <div className="w-11 h-11 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center mb-5">
                  <f.icon className="w-5 h-5 text-teal-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-gray-400">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-4 bg-gradient-to-b from-transparent to-white/[0.02]">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-12">Working in minutes, not months</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {STEPS.map((s, i) => (
              <div key={s.title} className="relative p-8 rounded-xl bg-white/[0.03] border border-white/5 text-left">
                <span className="absolute -top-3 left-6 px-3 py-0.5 rounded-md bg-[#0B1120] border border-teal-500/30 text-teal-400 text-xs font-mono font-semibold">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="text-lg font-semibold mb-2 mt-1">{s.title}</h3>
                <p className="text-sm text-gray-400">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">One plan. Everything.</h2>
          <p className="text-lg text-gray-400 mb-14">No tiers, no per-seat math, no "Contact us."</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Monthly */}
            <div className="p-8 rounded-2xl bg-white/[0.03] border border-white/10 text-left flex flex-col">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Membership</h3>
              <div className="text-5xl font-bold my-4">$39<span className="text-base text-gray-400 font-medium">/month</span></div>
              <ul className="space-y-3 mb-8 flex-1">
                {[`Full access to all ${totalDocuments} documents`, 'Search, collections, annotations', 'PDF, DOCX & zip export', 'Every update as the library grows', 'Cancel anytime'].map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-gray-400">
                    <CheckCircle2 className="w-4 h-4 text-teal-400 mt-0.5 shrink-0" />{f}
                  </li>
                ))}
              </ul>
              <Button
                variant="outline"
                className="w-full border-white/20 text-white hover:bg-white/5"
                onClick={() => subscribe('monthly')}
                disabled={createCheckout.isPending}
              >
                {createCheckout.isPending ? 'Processing...' : 'Start now'}
              </Button>
            </div>
            {/* Founding annual */}
            <div className="relative p-8 rounded-2xl bg-gradient-to-b from-teal-500/10 to-white/[0.02] border border-teal-500/30 text-left flex flex-col">
              <span className="absolute -top-3 left-7 px-3.5 py-1 rounded-full bg-teal-500 text-black text-xs font-bold">Founding Member</span>
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mt-1">Annual</h3>
              <div className="text-5xl font-bold mt-4 mb-1">$290<span className="text-base text-gray-400 font-medium">/year</span></div>
              <p className="text-teal-400 text-sm font-semibold mb-4">Save 38% — price locked permanently</p>
              <ul className="space-y-3 mb-8 flex-1">
                {['Everything in Membership', 'Price locked at $290 — forever', 'Direct line to the founder', 'Your requests shape what gets documented next'].map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-gray-400">
                    <CheckCircle2 className="w-4 h-4 text-teal-400 mt-0.5 shrink-0" />{f}
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
          <p className="text-sm text-gray-600 mt-7">Founding pricing ends when the first 100 seats are taken.</p>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 px-4 bg-gradient-to-b from-transparent to-white/[0.02]">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-center">Fair questions</h2>
          <div className="space-y-4">
            {FAQS.map((f) => (
              <details key={f.q} className="rounded-xl bg-white/[0.03] border border-white/10 overflow-hidden group">
                <summary className="cursor-pointer px-6 py-5 font-semibold text-[15px] list-none flex justify-between items-center">
                  {f.q}<span className="text-teal-400 text-xl font-normal group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="px-6 pb-5 text-sm text-gray-400 leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-28 px-4 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(45,212,191,0.08),transparent_70%)]" />
        <div className="max-w-3xl mx-auto text-center relative">
          <h2 className="text-3xl sm:text-5xl font-bold mb-5">Your company, documented.</h2>
          <p className="text-lg text-gray-400 mb-10">
            The companies that scale cleanly are the ones that run on structure instead of memory.
            The structure is built. Deploy it.
          </p>
          <Button
            size="lg"
            className="bg-teal-500 hover:bg-teal-400 text-black font-semibold px-8 py-6 text-lg"
            onClick={() => subscribe('annual')}
            disabled={createCheckout.isPending}
          >
            {createCheckout.isPending ? 'Processing...' : 'Become a Founding Member — $290/year'}
            {!createCheckout.isPending && <ArrowRight className="w-5 h-5 ml-2" />}
          </Button>
          <p className="mt-6 text-sm text-gray-600 font-mono">{totalDocuments} documents. {FUNCTION_COUNT} functions. One decision.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <LogoMark size="sm" />
            <span className="text-sm text-gray-500">ARG-Builder — the operating reference for companies that run on structure.</span>
          </div>
          <div className="flex items-center gap-6 text-xs text-gray-600">
            <span>&copy; {new Date().getFullYear()} ARG-Builder</span>
            <span>·</span>
            <span>hello@argbuilder.io</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

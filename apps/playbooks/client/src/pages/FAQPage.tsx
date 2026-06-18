import { useState, useMemo } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Search, ChevronDown, HelpCircle, BookOpen, Shield,
  CreditCard, Users, Zap, ArrowRight, MessageSquare
} from 'lucide-react';
import SEO from '@/components/SEO';

interface FAQ {
  question: string;
  answer: string;
  category: string;
}

const CATEGORIES = [
  { key: 'all', label: 'All', icon: HelpCircle },
  { key: 'getting-started', label: 'Getting Started', icon: BookOpen },
  { key: 'features', label: 'Features', icon: Zap },
  { key: 'pricing', label: 'Pricing & Billing', icon: CreditCard },
  { key: 'security', label: 'Security & Privacy', icon: Shield },
  { key: 'team', label: 'Team & Collaboration', icon: Users },
];

const FAQS: FAQ[] = [
  // Getting Started
  { category: 'getting-started', question: 'What is ARG Builder?', answer: 'ARG Builder (Agent Reference Guide Builder) is an enterprise knowledge management platform that helps teams create, organize, and share operational documents. It features AI-powered search, reading progress tracking, knowledge graphs, and team collaboration tools designed for operational excellence.' },
  { category: 'getting-started', question: 'How do I start a free trial?', answer: 'Click "Start Free Trial" on our homepage or visit /start-trial. You\'ll get 14 days of full access to all features with no credit card required. During the trial, you can import documents, invite team members, and explore all capabilities.' },
  { category: 'getting-started', question: 'How long does setup take?', answer: 'Most teams are up and running within 30 minutes. You can bulk import existing documents via CSV, paste URLs to auto-fetch content, or use our templates to create new documents. Our onboarding checklist guides you through the key steps.' },
  { category: 'getting-started', question: 'Can I import existing documentation?', answer: 'Yes! ARG Builder supports multiple import methods: CSV bulk upload, URL-based content fetching, manual creation with our rich editor, and document templates. We support Markdown format for maximum compatibility with existing tools.' },
  // Features
  { category: 'features', question: 'How does AI-powered search work?', answer: 'Our semantic search uses natural language processing to understand the intent behind your queries, not just keyword matching. It searches across document titles, tags, and full content body, returning results ranked by relevance with highlighted snippets.' },
  { category: 'features', question: 'What is the Knowledge Graph?', answer: 'The Knowledge Graph visualizes relationships between your documents — prerequisites, related topics, and category connections. It helps teams understand how knowledge is interconnected and discover documents they might have missed.' },
  { category: 'features', question: 'Can I track who reads what?', answer: 'Yes. ARG Builder tracks reading progress, view counts, and engagement metrics per document. Admins can see team-wide analytics including most-read documents, reading streaks, and individual progress on assigned reading paths.' },
  { category: 'features', question: 'Does it support document versioning?', answer: 'Every document maintains a full version history with timestamps and change tracking. You can view previous versions, compare differences side-by-side, and restore earlier versions if needed.' },
  { category: 'features', question: 'What about quizzes and assessments?', answer: 'Documents can have associated quizzes to verify comprehension. Admins can create multiple-choice questions, track completion rates, and identify knowledge gaps across the team.' },
  // Pricing
  { category: 'pricing', question: 'What plans are available?', answer: 'We offer three tiers: Starter ($29/mo for up to 10 users), Professional ($79/mo for up to 50 users with AI features), and Enterprise (custom pricing for unlimited users with SSO, API access, and dedicated support). All plans include a 14-day free trial.' },
  { category: 'pricing', question: 'Is there a free plan?', answer: 'We offer a 14-day free trial with full access to Professional features. After the trial, you can choose the plan that best fits your team size and needs. No credit card is required to start.' },
  { category: 'pricing', question: 'Can I switch plans later?', answer: 'Yes, you can upgrade or downgrade at any time. Upgrades take effect immediately with prorated billing. Downgrades take effect at the end of your current billing cycle.' },
  { category: 'pricing', question: 'Do you offer annual discounts?', answer: 'Yes! Annual billing saves you 20% compared to monthly payments. Starter is $23/mo billed annually, and Professional is $63/mo billed annually.' },
  // Security
  { category: 'security', question: 'Is my data secure?', answer: 'Absolutely. We use TLS encryption in transit, AES-256 encryption at rest, and follow SOC 2 Type II compliance standards. Your data is hosted on enterprise-grade infrastructure with 99.9% uptime SLA.' },
  { category: 'security', question: 'Do you support SSO/SAML?', answer: 'Enterprise plans include SSO/SAML integration with providers like Okta, Azure AD, and Google Workspace. This allows your team to use existing corporate credentials for seamless access.' },
  { category: 'security', question: 'Where is data stored?', answer: 'Data is stored in secure, SOC 2 compliant data centers. Enterprise customers can choose their preferred data residency region (US, EU, or APAC) to comply with local regulations.' },
  { category: 'security', question: 'Can I enable 2FA?', answer: 'Yes, admin accounts support TOTP-based two-factor authentication. You can enable it from Settings → Security in the admin panel. Recovery codes are provided during setup.' },
  // Team
  { category: 'team', question: 'How do I invite team members?', answer: 'Admins can generate invite links with specific roles (viewer, editor, admin) from the Team Management page. Invitees receive a link to join your workspace with their assigned permissions.' },
  { category: 'team', question: 'What roles are available?', answer: 'Three roles: Viewer (read-only access to published documents), Editor (can create and edit documents), and Admin (full access including user management, settings, and analytics).' },
  { category: 'team', question: 'Can I assign reading paths to team members?', answer: 'Yes! Create reading lists and assign them to team members. Track their progress through the admin dashboard and get notified when they complete assigned materials.' },
  { category: 'team', question: 'Is there an API for integrations?', answer: 'Yes, we provide a REST API for programmatic access to documents, search, and analytics. API documentation is available at /api-docs with authentication guides and code examples.' },
];

export default function FAQPage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());

  const filtered = useMemo(() => {
    return FAQS.filter(faq => {
      const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
      const matchesSearch = !search || 
        faq.question.toLowerCase().includes(search.toLowerCase()) ||
        faq.answer.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [search, activeCategory]);

  const toggleItem = (idx: number) => {
    setOpenItems(prev => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="FAQ - ARG Builder"
        description="Find answers to frequently asked questions about ARG Builder's features, pricing, security, and team collaboration."
      />

      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <span className="text-lg font-bold text-primary cursor-pointer">ARG Builder</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/pricing">
              <span className="text-sm text-muted-foreground hover:text-foreground cursor-pointer">Pricing</span>
            </Link>
            <Link href="/start-trial">
              <Button size="sm">Start Free Trial</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 px-4 text-center">
        <Badge variant="outline" className="mb-4">Help Center</Badge>
        <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
        <p className="text-muted-foreground max-w-xl mx-auto text-lg mb-8">
          Everything you need to know about ARG Builder. Can't find an answer? Contact our team.
        </p>

        {/* Search */}
        <div className="max-w-lg mx-auto relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search questions..."
            className="pl-10"
          />
        </div>
      </section>

      {/* Category Filters */}
      <section className="px-4 pb-8">
        <div className="max-w-4xl mx-auto flex flex-wrap gap-2 justify-center">
          {CATEGORIES.map(cat => (
            <Button
              key={cat.key}
              variant={activeCategory === cat.key ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveCategory(cat.key)}
            >
              <cat.icon className="w-3 h-3 mr-1" />
              {cat.label}
            </Button>
          ))}
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="px-4 pb-16">
        <div className="max-w-3xl mx-auto space-y-2">
          {filtered.length === 0 ? (
            <div className="text-center py-12">
              <HelpCircle className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-50" />
              <p className="text-muted-foreground">No questions match your search</p>
            </div>
          ) : (
            filtered.map((faq, idx) => (
              <div key={idx} className="border border-border rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleItem(idx)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between hover:bg-muted/30 transition"
                >
                  <span className="text-sm font-medium pr-4">{faq.question}</span>
                  <ChevronDown className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform ${openItems.has(idx) ? 'rotate-180' : ''}`} />
                </button>
                {openItems.has(idx) && (
                  <div className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed border-t border-border pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 px-4 bg-muted/30 text-center">
        <MessageSquare className="w-10 h-10 text-primary mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-3">Still Have Questions?</h2>
        <p className="text-muted-foreground max-w-md mx-auto mb-6">
          Our team is happy to help. Book a demo or reach out directly and we'll get back to you within 24 hours.
        </p>
        <div className="flex gap-3 justify-center">
          <Link href="/request-demo">
            <Button className="gap-2">
              Book a Demo <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/resources">
            <Button variant="outline">Browse Resources</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

import { useState } from "react";
import { useLocation } from "wouter";
import { ArrowRight, ArrowLeft, Clock, TrendingUp, Users, CheckCircle } from "lucide-react";
import SEO, { PAGE_SEO } from '@/components/SEO';

const CASE_STUDIES = [
  {
    id: "travel-ops",
    industry: "Travel & Hospitality",
    company: "Meridian Travel Group",
    logo: "MT",
    title: "How Meridian Travel Reduced Onboarding Time by 60%",
    subtitle: "From scattered Google Docs to a living operational knowledge base",
    challenge: "Meridian Travel Group operates 12 boutique travel agencies across 3 countries. Each location had its own way of documenting procedures — some in Google Docs, others in email chains, and many only in senior staff's heads. New hires took 3-4 weeks to become productive, and consistency across locations was a constant struggle.",
    solution: "NexusAI Playbooks centralized all 340+ operational documents into a single, searchable platform. AI-powered categorization organized everything by department, process type, and location. The Knowledge Graph revealed connections between procedures that staff didn't know existed.",
    results: [
      { metric: "60%", label: "Faster onboarding" },
      { metric: "340+", label: "Documents centralized" },
      { metric: "12hrs", label: "Saved per week per team" },
      { metric: "95%", label: "Staff satisfaction" },
    ],
    quote: "Our new hires now find answers in seconds instead of asking 3 different people. The consistency across our locations has improved dramatically.",
    quoteAuthor: "Sarah Chen, Operations Director",
    features: ["AI Search", "Knowledge Graph", "Team Workspaces", "Reading Analytics"],
  },
  {
    id: "creative-studio",
    industry: "Creative & Design",
    company: "Atlas Creative Studio",
    logo: "AC",
    title: "Atlas Creative Eliminated 90% of Repeated Questions",
    subtitle: "Transforming tribal knowledge into accessible, living documentation",
    challenge: "Atlas Creative Studio, a 45-person design and branding agency, struggled with knowledge silos. Designers, copywriters, and project managers each had their own tools and processes. Senior staff spent 8+ hours per week answering the same questions from junior team members.",
    solution: "NexusAI Playbooks became the single source of truth for all workflows, brand guidelines, client processes, and creative standards. AI summaries made long documents scannable, and the quiz feature ensured new hires actually absorbed critical information.",
    results: [
      { metric: "90%", label: "Fewer repeated questions" },
      { metric: "8hrs", label: "Saved per senior staff weekly" },
      { metric: "$180K", label: "Annual productivity gain" },
      { metric: "45", label: "Team members onboarded" },
    ],
    quote: "I used to spend half my Mondays answering the same questions. Now I just point people to NexusAI Playbooks and they find everything themselves.",
    quoteAuthor: "Marcus Williams, Head of Knowledge Management",
    features: ["AI Summaries", "Document Quizzes", "Version Control", "Custom Branding"],
  },
  {
    id: "enterprise-km",
    industry: "Enterprise SaaS",
    company: "Voyager Hospitality Tech",
    logo: "VH",
    title: "Voyager Achieved SOC 2 Compliance 3 Months Faster",
    subtitle: "Using NexusAI Playbooks as the backbone for compliance documentation",
    challenge: "Voyager Hospitality Tech, a 200-person SaaS company, needed to achieve SOC 2 Type II compliance. Their documentation was spread across Confluence, Notion, and SharePoint — making audit preparation a nightmare. The compliance team estimated 6 months of documentation work.",
    solution: "NexusAI Playbooks's workflow system, approval chains, and audit trails provided the documentation infrastructure SOC 2 requires. Automated quality audits flagged gaps, and the compliance reporting feature generated audit-ready exports on demand.",
    results: [
      { metric: "3mo", label: "Faster compliance" },
      { metric: "100%", label: "Audit trail coverage" },
      { metric: "$400K", label: "Saved vs. manual process" },
      { metric: "200+", label: "Policies documented" },
    ],
    quote: "We evaluated Notion, Confluence, and Guru. NexusAI Playbooks won because it's purpose-built for operational documentation with enterprise compliance features baked in.",
    quoteAuthor: "Priya Patel, CTO",
    features: ["Audit Trails", "Workflow Approvals", "Compliance Reports", "API Access"],
  },
];

export default function CaseStudiesPage() {
  const [, navigate] = useLocation();
  const [selectedStudy, setSelectedStudy] = useState<string | null>(null);

  const activeStudy = CASE_STUDIES.find(s => s.id === selectedStudy);

  if (activeStudy) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <button
            onClick={() => setSelectedStudy(null)}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 inline-flex items-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Case Studies
          </button>

          {/* Header */}
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full mb-4">
              {activeStudy.industry}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{activeStudy.title}</h1>
            <p className="text-lg text-muted-foreground">{activeStudy.subtitle}</p>
          </div>

          {/* Results Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {activeStudy.results.map((result) => (
              <div key={result.label} className="bg-card border border-border rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-primary mb-1">{result.metric}</p>
                <p className="text-xs text-muted-foreground">{result.label}</p>
              </div>
            ))}
          </div>

          {/* Challenge */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-foreground mb-3">The Challenge</h2>
            <p className="text-muted-foreground leading-relaxed">{activeStudy.challenge}</p>
          </div>

          {/* Solution */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-foreground mb-3">The Solution</h2>
            <p className="text-muted-foreground leading-relaxed">{activeStudy.solution}</p>
          </div>

          {/* Features Used */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-foreground mb-3">Key Features Used</h2>
            <div className="flex flex-wrap gap-2">
              {activeStudy.features.map((feature) => (
                <span key={feature} className="inline-flex items-center gap-1 px-3 py-1.5 bg-muted text-foreground text-sm rounded-lg">
                  <CheckCircle className="w-3 h-3 text-green-500" />
                  {feature}
                </span>
              ))}
            </div>
          </div>

          {/* Quote */}
          <div className="bg-card border border-border rounded-xl p-6 mb-12">
            <p className="text-foreground italic mb-4 leading-relaxed">"{activeStudy.quote}"</p>
            <p className="text-sm text-muted-foreground">— {activeStudy.quoteAuthor}</p>
          </div>

          {/* CTA */}
          <div className="text-center bg-primary/5 border border-primary/20 rounded-xl p-8">
            <h3 className="text-xl font-bold text-foreground mb-2">Ready to see similar results?</h3>
            <p className="text-muted-foreground mb-6">Start your 14-day free trial and see how NexusAI Playbooks can transform your operations.</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => navigate("/start-trial?plan=professional")}
                className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 inline-flex items-center gap-2"
              >
                Start Free Trial <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigate("/pricing")}
                className="bg-muted text-foreground px-6 py-3 rounded-lg font-medium hover:bg-muted/80"
              >
                View Pricing
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEO {...PAGE_SEO.caseStudies} />
      <div className="max-w-6xl mx-auto px-4 py-16">
        <button
          onClick={() => navigate("/product")}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 inline-flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </button>

        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Customer Success Stories</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            See how teams across industries use NexusAI Playbooks to transform their operational knowledge management.
          </p>
        </div>

        {/* Case Study Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {CASE_STUDIES.map((study) => (
            <div
              key={study.id}
              onClick={() => setSelectedStudy(study.id)}
              className="bg-card border border-border rounded-xl p-6 cursor-pointer hover:border-primary/50 transition-colors group"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <span className="text-sm font-bold text-primary">{study.logo}</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{study.company}</p>
                  <p className="text-xs text-muted-foreground">{study.industry}</p>
                </div>
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                {study.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">{study.subtitle}</p>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {study.results.slice(0, 2).map((r) => (
                  <div key={r.label} className="text-center">
                    <p className="text-lg font-bold text-primary">{r.metric}</p>
                    <p className="text-xs text-muted-foreground">{r.label}</p>
                  </div>
                ))}
              </div>
              <span className="text-sm text-primary font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                Read full story <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Join these teams</h2>
          <p className="text-muted-foreground mb-6">Start your free trial and see results within the first week.</p>
          <button
            onClick={() => navigate("/start-trial?plan=professional")}
            className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-medium hover:bg-primary/90 inline-flex items-center gap-2"
          >
            Start 14-Day Free Trial <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

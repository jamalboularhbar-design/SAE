import { useState } from "react";
import { useLocation } from "wouter";
import { ArrowRight, ArrowLeft, Clock, TrendingUp, Users, CheckCircle } from "lucide-react";
import SEO, { PAGE_SEO } from '@/components/SEO';

import { DEMO_WORKSPACES } from '@/lib/brand';

const CASE_STUDIES = [
  {
    id: "riad-routes",
    industry: "Travel & Concierge",
    company: DEMO_WORKSPACES.travel.name,
    logo: "R&R",
    title: "How Riad & Routes Scaled Luxury Concierge Ops Without Losing the Personal Touch",
    subtitle: "Live case study — operational playbooks for Morocco luxury travel",
    challenge: "Riad & Routes coordinates high-net-worth American travelers across riads, hotels, drivers, and experiences in Morocco. SOPs lived in WhatsApp threads, Google Docs, and senior concierges' heads. Provider coordination and guest anticipation were hard to replicate as the team grew.",
    solution: "NexusAI Playbooks centralized guest journeys, provider SLAs, WhatsApp templates, and escalation paths into one searchable system. Dual workspace views let the team switch between travel ops and the linked ArtKech creative studio.",
    results: [
      { metric: "94%", label: "Team adoption (10 days)" },
      { metric: "38%", label: "Ops efficiency gain" },
      { metric: "14hrs", label: "Build time to live system" },
      { metric: "420%", label: "Documented ROI" },
    ],
    quote: "We needed one place for guest protocols, provider comms, and seasonal pricing — not another blank Notion workspace.",
    quoteAuthor: "Jamal Boularhbar, Founder",
    features: ["Multi-brand Workspaces", "Provider Directory", "WhatsApp Templates", "Guest CRM"],
    liveCaseStudy: true,
  },
  {
    id: "artkech",
    industry: "Creative & Design",
    company: DEMO_WORKSPACES.creative.name,
    logo: "AK",
    title: "ArtKech Turned Creative Studio Chaos Into Repeatable Delivery",
    subtitle: "Live case study — brand, production, and client ops in one platform",
    challenge: "ArtKech Design Studio runs brand identity, editorial design, print production, and photography. Briefs, revisions, freelancer handoffs, and client approvals were scattered across email, Drive, and DMs — causing missed deadlines and inconsistent quality.",
    solution: "Playbooks mapped creative brief intake, design review, preflight QA, and invoicing into linked documents. The studio workspace shares taxonomy with Riad & Routes for founder-led multi-brand operations.",
    results: [
      { metric: "89%", label: "Team adoption (14 days)" },
      { metric: "32%", label: "Delivery efficiency gain" },
      { metric: "16hrs", label: "Build time to live system" },
      { metric: "380%", label: "Documented ROI" },
    ],
    quote: "Our studio finally has one source of truth for how we take a brief from intake to shipped work.",
    quoteAuthor: "Jamal Boularhbar, Founder",
    features: ["Creative Workflows", "Freelancer SOPs", "Client Portal", "Version Control"],
    liveCaseStudy: true,
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
            <p className="text-muted-foreground mb-6">Start your 14-day free trial or calculate your team's ROI first.</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <button
                onClick={() => navigate("/start-trial?plan=professional&utm_source=case_study&utm_medium=detail")}
                className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 inline-flex items-center gap-2"
              >
                Start Free Trial <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigate("/roi")}
                className="bg-muted text-foreground px-6 py-3 rounded-lg font-medium hover:bg-muted/80 inline-flex items-center gap-2"
              >
                ROI Calculator
              </button>
              <button
                onClick={() => navigate("/product/templates")}
                className="border border-border text-foreground px-6 py-3 rounded-lg font-medium hover:bg-muted/50 inline-flex items-center gap-2"
              >
                Browse templates
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
          <p className="text-muted-foreground mb-6">Start your free trial, calculate ROI, or explore template bundles first.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => navigate("/start-trial?plan=professional&utm_source=case_studies&utm_medium=footer")}
              className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-medium hover:bg-primary/90 inline-flex items-center gap-2"
            >
              Start 14-Day Free Trial <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate("/roi")}
              className="bg-muted text-foreground px-6 py-3 rounded-lg font-medium hover:bg-muted/80"
            >
              ROI Calculator
            </button>
            <button
              onClick={() => navigate("/product/templates")}
              className="border border-border text-foreground px-6 py-3 rounded-lg font-medium hover:bg-muted/50"
            >
              Template bundles
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

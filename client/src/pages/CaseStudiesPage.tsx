import { useState, useEffect } from "react";
import { useLocation, useSearch } from "wouter";
import { ArrowRight, ArrowLeft, CheckCircle } from "lucide-react";
import SEO, { PAGE_SEO } from "@/components/SEO";
import VerticalShowcase from "@/components/VerticalShowcase";
import { Badge } from "@/components/ui/badge";
import { CASE_STUDIES, caseStudyStatusLabel } from "@shared/caseStudies";

export default function CaseStudiesPage() {
  const [, navigate] = useLocation();
  const search = useSearch();
  const params = new URLSearchParams(search);
  const studyFromUrl = params.get("study");

  const [selectedStudy, setSelectedStudy] = useState<string | null>(studyFromUrl);

  useEffect(() => {
    if (studyFromUrl) setSelectedStudy(studyFromUrl);
  }, [studyFromUrl]);

  const activeStudy = CASE_STUDIES.find((s) => s.id === selectedStudy);

  if (activeStudy) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <button
            onClick={() => {
              setSelectedStudy(null);
              navigate("/case-studies");
            }}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 inline-flex items-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Case Studies
          </button>

          <div className="mb-12">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <Badge variant="outline">{activeStudy.industry}</Badge>
              <Badge variant={activeStudy.status === "live" ? "default" : "secondary"}>
                {caseStudyStatusLabel(activeStudy)}
              </Badge>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {activeStudy.title}
            </h1>
            <p className="text-lg text-muted-foreground">{activeStudy.subtitle}</p>
            {activeStudy.improvementsNeeded && activeStudy.improvementNotes && (
              <p className="mt-4 text-sm text-muted-foreground border-l-2 border-amber-500/50 pl-3">
                Tracked in Notion Case Study Tracker — active improvement focus.
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {activeStudy.results.map((result) => (
              <div
                key={result.label}
                className="bg-card border border-border rounded-xl p-4 text-center"
              >
                <p className="text-2xl font-bold text-primary mb-1">{result.metric}</p>
                <p className="text-xs text-muted-foreground">{result.label}</p>
              </div>
            ))}
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-bold text-foreground mb-3">The Challenge</h2>
            <p className="text-muted-foreground leading-relaxed">{activeStudy.challenge}</p>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-bold text-foreground mb-3">The Solution</h2>
            <p className="text-muted-foreground leading-relaxed">{activeStudy.solution}</p>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-bold text-foreground mb-3">Key Features Used</h2>
            <div className="flex flex-wrap gap-2">
              {activeStudy.features.map((feature) => (
                <span
                  key={feature}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-muted text-foreground text-sm rounded-lg"
                >
                  <CheckCircle className="w-3 h-3 text-green-500" />
                  {feature}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 mb-12">
            <p className="text-foreground italic mb-4 leading-relaxed">"{activeStudy.quote}"</p>
            <p className="text-sm text-muted-foreground">— {activeStudy.quoteAuthor}</p>
          </div>

          <div className="text-center bg-primary/5 border border-primary/20 rounded-xl p-8">
            <h3 className="text-xl font-bold text-foreground mb-2">Ready to see similar results?</h3>
            <p className="text-muted-foreground mb-6">
              Start your 14-day free trial or calculate your team&apos;s ROI first.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <button
                onClick={() =>
                  navigate("/start-trial?plan=professional&utm_source=case_study&utm_medium=detail")
                }
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

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Customer Success Stories
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Two live case studies on argbuilder.io plus reference verticals for agency and
            hospitality — tracked in our Notion Case Study Tracker.
          </p>
        </div>

        <VerticalShowcase compact />

        <div className="grid md:grid-cols-2 gap-6 mb-16 mt-10">
          {CASE_STUDIES.map((study) => (
            <div
              key={study.id}
              onClick={() => setSelectedStudy(study.id)}
              className="bg-card border border-border rounded-xl p-6 cursor-pointer hover:border-primary/50 transition-colors group"
            >
              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <span className="text-sm font-bold text-primary">{study.logo}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{study.company}</p>
                    <p className="text-xs text-muted-foreground">{study.industry}</p>
                  </div>
                </div>
                <Badge variant={study.status === "live" ? "default" : "outline"} className="text-[10px]">
                  {caseStudyStatusLabel(study)}
                </Badge>
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

        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Join these teams</h2>
          <p className="text-muted-foreground mb-6">
            Start your free trial, calculate ROI, or explore template bundles first.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() =>
                navigate("/start-trial?plan=professional&utm_source=case_studies&utm_medium=footer")
              }
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
          </div>
        </div>
      </div>
    </div>
  );
}

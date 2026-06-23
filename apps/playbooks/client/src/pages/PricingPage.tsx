import { useState } from "react";
import { useLocation } from "wouter";
import SEO, { PAGE_SEO } from "@/components/SEO";
import { Check, ArrowRight, Crown, Zap, Mail } from "lucide-react";
import {
  BOOTSTRAP_PRICING,
  MEMBERSHIP_FEATURES,
  FOUNDING_EXTRAS,
} from "@shared/pricing";

export default function PricingPage() {
  const [annual, setAnnual] = useState(true);
  const [, navigate] = useLocation();
  const { membership, founding, morocco } = BOOTSTRAP_PRICING;

  return (
    <div className="min-h-screen bg-background">
      <SEO {...PAGE_SEO.pricing} />
      <div className="max-w-5xl mx-auto px-4 pt-16 pb-16">
        <button
          onClick={() => navigate("/")}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 inline-flex items-center gap-1"
        >
          ← Back to library
        </button>

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            One plan. Two ways to join.
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Full access to 570+ operational playbooks, the knowledge graph, AI hub, and Nexus OS early access.
          </p>

          <div className="inline-flex items-center gap-3 bg-card border border-border rounded-full p-1.5 mt-8">
            <button
              onClick={() => setAnnual(false)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                !annual ? "bg-primary text-primary-foreground" : "text-muted-foreground"
              }`}
            >
              Monthly — ${membership.monthlyUsd}/mo
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                annual ? "bg-primary text-primary-foreground" : "text-muted-foreground"
              }`}
            >
              Founding — ${founding.annualUsd}/yr
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Membership */}
          <div
            className={`rounded-2xl border p-8 ${!annual ? "border-accent ring-2 ring-accent/30" : "border-border"}`}
          >
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-accent" />
              <h2 className="text-xl font-bold">{membership.name}</h2>
            </div>
            <div className="mb-6">
              <span className="text-4xl font-bold">${membership.monthlyUsd}</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <p className="text-sm text-muted-foreground mb-6">{membership.description}</p>
            <ul className="space-y-3 mb-8">
              {MEMBERSHIP_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm">
                  <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>
            <button
              onClick={() => navigate("/product")}
              className="w-full py-3 rounded-lg bg-muted hover:bg-muted/80 text-foreground font-medium transition-colors"
            >
              Start membership
            </button>
          </div>

          {/* Founding */}
          <div
            className={`rounded-2xl border p-8 relative ${annual ? "border-accent ring-2 ring-accent/30 bg-accent/5" : "border-border"}`}
          >
            <span className="absolute -top-3 left-6 px-3 py-0.5 bg-accent text-accent-foreground text-xs font-semibold rounded-full">
              Founding — {founding.seatCap} seats
            </span>
            <div className="flex items-center gap-2 mb-4 mt-2">
              <Crown className="w-5 h-5 text-accent" />
              <h2 className="text-xl font-bold">{founding.name}</h2>
            </div>
            <div className="mb-6">
              <span className="text-4xl font-bold">${founding.annualUsd}</span>
              <span className="text-muted-foreground">/year</span>
              <p className="text-xs text-muted-foreground mt-1">
                ≈ ${founding.monthlyEquivalentUsd}/mo — price locked forever
              </p>
            </div>
            <p className="text-sm text-muted-foreground mb-4">{founding.description}</p>
            <ul className="space-y-3 mb-8">
              {FOUNDING_EXTRAS.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm">
                  <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>
            <button
              onClick={() => navigate("/request-demo")}
              className="w-full py-3 rounded-lg bg-accent hover:bg-accent/90 text-accent-foreground font-medium transition-colors flex items-center justify-center gap-2"
            >
              Request founding access
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Morocco */}
        <div className="rounded-2xl border border-border bg-muted/30 p-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Mail className="w-5 h-5 text-accent" />
            <h3 className="text-lg font-semibold">{morocco.label}</h3>
          </div>
          <p className="text-muted-foreground max-w-xl mx-auto mb-4">{morocco.note}</p>
          <p className="text-sm text-muted-foreground mb-4">
            Founding annual ≈ {morocco.annualMadApprox.toLocaleString()} MAD · Facture proforma sur demande
          </p>
          <a
            href={`mailto:${morocco.contactEmail}?subject=ARG-Builder%20—%20Client%20fondateur%20Maroc`}
            className="inline-flex items-center gap-2 text-accent hover:underline font-medium"
          >
            {morocco.contactEmail}
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}

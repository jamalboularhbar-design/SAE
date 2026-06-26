import { useState } from "react";
import { useLocation, Link } from "wouter";
import SEO, { PAGE_SEO } from "@/components/SEO";
import JsonLd from "@/components/marketing/JsonLd";
import MarketingNav from "@/components/MarketingNav";
import SocialProofStrip from "@/components/product/SocialProofStrip";
import FoundingUrgencyBar from "@/components/marketing/FoundingUrgencyBar";
import { Check, ArrowRight, Crown, Zap, Mail, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BRAND } from "@/lib/brand";
import {
  BOOTSTRAP_PRICING,
  MEMBERSHIP_FEATURES,
  FOUNDING_EXTRAS,
} from "@shared/pricing";
import { PLATFORM_STATS } from "@shared/platformStats";

const AI_TOOL_COUNT = PLATFORM_STATS.aiTools;

export default function PricingPage() {
  const [annual, setAnnual] = useState(true);
  const [, navigate] = useLocation();
  const { membership, founding, morocco } = BOOTSTRAP_PRICING;

  const monthlyAnnualCost = membership.monthlyUsd * 12;
  const foundingSavings = monthlyAnnualCost - founding.annualUsd;
  const savingsPercent = Math.round((foundingSavings / monthlyAnnualCost) * 100);

  return (
    <div className="min-h-screen bg-background">
      <SEO {...PAGE_SEO.pricing} canonical={`${BRAND.appUrl}/pricing`} />
      <JsonLd
        id="pricing-offers"
        data={{
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: `${BRAND.productName} Membership`,
          description: membership.description,
          offers: [
            {
              '@type': 'Offer',
              name: membership.name,
              price: String(membership.monthlyUsd),
              priceCurrency: 'USD',
              priceSpecification: { '@type': 'UnitPriceSpecification', billingDuration: 'P1M' },
            },
            {
              '@type': 'Offer',
              name: founding.name,
              price: String(founding.annualUsd),
              priceCurrency: 'USD',
              priceSpecification: { '@type': 'UnitPriceSpecification', billingDuration: 'P1Y' },
            },
          ],
        }}
      />

      <MarketingNav subtitle="Pricing" backHref="/product" backLabel="Product" showProductLinks={false} />

      <div className="max-w-5xl mx-auto px-4 pt-28 pb-16">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            One plan. Everything included.
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Full access to 570+ playbooks, knowledge graph, {BRAND.aiHubName}, and {BRAND.nexusOsName} early access.
            No per-seat math. No feature tiers.
          </p>
        </div>

        <FoundingUrgencyBar className="mb-10" />

        <div className="inline-flex items-center gap-3 bg-card border border-border rounded-full p-1.5 mx-auto flex w-fit mb-12">
          <button
            type="button"
            onClick={() => setAnnual(false)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              !annual ? "bg-primary text-primary-foreground" : "text-muted-foreground"
            }`}
          >
            Monthly — ${membership.monthlyUsd}/mo
          </button>
          <button
            type="button"
            onClick={() => setAnnual(true)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              annual ? "bg-primary text-primary-foreground" : "text-muted-foreground"
            }`}
          >
            Founding — ${founding.annualUsd}/yr
            <span className="ml-1.5 text-xs opacity-80">save {savingsPercent}%</span>
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
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
              <p className="text-xs text-muted-foreground mt-1">Cancel anytime</p>
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
            <Link href="/product#pricing">
              <Button variant="outline" className="w-full border-border">
                Start membership
              </Button>
            </Link>
          </div>

          <div
            className={`rounded-2xl border p-8 relative ${annual ? "border-teal-500/50 ring-2 ring-teal-500/25 bg-teal-500/5" : "border-border"}`}
          >
            <span className="absolute -top-3 left-6 px-3 py-0.5 bg-teal-500 text-black text-xs font-bold rounded-full">
              Founding — {founding.seatCap} seats
            </span>
            <div className="flex items-center gap-2 mb-4 mt-2">
              <Crown className="w-5 h-5 text-teal-600" />
              <h2 className="text-xl font-bold">{founding.name}</h2>
            </div>
            <div className="mb-4">
              <span className="text-4xl font-bold">${founding.annualUsd}</span>
              <span className="text-muted-foreground">/year</span>
              <p className="text-sm text-teal-700 dark:text-teal-400 font-semibold mt-1">
                Save ${foundingSavings}/yr ({savingsPercent}%) — price locked forever
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                ≈ ${founding.monthlyEquivalentUsd}/mo equivalent
              </p>
            </div>
            <p className="text-sm text-muted-foreground mb-4">{founding.description}</p>
            <ul className="space-y-3 mb-8">
              {MEMBERSHIP_FEATURES.map((f) => (
                <li key={`m-${f}`} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Check className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
              {FOUNDING_EXTRAS.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm font-medium">
                  <Crown className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/request-demo">
              <Button className="w-full bg-teal-500 hover:bg-teal-400 text-black font-semibold gap-2">
                Request founding access
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="mb-12">
          <SocialProofStrip />
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="rounded-xl border border-border p-6 flex gap-3">
            <Shield className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold mb-1">Everything in one plan</h3>
              <p className="text-sm text-muted-foreground">
                Library, graph, {AI_TOOL_COUNT} AI tools, export, and {BRAND.nexusOsName} early access — no upsells for &ldquo;enterprise AI.&rdquo;
              </p>
            </div>
          </div>
          <div className="rounded-xl border border-border p-6 flex gap-3">
            <Crown className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold mb-1">Founding cohort closes</h3>
              <p className="text-sm text-muted-foreground">
                When {founding.seatCap} founding seats fill, annual pricing moves to standard rates. Founding members keep ${founding.annualUsd}/yr permanently.
              </p>
            </div>
          </div>
        </div>

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
            className="inline-flex items-center gap-2 text-teal-600 hover:underline font-medium"
          >
            {morocco.contactEmail}
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        <button
          type="button"
          onClick={() => navigate("/product")}
          className="mt-8 text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
        >
          ← Back to product overview
        </button>
      </div>
    </div>
  );
}

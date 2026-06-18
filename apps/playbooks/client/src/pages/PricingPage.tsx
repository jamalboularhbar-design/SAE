import { useState } from "react";
import { useLocation } from "wouter";
import SEO, { PAGE_SEO } from '@/components/SEO';
import { Check, X, Zap, Building2, Crown, ArrowRight } from "lucide-react";

const PLANS = [
  {
    id: "starter",
    name: "Starter",
    description: "For small teams getting organized",
    monthlyPrice: 29,
    annualPrice: 24,
    icon: Zap,
    highlight: false,
    features: [
      { name: "Up to 100 documents", included: true },
      { name: "5 team members", included: true },
      { name: "Basic search & navigation", included: true },
      { name: "Document versioning", included: true },
      { name: "Email support", included: true },
      { name: "Custom branding", included: false },
      { name: "AI-powered summaries", included: false },
      { name: "Advanced analytics", included: false },
      { name: "API access", included: false },
      { name: "SSO / SAML", included: false },
      { name: "Dedicated account manager", included: false },
      { name: "Custom integrations", included: false },
    ],
  },
  {
    id: "professional",
    name: "Professional",
    description: "For growing teams that need more power",
    monthlyPrice: 79,
    annualPrice: 66,
    icon: Building2,
    highlight: true,
    badge: "Most Popular",
    features: [
      { name: "Unlimited documents", included: true },
      { name: "25 team members", included: true },
      { name: "Advanced search with AI", included: true },
      { name: "Document versioning & diff", included: true },
      { name: "Priority email & chat support", included: true },
      { name: "Custom branding", included: true },
      { name: "AI-powered summaries", included: true },
      { name: "Advanced analytics", included: true },
      { name: "API access", included: false },
      { name: "SSO / SAML", included: false },
      { name: "Dedicated account manager", included: false },
      { name: "Custom integrations", included: false },
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "For organizations that demand the best",
    monthlyPrice: 199,
    annualPrice: 166,
    icon: Crown,
    highlight: false,
    features: [
      { name: "Unlimited documents", included: true },
      { name: "Unlimited team members", included: true },
      { name: "Advanced search with AI", included: true },
      { name: "Document versioning & diff", included: true },
      { name: "24/7 priority support", included: true },
      { name: "Custom branding", included: true },
      { name: "AI-powered summaries", included: true },
      { name: "Advanced analytics & reports", included: true },
      { name: "Full API access", included: true },
      { name: "SSO / SAML", included: true },
      { name: "Dedicated account manager", included: true },
      { name: "Custom integrations", included: true },
    ],
  },
];

export default function PricingPage() {
  const [annual, setAnnual] = useState(true);
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-background">
      <SEO {...PAGE_SEO.pricing} />
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 pt-16 pb-12 text-center">
        <button
          onClick={() => navigate("/")}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 inline-flex items-center gap-1"
        >
          ← Back to Home
        </button>
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
          Simple, Transparent Pricing
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
          Choose the plan that fits your team. All plans include a 14-day free trial with no credit card required.
        </p>

        {/* Billing Toggle */}
        <div className="inline-flex items-center gap-3 bg-card border border-border rounded-full p-1.5">
          <button
            onClick={() => setAnnual(false)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              !annual ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setAnnual(true)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              annual ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Annual <span className="text-xs opacity-80">Save 17%</span>
          </button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-4 pb-20">
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {PLANS.map((plan) => {
            const price = annual ? plan.annualPrice : plan.monthlyPrice;
            const Icon = plan.icon;
            return (
              <div
                key={plan.id}
                className={`relative rounded-2xl p-8 transition-all ${
                  plan.highlight
                    ? "bg-card border-2 border-primary shadow-lg shadow-primary/10 scale-[1.02]"
                    : "bg-card border border-border"
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-4 py-1 rounded-full">
                    {plan.badge}
                  </div>
                )}

                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-2 rounded-lg ${plan.highlight ? "bg-primary/10" : "bg-muted"}`}>
                      <Icon className={`w-5 h-5 ${plan.highlight ? "text-primary" : "text-foreground"}`} />
                    </div>
                    <h3 className="text-xl font-bold text-foreground">{plan.name}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-foreground">${price}</span>
                    <span className="text-muted-foreground">/mo</span>
                  </div>
                  {annual && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Billed annually (${price * 12}/year)
                    </p>
                  )}
                </div>

                <button
                  onClick={() => navigate(`/start-trial?plan=${plan.id}`)}
                  className={`w-full py-3 px-4 rounded-lg font-medium text-sm transition-colors mb-8 inline-flex items-center justify-center gap-2 ${
                    plan.highlight
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "bg-muted text-foreground hover:bg-muted/80"
                  }`}
                >
                  Start Free Trial
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="space-y-3">
                  {plan.features.map((feature) => (
                    <div key={feature.name} className="flex items-center gap-3">
                      {feature.included ? (
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                      ) : (
                        <X className="w-4 h-4 text-muted-foreground/40 flex-shrink-0" />
                      )}
                      <span className={`text-sm ${feature.included ? "text-foreground" : "text-muted-foreground/60"}`}>
                        {feature.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Enterprise CTA */}
        <div className="mt-16 text-center bg-card border border-border rounded-2xl p-8 md:p-12">
          <h2 className="text-2xl font-bold text-foreground mb-3">Need a custom solution?</h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-6">
            For teams with 100+ members, compliance requirements, or custom integration needs, we offer tailored enterprise packages.
          </p>
          <button
            onClick={() => navigate("/product")}
            className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
          >
            Contact Sales
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* FAQ */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              { q: "How does the 14-day trial work?", a: "You get full access to all features in your chosen plan for 14 days. No credit card required. At the end of the trial, you can upgrade to continue or your access will be paused." },
              { q: "Can I switch plans later?", a: "Absolutely. You can upgrade or downgrade at any time. When upgrading, you'll get immediate access to new features. Downgrades take effect at the next billing cycle." },
              { q: "What happens to my data if I cancel?", a: "Your data is retained for 30 days after cancellation. You can export everything at any time. After 30 days, data is permanently deleted." },
              { q: "Do you offer discounts for nonprofits or education?", a: "Yes! We offer 50% off for verified nonprofits and educational institutions. Contact our sales team to apply." },
              { q: "Is there a setup fee?", a: "No setup fees for Starter or Professional plans. Enterprise plans include complimentary onboarding and data migration assistance." },
            ].map((faq, i) => (
              <details key={i} className="group bg-card border border-border rounded-lg">
                <summary className="flex items-center justify-between cursor-pointer p-4 text-sm font-medium text-foreground">
                  {faq.q}
                  <span className="text-muted-foreground group-open:rotate-180 transition-transform">▾</span>
                </summary>
                <p className="px-4 pb-4 text-sm text-muted-foreground">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

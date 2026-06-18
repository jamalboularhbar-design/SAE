import { useState } from "react";
import { useLocation, useSearch } from "wouter";
import { trpc } from "@/lib/trpc";
import { Check, ArrowRight, Sparkles } from "lucide-react";
import SEO, { PAGE_SEO } from '@/components/SEO';

export default function StartTrialPage() {
  const [, navigate] = useLocation();
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const preselectedPlan = params.get("plan") || "professional";

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    companyName: "",
    teamSize: "",
    useCase: "",
    planTier: preselectedPlan as "starter" | "professional" | "enterprise",
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const startTrialMutation = trpc.trials.startTrial.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.fullName || !formData.email) {
      setError("Please fill in your name and email");
      return;
    }

    try {
      // Capture UTM params from URL
      const utmSource = params.get("utm_source") || undefined;
      const utmMedium = params.get("utm_medium") || undefined;
      const utmCampaign = params.get("utm_campaign") || undefined;

      const result = await startTrialMutation.mutateAsync({
        ...formData,
        utmSource,
        utmMedium,
        utmCampaign,
        referrer: document.referrer || undefined,
      });

      if (result.success) {
        setSubmitted(true);
      } else {
        setError(result.error || "Something went wrong");
      }
    } catch (err: any) {
      setError(err.message || "Failed to start trial");
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-8 h-8 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-3">Your trial is active!</h1>
          <p className="text-muted-foreground mb-6">
            Welcome aboard! You have 14 days of full access to the {formData.planTier} plan.
            Check your email for a welcome guide with tips to get started.
          </p>
          <div className="bg-card border border-border rounded-lg p-4 mb-6 text-left">
            <h3 className="text-sm font-semibold text-foreground mb-2">What's next:</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                Explore 500+ operational documents
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                Try AI-powered search and summaries
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                Set up your team workspace
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                Book a demo for personalized onboarding
              </li>
            </ul>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate("/")}
              className="flex-1 bg-primary text-primary-foreground py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Start Exploring
            </button>
            <button
              onClick={() => navigate("/product")}
              className="flex-1 bg-muted text-foreground py-3 rounded-lg font-medium hover:bg-muted/80 transition-colors"
            >
              Book a Demo
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEO {...PAGE_SEO.startTrial} />
      <div className="max-w-6xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-12 items-start">
        {/* Left: Form */}
        <div>
          <button
            onClick={() => navigate("/pricing")}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors mb-6 inline-flex items-center gap-1"
          >
            ← Back to Pricing
          </button>
          <h1 className="text-3xl font-bold text-foreground mb-2">Start Your Free Trial</h1>
          <p className="text-muted-foreground mb-8">
            14 days of full access. No credit card required.
          </p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg p-3 mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Full Name *</label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="John Smith"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Work Email *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="john@company.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Company Name</label>
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Acme Corp"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Team Size</label>
              <select
                value={formData.teamSize}
                onChange={(e) => setFormData({ ...formData, teamSize: e.target.value })}
                className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="">Select team size</option>
                <option value="1-5">1-5 people</option>
                <option value="6-20">6-20 people</option>
                <option value="21-50">21-50 people</option>
                <option value="51-200">51-200 people</option>
                <option value="200+">200+ people</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Primary Use Case</label>
              <textarea
                value={formData.useCase}
                onChange={(e) => setFormData({ ...formData, useCase: e.target.value })}
                className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                rows={3}
                placeholder="How do you plan to use ARG Builder? (e.g., team onboarding, SOPs, knowledge base...)"
              />
            </div>

            <button
              type="submit"
              disabled={startTrialMutation.isPending}
              className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 inline-flex items-center justify-center gap-2"
            >
              {startTrialMutation.isPending ? "Starting..." : "Start 14-Day Free Trial"}
              <ArrowRight className="w-4 h-4" />
            </button>

            <p className="text-xs text-muted-foreground text-center">
              No credit card required. Cancel anytime during your trial.
            </p>
          </form>
        </div>

        {/* Right: Benefits */}
        <div className="bg-card border border-border rounded-2xl p-8 sticky top-8">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold text-foreground">What you'll get</h2>
          </div>

          <div className="space-y-4 mb-8">
            {[
              "Full access to 500+ operational documents",
              "AI-powered search, summaries & recommendations",
              "Team collaboration with role-based access",
              "Document versioning & change tracking",
              "Advanced analytics & reading insights",
              "Custom branding & white-labeling",
              "Knowledge graph visualization",
              "API access for integrations",
            ].map((benefit, i) => (
              <div key={i} className="flex items-start gap-3">
                <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-foreground">{benefit}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-border pt-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-lg font-bold text-primary">R</span>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Riad & Routes</p>
                <p className="text-xs text-muted-foreground">Travel & Creative Studio</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground italic">
              "ARG Builder transformed how we manage our operational knowledge. Our team onboarding time dropped by 60% and everyone can find what they need instantly."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

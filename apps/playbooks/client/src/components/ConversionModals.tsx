import { useState, useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import { X, Clock, Gift, ArrowRight } from "lucide-react";

/**
 * Exit Intent Modal - Shows when user moves cursor to leave the page
 * Only shown once per session on marketing pages
 */
export function ExitIntentModal() {
  const [show, setShow] = useState(false);
  const [, navigate] = useLocation();

  const handleMouseLeave = useCallback((e: MouseEvent) => {
    if (e.clientY <= 0 && !sessionStorage.getItem("exit_intent_shown")) {
      setShow(true);
      sessionStorage.setItem("exit_intent_shown", "1");
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mouseout", handleMouseLeave);
    return () => document.removeEventListener("mouseout", handleMouseLeave);
  }, [handleMouseLeave]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-2xl p-8 max-w-md w-full mx-4 relative shadow-2xl">
        <button
          onClick={() => setShow(false)}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center">
          <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Gift className="w-7 h-7 text-primary" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">Wait — don't miss this!</h2>
          <p className="text-muted-foreground text-sm mb-6">
            Start your free trial today and get <span className="text-primary font-semibold">20% off</span> your first 3 months if you upgrade within the trial period.
          </p>

          <div className="bg-muted/50 rounded-lg p-3 mb-6">
            <p className="text-xs text-muted-foreground mb-1">Use code at checkout:</p>
            <p className="text-lg font-mono font-bold text-primary">EARLYBIRD20</p>
          </div>

          <button
            onClick={() => {
              setShow(false);
              navigate("/start-trial?plan=professional");
            }}
            className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors inline-flex items-center justify-center gap-2 mb-3"
          >
            Start Free Trial <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShow(false)}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            No thanks, I'll pass
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Trial Expiry Banner - Shows a persistent banner for trial users
 * when their trial is about to expire (< 3 days remaining)
 */
export function TrialExpiryBanner({ daysRemaining, onDismiss }: { daysRemaining: number; onDismiss: () => void }) {
  const [, navigate] = useLocation();

  if (daysRemaining > 3 || daysRemaining < 0) return null;

  const urgencyColor = daysRemaining <= 1 ? "bg-red-500/10 border-red-500/30 text-red-400" : "bg-amber-500/10 border-amber-500/30 text-amber-400";
  const urgencyText = daysRemaining === 0
    ? "Your trial expires today!"
    : daysRemaining === 1
    ? "Your trial expires tomorrow!"
    : `Your trial expires in ${daysRemaining} days`;

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 border-b ${urgencyColor} px-4 py-2.5`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Clock className="w-4 h-4" />
          <span className="text-sm font-medium">{urgencyText}</span>
          <span className="text-xs opacity-80">— Upgrade now to keep your data and get 25% off</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/pricing")}
            className="text-xs font-medium bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full transition-colors"
          >
            Upgrade Now
          </button>
          <button onClick={onDismiss} className="opacity-60 hover:opacity-100">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Comparison Page - ARG Builder vs competitors
 */
export function ComparisonSection() {
  const [, navigate] = useLocation();

  const competitors = [
    { name: "Notion", category: "General workspace" },
    { name: "Confluence", category: "Enterprise wiki" },
    { name: "Guru", category: "Knowledge management" },
    { name: "ARG Builder", category: "Operational intelligence", highlight: true },
  ];

  const features = [
    { name: "AI-powered search", arg: true, notion: false, confluence: false, guru: true },
    { name: "Knowledge graph visualization", arg: true, notion: false, confluence: false, guru: false },
    { name: "Document quality audits", arg: true, notion: false, confluence: false, guru: false },
    { name: "Compliance reporting", arg: true, notion: false, confluence: true, guru: false },
    { name: "Reading analytics & goals", arg: true, notion: false, confluence: false, guru: true },
    { name: "Automated nurture sequences", arg: true, notion: false, confluence: false, guru: false },
    { name: "Built-in ROI calculator", arg: true, notion: false, confluence: false, guru: false },
    { name: "Document quizzes", arg: true, notion: false, confluence: false, guru: true },
    { name: "Workflow approvals", arg: true, notion: false, confluence: true, guru: false },
    { name: "Custom branding", arg: true, notion: false, confluence: false, guru: true },
    { name: "API access", arg: true, notion: true, confluence: true, guru: true },
    { name: "Team workspaces", arg: true, notion: true, confluence: true, guru: true },
  ];

  return (
    <section className="py-20 bg-background">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">How We Compare</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            ARG Builder is purpose-built for operational knowledge management — not a general workspace adapted for it.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Feature</th>
                {competitors.map((c) => (
                  <th
                    key={c.name}
                    className={`text-center py-3 px-4 font-medium ${c.highlight ? "text-primary" : "text-foreground"}`}
                  >
                    <div>{c.name}</div>
                    <div className="text-xs text-muted-foreground font-normal">{c.category}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {features.map((f) => (
                <tr key={f.name} className="border-b border-border/50">
                  <td className="py-3 px-4 text-foreground">{f.name}</td>
                  <td className="text-center py-3 px-4">{f.notion ? "✓" : "—"}</td>
                  <td className="text-center py-3 px-4">{f.confluence ? "✓" : "—"}</td>
                  <td className="text-center py-3 px-4">{f.guru ? "✓" : "—"}</td>
                  <td className="text-center py-3 px-4 text-primary font-bold">{f.arg ? "✓" : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="text-center mt-8">
          <button
            onClick={() => navigate("/start-trial?plan=professional")}
            className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 inline-flex items-center gap-2"
          >
            Try ARG Builder Free <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}

import { Link } from "wouter";
import { BookOpen, Network, Brain, Hexagon, ArrowRight, GitBranch, ShieldCheck, Zap } from "lucide-react";
import { BRAND } from "@/lib/brand";
import { Card, CardContent } from "@/components/ui/card";

const STEPS = [
  {
    icon: BookOpen,
    title: "Playbooks",
    description: "570+ operational documents — structured, versioned, exportable.",
    href: "/toc",
    color: "text-teal-400",
  },
  {
    icon: Network,
    title: "Knowledge graph",
    description: "Dependencies and cross-references — see what is load-bearing.",
    href: "/graph",
    color: "text-cyan-400",
  },
  {
    icon: Brain,
    title: BRAND.aiHubName,
    description: "Semantic search, writing assistant, chat — wired to your library.",
    href: BRAND.aiHubPath,
    color: "text-purple-400",
  },
  {
    icon: Hexagon,
    title: BRAND.nexusOsName,
    description: "Ask once. Execute across Slack, Notion, Gmail with approval gates.",
    href: `${BRAND.nexusOsPath}/`,
    external: true,
    color: "text-indigo-400",
  },
] as const;

const GOVERNANCE = [
  { icon: GitBranch, label: "Version history on every doc" },
  { icon: ShieldCheck, label: "Review status & audit trail" },
  { icon: Zap, label: "API, webhooks & SSO-ready" },
];

type ProductArchitectureStripProps = {
  showGovernance?: boolean;
  id?: string;
};

export default function ProductArchitectureStrip({ showGovernance = true, id }: ProductArchitectureStripProps) {
  return (
    <section id={id} data-tour="architecture" className="mb-10 sm:mb-14" aria-labelledby="product-architecture-heading">
      <div className="mb-6 sm:mb-8">
        <p className="text-xs uppercase tracking-wider font-medium text-teal-700 dark:text-teal-400 mb-2">
          How it works
        </p>
        <h2 id="product-architecture-heading" className="font-display text-2xl sm:text-3xl text-foreground">
          Library → Graph → Intelligence → Runtime
        </h2>
        <p className="text-sm text-muted-foreground mt-2 max-w-2xl">
          {BRAND.description}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {STEPS.map((step, index) => {
          const Icon = step.icon;
          const inner = (
            <Card className="h-full border-border/60 bg-card/50 hover:border-teal-500/30 transition-colors group">
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[10px] font-mono text-muted-foreground">{index + 1}</span>
                  <Icon className={`w-5 h-5 ${step.color}`} />
                </div>
                <h3 className="font-semibold text-foreground mb-1.5">{step.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">{step.description}</p>
                <span className="text-sm text-primary font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                  Explore <ArrowRight className="w-4 h-4" />
                </span>
              </CardContent>
            </Card>
          );

          if ("external" in step && step.external) {
            return (
              <a key={step.title} href={step.href} className="block">
                {inner}
              </a>
            );
          }
          return (
            <Link key={step.title} href={step.href}>
              {inner}
            </Link>
          );
        })}
      </div>

      {showGovernance && (
        <div className="flex flex-wrap gap-4 justify-center text-xs sm:text-sm text-muted-foreground">
          {GOVERNANCE.map(({ icon: Icon, label }) => (
            <span key={label} className="inline-flex items-center gap-1.5">
              <Icon className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              {label}
            </span>
          ))}
        </div>
      )}
    </section>
  );
}

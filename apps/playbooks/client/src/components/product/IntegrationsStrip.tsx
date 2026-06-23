import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { BRAND } from "@/lib/brand";

const HIGHLIGHTS = [
  { id: "slack", name: "Slack", icon: "💬" },
  { id: "notion", name: "Notion", icon: "📝" },
  { id: "gmail", name: "Gmail", icon: "✉️" },
  { id: "api", name: "REST API", icon: "🔌" },
  { id: "okta", name: "SSO / SAML", icon: "🔐" },
  { id: "webhook", name: "Webhooks", icon: "🪝" },
];

type IntegrationsStripProps = {
  className?: string;
};

export default function IntegrationsStrip({ className = "" }: IntegrationsStripProps) {
  return (
    <section className={`py-8 sm:py-10 border-t border-border/50 ${className}`} aria-labelledby="integrations-heading">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
        <div>
          <h2 id="integrations-heading" className="font-display text-xl sm:text-2xl text-foreground">
            Connects to your stack
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {BRAND.nexusOsName} runs workflows across the tools your team already uses.
          </p>
        </div>
        <Link href="/integrations">
          <span className="text-sm text-primary font-medium inline-flex items-center gap-1 hover:gap-2 transition-all">
            All integrations <ArrowRight className="w-4 h-4" />
          </span>
        </Link>
      </div>
      <div className="flex flex-wrap gap-2">
        {HIGHLIGHTS.map((item) => (
          <Link key={item.id} href="/integrations">
            <span className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-card border border-border/60 text-sm text-foreground/90 hover:border-teal-500/30 transition-colors cursor-pointer">
              <span aria-hidden>{item.icon}</span>
              {item.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

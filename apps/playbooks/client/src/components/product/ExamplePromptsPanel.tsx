import { Link } from "wouter";
import { MessageSquare, ArrowRight } from "lucide-react";
import { BRAND } from "@/lib/brand";

/** Example prompts aligned with jamal Hub workspaces + Nexus OS Brain routing */
export const EXAMPLE_PROMPTS = [
  {
    label: "Riad & Routes — guest briefing",
    prompt:
      "Prepare a pre-arrival briefing for an HNW guest in Marrakech — riad, driver, experiences, WhatsApp templates.",
    href: `${BRAND.nexusOsPath}/`,
    locale: "Hub · RR",
    external: true,
  },
  {
    label: "ArtKech — creative brief",
    prompt:
      "Turn client notes into a luxury creative brief — brand voice, deliverables, revision rounds, preflight QA.",
    href: `${BRAND.nexusOsPath}/`,
    locale: "Hub · AK",
    external: true,
  },
  {
    label: "ARG-Builder — semantic search",
    prompt:
      "Which playbooks cover cross-border supplier onboarding and compliance checklists?",
    href: "/ai/search",
    locale: "Intelligence",
    external: false,
  },
  {
    label: "JB — LinkedIn post",
    prompt:
      "Draft a LinkedIn post for JB — unhurried luxury travel. Tagline: Some places require an introduction.",
    href: `${BRAND.nexusOsPath}/`,
    locale: "Hub · JB",
    external: true,
  },
] as const;

type ExamplePromptsPanelProps = {
  title?: string;
  className?: string;
};

function PromptCard({ item }: { item: (typeof EXAMPLE_PROMPTS)[number] }) {
  const body = (
    <div className="p-3 rounded-lg bg-card/80 border border-border/50 hover:border-purple-500/30 transition-colors cursor-pointer group">
      <div className="flex items-center justify-between gap-2 mb-1">
        <span className="text-sm font-medium text-foreground">{item.label}</span>
        <span className="text-[10px] uppercase tracking-wide text-muted-foreground">{item.locale}</span>
      </div>
      <p className="text-xs text-muted-foreground group-hover:text-foreground/80 transition-colors">
        &ldquo;{item.prompt}&rdquo;
      </p>
      <span className="text-xs text-primary mt-2 inline-flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        Open tool <ArrowRight className="w-3 h-3" />
      </span>
    </div>
  );

  if (item.external) {
    return <a href={item.href}>{body}</a>;
  }
  return <Link href={item.href}>{body}</Link>;
}

export default function ExamplePromptsPanel({
  title = "Try these Hub examples",
  className = "",
}: ExamplePromptsPanelProps) {
  return (
    <div className={`rounded-xl border border-purple-500/20 bg-purple-500/5 p-5 sm:p-6 ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare className="w-5 h-5 text-purple-400" />
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        Scenarios from your four Hub workspaces — paste into {BRAND.nexusOsName} or the Intelligence Hub.
        Chief of Staff routes to the right specialist automatically.
      </p>
      <div className="space-y-3">
        {EXAMPLE_PROMPTS.map((item) => (
          <PromptCard key={item.label} item={item} />
        ))}
      </div>
    </div>
  );
}

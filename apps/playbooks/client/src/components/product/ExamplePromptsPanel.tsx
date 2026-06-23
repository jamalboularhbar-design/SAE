import { Link } from "wouter";
import { MessageSquare, ArrowRight } from "lucide-react";
import { BRAND } from "@/lib/brand";

export const EXAMPLE_PROMPTS = [
  {
    label: "Automotive — onboarding opérateur",
    prompt: "Trouve la procédure d'onboarding opérateur production et liste les prérequis dans le graphe.",
    href: "/ai/search",
    locale: "FR",
    external: false,
  },
  {
    label: "BPO — attrition & formation",
    prompt: "Quels playbooks couvrent la montée en compétence agent et la passation de poste en 48h ?",
    href: "/ai/chat",
    locale: "FR",
    external: false,
  },
  {
    label: "Cross-border — supplier compliance",
    prompt: "Summarize Morocco cross-border supplier onboarding checklists and linked compliance docs.",
    href: "/ai/search",
    locale: "EN",
    external: false,
  },
  {
    label: "Nexus OS — ops briefing",
    prompt: "Prepare a shift briefing for 5 new production operators — checklist, owners, and approval step.",
    href: `${BRAND.nexusOsPath}/`,
    locale: "EN",
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
  title = "Try these examples",
  className = "",
}: ExamplePromptsPanelProps) {
  return (
    <div className={`rounded-xl border border-purple-500/20 bg-purple-500/5 p-5 sm:p-6 ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare className="w-5 h-5 text-purple-400" />
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        Founding-client scenarios — automotive, BPO, and cross-border ops. Paste into search or {BRAND.nexusOsName}.
      </p>
      <div className="space-y-3">
        {EXAMPLE_PROMPTS.map((item) => (
          <PromptCard key={item.label} item={item} />
        ))}
      </div>
    </div>
  );
}

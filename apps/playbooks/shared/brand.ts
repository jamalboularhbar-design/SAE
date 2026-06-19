/**
 * NexusAI Playbooks — centralized brand configuration.
 * Replaces scattered "ARG Builder" references across the app.
 */
export const BRAND = {
  /** Primary product name under NexusAI suite */
  productName: "NexusAI Playbooks",
  /** Parent company / suite name */
  parentName: "NexusAI",
  /** Short tagline shown in header/footer */
  tagline: "Operational Intelligence for Multi-Brand Teams",
  /** Legacy name — used during transition period only */
  legacyName: "ARG Builder",
  /** Marketing description */
  description:
    "Manage operational playbooks for every brand you operate — with AI-powered search, multi-brand workspaces, and battle-tested SOP templates.",
  /** Domains */
  domain: "nexusai.ma",
  appUrl: "https://app.nexusai.ma",
  marketingUrl: "https://nexusai.ma",
  templatesUrl: "https://templates.nexusai.ma",
  /** Legacy domain (redirect during transition) */
  legacyDomain: "argbuilder.io",
  legacyAppUrl: "https://argbuilder.io",
  /** Support / admin defaults */
  adminEmail: "admin@nexusai.ma",
  supportEmail: "hello@nexusai.ma",
  /** AI Hub branding */
  aiHubName: "NexusAI Intelligence",
  aiHubTitle: "NexusAI Intelligence Hub",
  aiHubTagline: "10 AI tools for writing, search, automation, and operational intelligence",
  aiHubPath: "/ai",
  /** SEO defaults */
  seoTitle: "NexusAI Playbooks | AI-Powered Operational Intelligence",
  seoDescription:
    "Multi-brand operational documentation platform with AI search, playbooks, process timelines, and team collaboration.",
  /** Email / notification signatures */
  teamSignature: "The NexusAI Playbooks Team",
  emailFrom: "NexusAI Playbooks <hello@nexusai.ma>",
  /** Active app URL (legacy until nexusai.ma DNS is live) */
  activeAppUrl: "https://argbuilder.io",
  /** Default OG image — absolute URL for social crawlers */
  ogImageUrl: "https://argbuilder.io/og-image.png",
} as const;

/** Workspace terminology (replaces "Persona") */
export const TERMINOLOGY = {
  workspace: "Workspace",
  workspaces: "Workspaces",
  /** @deprecated Use workspace */
  persona: "Workspace",
  /** @deprecated Use workspaces */
  personas: "Workspaces",
} as const;

export function brandTitle(pageTitle?: string): string {
  return pageTitle ? `${pageTitle} | ${BRAND.productName}` : BRAND.seoTitle;
}

/** Replace legacy product name in copy */
export function brandCopy(text: string): string {
  return text.replace(/ARG Builder/g, BRAND.productName);
}

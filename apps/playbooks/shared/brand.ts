/**
 * ARG-Builder — centralized brand configuration.
 * Replaces scattered ad-hoc brand strings across the app.
 *
 * Brand decision (2026-06-21):
 *   - Public-facing parent / product = "ARG-Builder" (rolling back the NexusAI parent
 *     to avoid collision with the $1.28B Morocco Nexus AI Factory project).
 *   - Nexus OS is kept as the product wedge ("ask once, team executes" at /os).
 */
export const BRAND = {
  /** Primary product name */
  productName: "ARG-Builder",
  /** Parent company / suite name */
  parentName: "ARG-Builder",
  /** Short tagline shown in header/footer */
  tagline: "Playbooks and the runtime that runs them",
  /** Legacy name — used during transition period only */
  legacyName: "NexusAI Playbooks",
  /** Marketing description */
  description:
    "ARG-Builder is two things in one workspace — Playbooks (the library) and Nexus OS (the runtime that fires them across Slack, Notion, Gmail).",
  /** Domains */
  domain: "argbuilder.io",
  appUrl: "https://argbuilder.io",
  marketingUrl: "https://argbuilder.io",
  templatesUrl: "https://argbuilder.io/product/templates",
  /** Legacy domain (kept for redirect during transition) */
  legacyDomain: "nexusai.ma",
  legacyAppUrl: "https://nexusai.ma",
  /** Support / admin defaults */
  adminEmail: "admin@argbuilder.io",
  supportEmail: "hello@argbuilder.io",
  /** AI Hub branding */
  aiHubName: "Intelligence Hub",
  aiHubTitle: "Intelligence Hub",
  aiHubTagline: "11 AI tools for writing, search, automation, and operational intelligence",
  aiHubPath: "/ai",
  /** Nexus OS — ask once, team executes (mounted at /os on argbuilder.io) */
  nexusOsName: "Nexus OS",
  nexusOsTitle: "Nexus OS",
  nexusOsTagline: "Ask once. Your specialist team executes across Slack, Notion, Gmail and more.",
  nexusOsPath: "/os",
  /** SEO defaults */
  seoTitle: "ARG-Builder | Playbooks and the runtime that runs them",
  seoDescription:
    "ARG-Builder is two things in one workspace — Playbooks (the library, 570+ structured operating documents) and Nexus OS (the runtime that fires them across Slack, Notion and Gmail).",
  /** Email / notification signatures */
  teamSignature: "The ARG-Builder Team",
  emailFrom: "ARG-Builder <hello@argbuilder.io>",
  /** Active app URL */
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
  return text.replace(/NexusAI Playbooks/g, BRAND.productName).replace(/ARG Builder/g, BRAND.productName);
}

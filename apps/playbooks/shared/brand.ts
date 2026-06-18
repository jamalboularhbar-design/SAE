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
  domain: "nexusai.io",
  appUrl: "https://app.nexusai.io",
  /** Support / admin defaults */
  adminEmail: "admin@nexusai.io",
  supportEmail: "support@nexusai.io",
  /** SEO defaults */
  seoTitle: "NexusAI Playbooks | AI-Powered Operational Intelligence",
  seoDescription:
    "Multi-brand operational documentation platform with AI search, playbooks, process timelines, and team collaboration.",
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

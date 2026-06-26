import { DEMO_CATEGORY_ALIASES, DEMO_WORKSPACES } from "./demoWorkspaces";

/** Top-level workspace roots (client deployments / demo personas) */
export const WORKSPACE_ROOT_CATEGORIES = [
  DEMO_WORKSPACES.travel.name,
  DEMO_WORKSPACES.creative.name,
  DEMO_WORKSPACES.agency.name,
  DEMO_WORKSPACES.hospitality.name,
] as const;

/** ARG-Builder platform function categories (SaaS catalog) */
export const PLATFORM_CATEGORIES = [
  "Engineering",
  "Customer Success",
  "Sales",
  "Marketing",
  "Product",
  "People & Culture",
  "Finance & Legal",
  "Security & Compliance",
  "Revenue & Pricing",
  "Partnerships & GTM",
  "Data & Analytics",
  "Operations",
  "AI & Developer",
  "Strategy & Operations",
] as const;

const WORKSPACE_SET = new Set<string>(WORKSPACE_ROOT_CATEGORIES);

export function normalizeCategory(category: string): string {
  return DEMO_CATEGORY_ALIASES[category] ?? category;
}

export function isWorkspaceCategory(category: string): boolean {
  return WORKSPACE_SET.has(normalizeCategory(category));
}

export function getWorkspaceRoot(category: string): string | null {
  const normalized = normalizeCategory(category);
  return WORKSPACE_SET.has(normalized) ? normalized : null;
}

/** Infer workspace from slug/filename patterns when category is wrong */
export function inferWorkspaceFromSlug(slug: string): string | null {
  const s = slug.toLowerCase();
  if (s.includes("rr-") || s.includes("riad") || s.includes("routes") || s.includes("concierge")) {
    return DEMO_WORKSPACES.travel.name;
  }
  if (s.includes("ak-") || s.includes("artkech")) {
    return DEMO_WORKSPACES.creative.name;
  }
  return null;
}

/** Effective workspace for nesting — category first, slug fallback */
export function resolveDocumentWorkspace(category: string, slug?: string): string | null {
  return getWorkspaceRoot(category) ?? (slug ? inferWorkspaceFromSlug(slug) : null);
}

/**
 * Whether two documents belong in the same related/nesting scope.
 * - Workspace docs only relate within the same workspace (RR ≠ ArtKech).
 * - Platform catalog docs only relate within the same function category.
 * - Workspace and platform catalogs never cross-mix.
 */
export function sharesDocumentScope(
  categoryA: string,
  categoryB: string,
  slugA?: string,
  slugB?: string
): boolean {
  const workspaceA = resolveDocumentWorkspace(categoryA, slugA);
  const workspaceB = resolveDocumentWorkspace(categoryB, slugB);

  if (workspaceA && workspaceB) return workspaceA === workspaceB;
  if (workspaceA || workspaceB) return false;

  return normalizeCategory(categoryA) === normalizeCategory(categoryB);
}

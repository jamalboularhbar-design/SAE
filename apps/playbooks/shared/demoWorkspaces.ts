/**
 * Live demo / case-study workspace names.
 * Slugs (riad-routes, artkech) unchanged for routing compatibility.
 */
export const DEMO_WORKSPACES = {
  travel: {
    id: "riad-routes" as const,
    name: "Riad & Routes",
    shortName: "R&R",
    tagline: "Luxury Morocco travel concierge for high-net-worth Americans",
    domain: "riadandroutes.com",
    emailDomain: "riadandroutes.com",
    teamLabel: "Riad & Routes Team",
    location: "Marrakech, Morocco",
    caseStudyStatus: "live" as const,
    improvementsNeeded: true,
  },
  creative: {
    id: "artkech" as const,
    name: "ArtKech Design Studio",
    shortName: "ArtKech",
    tagline: "Brand identity, editorial design, and premium creative production",
    domain: "artkech.com",
    emailDomain: "artkech.com",
    teamLabel: "ArtKech Studio Team",
    location: "Marrakech Studio",
    caseStudyStatus: "live" as const,
    improvementsNeeded: true,
  },
  agency: {
    id: "multi-brand-agency" as const,
    name: "Atlas Collective Agency",
    shortName: "Atlas",
    tagline: "Multi-brand agency ops — client delivery, SOPs, and handoffs",
    domain: "atlascollective.demo",
    emailDomain: "atlascollective.demo",
    teamLabel: "Atlas Collective Team",
    location: "Remote / NYC",
    caseStudyStatus: "demo" as const,
    improvementsNeeded: false,
  },
  hospitality: {
    id: "boutique-hospitality" as const,
    name: "Maison Voyager Hospitality",
    shortName: "Voyager",
    tagline: "Boutique hotel group — guest ops, compliance, and multi-property SOPs",
    domain: "voyagerhospitality.demo",
    emailDomain: "voyagerhospitality.demo",
    teamLabel: "Voyager Ops Team",
    location: "US / EMEA",
    caseStudyStatus: "demo" as const,
    improvementsNeeded: false,
  },
} as const;

/** Showcase verticals for marketing, Notion, and case studies */
export const DEMO_VERTICALS = [
  DEMO_WORKSPACES.travel,
  DEMO_WORKSPACES.creative,
  DEMO_WORKSPACES.agency,
  DEMO_WORKSPACES.hospitality,
] as const;

/** Legacy category names in seeded docs → workspace labels */
export const DEMO_CATEGORY_ALIASES: Record<string, string> = {
  "Horizon Concierge": DEMO_WORKSPACES.travel.name,
  "Meridian Creative Studio": DEMO_WORKSPACES.creative.name,
};

export function demoWorkspaceName(personaId: "riad-routes" | "artkech"): string {
  return personaId === "riad-routes"
    ? DEMO_WORKSPACES.travel.name
    : DEMO_WORKSPACES.creative.name;
}

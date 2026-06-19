/**
 * Demo workspace names — generic agency labels for product demos.
 * Internal persona slugs (riad-routes, artkech) are unchanged for routing compatibility.
 */
export const DEMO_WORKSPACES = {
  travel: {
    id: "riad-routes" as const,
    name: "Horizon Concierge",
    shortName: "Horizon",
    tagline: "Luxury travel concierge — bespoke experiences for discerning clients",
    domain: "horizonconcierge.demo",
    emailDomain: "horizonconcierge.demo",
    teamLabel: "Horizon Concierge Team",
    location: "Regional HQ",
  },
  creative: {
    id: "artkech" as const,
    name: "Meridian Creative Studio",
    shortName: "Meridian",
    tagline: "Brand identity, editorial design, and premium creative production",
    domain: "meridiancreative.demo",
    emailDomain: "meridiancreative.demo",
    teamLabel: "Meridian Creative Team",
    location: "Meridian Studio",
  },
} as const;

/** Legacy category names in seeded docs → demo workspace labels */
export const DEMO_CATEGORY_ALIASES: Record<string, string> = {
  "Riad & Routes": DEMO_WORKSPACES.travel.name,
  "ArtKech Design Studio": DEMO_WORKSPACES.creative.name,
};

export function demoWorkspaceName(personaId: "riad-routes" | "artkech"): string {
  return personaId === "riad-routes"
    ? DEMO_WORKSPACES.travel.name
    : DEMO_WORKSPACES.creative.name;
}

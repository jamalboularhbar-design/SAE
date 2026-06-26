/**
 * Bootstrap pricing — single source of truth for UI + Stripe products.ts
 */
export const BOOTSTRAP_PRICING = {
  membership: {
    id: "membership",
    name: "Membership",
    monthlyUsd: 39,
    description: "Full access to the operating reference library, AI hub, and Nexus OS early access.",
  },
  founding: {
    id: "founding",
    name: "Founding Member",
    annualUsd: 290,
    monthlyEquivalentUsd: 24,
    seatCap: 100,
    description: "Price locked forever. Direct founder access. Co-design your first Autopilot.",
  },
  morocco: {
    label: "Morocco founding clients",
    note: "Facture / virement bancaire — pas de carte requise. Contactez-nous après votre démo.",
    contactEmail: "jamal@argbuilder.io",
    annualMadApprox: 2900,
  },
} as const;

export const MEMBERSHIP_FEATURES = [
  "570+ operational playbooks",
  "Knowledge graph & cross-references",
  "Full-text + AI semantic search",
  "PDF, DOCX & bulk export",
  "Nexus OS early access (/os)",
  "AI Intelligence Hub",
  "Version history & reading analytics",
] as const;

export const FOUNDING_EXTRAS = [
  "Price locked at $290/year — permanently",
  "Direct WhatsApp line to the founder",
  "4× onboarding calls (kickoff + 3 check-ins)",
  "Your requests shape the library roadmap",
  "Case study partnership (optional)",
] as const;

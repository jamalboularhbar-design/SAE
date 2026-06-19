/**
 * NexusAI Templates — marketplace bundle definitions (Phase 1 GTM).
 * docs-seed blueprint unchanged; these are purchasable curated subsets.
 */
export const TEMPLATE_BUNDLES = [
  {
    id: "starter",
    name: "Starter Pack",
    price: 49,
    docCount: 50,
    formats: ["Notion", "Markdown", "Google Docs"],
    credit: "$49 off first month of Playbooks",
    description: "Core SOPs every team needs — onboarding, meetings, client comms, and project kickoffs.",
    highlights: ["50 decision-ready SOPs", "3 import formats", "Playbooks credit included"],
    badge: "Best for solo founders",
    vertical: "general",
  },
  {
    id: "agency",
    name: "Agency Pack",
    price: 99,
    docCount: 100,
    formats: ["Notion", "Markdown", "Google Docs"],
    credit: "$99 off first month of Playbooks",
    description: "Agency operations — client onboarding, scope control, deliverable QA, and multi-brand workflows.",
    highlights: ["100+ agency playbooks", "Multi-brand workspace templates", "Playbooks credit included"],
    badge: "Most popular",
    vertical: "agency",
  },
  {
    id: "travel-ops",
    name: "Travel Ops Pack",
    price: 149,
    docCount: 120,
    formats: ["Notion", "Markdown", "Google Docs"],
    credit: "$149 off first month of Playbooks",
    description: "Concierge and hospitality operations — guest journeys, provider comms, escalation, and seasonal planning.",
    highlights: ["Guest lifecycle playbooks", "Provider coordination SOPs", "WhatsApp template starters"],
    badge: "Vertical deep-dive",
    vertical: "travel",
  },
  {
    id: "creative-studio",
    name: "Creative Studio Pack",
    price: 149,
    docCount: 120,
    formats: ["Notion", "Markdown", "Google Docs"],
    credit: "$149 off first month of Playbooks",
    description: "Design and creative studio ops — briefs, reviews, production handoffs, and client portals.",
    highlights: ["Creative workflow SOPs", "Brand review checklists", "Freelancer management"],
    badge: "Vertical deep-dive",
    vertical: "creative",
  },
  {
    id: "complete",
    name: "Complete Library",
    price: 199,
    docCount: 280,
    formats: ["Notion", "Markdown", "Google Docs", "Hosted preview"],
    credit: "1 month Pro Playbooks free",
    description: "Every curated template bundle — the full operational blueprint library in portable formats.",
    highlights: ["280+ documents", "All vertical packs", "1 month Pro Playbooks included"],
    badge: "Best value",
    vertical: "all",
  },
] as const;

export type TemplateBundleId = (typeof TEMPLATE_BUNDLES)[number]["id"];

export const TEMPLATE_CLUB = {
  name: "Template Club",
  price: 29,
  interval: "month" as const,
  description: "All templates + monthly releases. Includes renewed Playbooks Starter trial while subscribed.",
};

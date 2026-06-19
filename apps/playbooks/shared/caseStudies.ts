/**
 * Case study + vertical demo config — shared by marketing UI and Notion Case Study Tracker.
 * Keep in sync with scripts/notion/ppv-config.mjs CASE_STUDIES.
 */
import { DEMO_WORKSPACES } from "./demoWorkspaces";

export type CaseStudyStatus = "live" | "demo";
export type CaseStudyTrackerStatus = "Live" | "Demo" | "Needs Improvement" | "Paused";

export interface CaseStudy {
  id: string;
  industry: string;
  company: string;
  logo: string;
  title: string;
  subtitle: string;
  challenge: string;
  solution: string;
  results: { metric: string; label: string }[];
  quote: string;
  quoteAuthor: string;
  features: string[];
  status: CaseStudyStatus;
  trackerStatus: CaseStudyTrackerStatus;
  improvementsNeeded: boolean;
  improvementNotes?: string;
  /** Home workspace tab key when interactive demo exists */
  workspaceTab?: "travel" | "artkech";
  personaPath?: string;
}

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: "riad-routes",
    industry: "Travel & Concierge",
    company: DEMO_WORKSPACES.travel.name,
    logo: DEMO_WORKSPACES.travel.shortName,
    title: "How Riad & Routes Scaled Luxury Concierge Ops Without Losing the Personal Touch",
    subtitle: "Live case study — operational playbooks for Morocco luxury travel",
    challenge:
      "Riad & Routes coordinates high-net-worth American travelers across riads, hotels, drivers, and experiences in Morocco. SOPs lived in WhatsApp threads, Google Docs, and senior concierges' heads. Provider coordination and guest anticipation were hard to replicate as the team grew.",
    solution:
      "NexusAI Playbooks centralized guest journeys, provider SLAs, WhatsApp templates, and escalation paths into one searchable system. Dual workspace views let the team switch between travel ops and the linked ArtKech creative studio.",
    results: [
      { metric: "94%", label: "Team adoption (10 days)" },
      { metric: "38%", label: "Ops efficiency gain" },
      { metric: "14hrs", label: "Build time to live system" },
      { metric: "420%", label: "Documented ROI" },
    ],
    quote:
      "We needed one place for guest protocols, provider comms, and seasonal pricing — not another blank Notion workspace.",
    quoteAuthor: "Jamal Boularhbar, Founder",
    features: ["Multi-brand Workspaces", "Provider Directory", "WhatsApp Templates", "Guest CRM"],
    status: "live",
    trackerStatus: "Needs Improvement",
    improvementsNeeded: true,
    improvementNotes: DEMO_WORKSPACES.travel.tagline,
    workspaceTab: "travel",
    personaPath: "/persona/riad-routes",
  },
  {
    id: "artkech",
    industry: "Creative Studio",
    company: DEMO_WORKSPACES.creative.name,
    logo: "AK",
    title: "ArtKech Turned Creative Studio Chaos Into Repeatable Delivery",
    subtitle: "Live case study — brand, production, and client ops in one platform",
    challenge:
      "ArtKech Design Studio runs brand identity, editorial design, print production, and photography. Briefs, revisions, freelancer handoffs, and client approvals were scattered across email, Drive, and DMs — causing missed deadlines and inconsistent quality.",
    solution:
      "Playbooks mapped creative brief intake, design review, preflight QA, and invoicing into linked documents. The studio workspace shares taxonomy with Riad & Routes for founder-led multi-brand operations.",
    results: [
      { metric: "89%", label: "Team adoption (14 days)" },
      { metric: "32%", label: "Delivery efficiency gain" },
      { metric: "16hrs", label: "Build time to live system" },
      { metric: "380%", label: "Documented ROI" },
    ],
    quote:
      "Our studio finally has one source of truth for how we take a brief from intake to shipped work.",
    quoteAuthor: "Jamal Boularhbar, Founder",
    features: ["Creative Workflows", "Freelancer SOPs", "Client Portal", "Version Control"],
    status: "live",
    trackerStatus: "Needs Improvement",
    improvementsNeeded: true,
    improvementNotes: DEMO_WORKSPACES.creative.tagline,
    workspaceTab: "artkech",
    personaPath: "/persona/artkech",
  },
  {
    id: "atlas-collective",
    industry: "Multi-Brand Agency",
    company: DEMO_WORKSPACES.agency.name,
    logo: "AC",
    title: "Atlas Collective Runs Five Client Brands From One Ops Backbone",
    subtitle: "Demo vertical — agency delivery, handoffs, and SOPs at scale",
    challenge:
      "Atlas Collective manages creative, media, and ops retainers for multiple client brands. Each account had its own Notion, Slack, and folder sprawl — making cross-client learning and quality control impossible.",
    solution:
      "NexusAI Playbooks models each client as a workspace with shared agency SOPs, approval chains, and template libraries. Account leads pull from the same playbook vault while keeping client data isolated.",
    results: [
      { metric: "5", label: "Client brands managed" },
      { metric: "45%", label: "Faster onboarding" },
      { metric: "120+", label: "Shared SOPs" },
      { metric: "3×", label: "Handoff clarity" },
    ],
    quote: "We stopped rebuilding the same delivery checklist for every new client engagement.",
    quoteAuthor: "Ops Director, Atlas Collective (demo)",
    features: ["Multi-tenant Workspaces", "Client Handoffs", "Template Library", "Approval Workflows"],
    status: "demo",
    trackerStatus: "Demo",
    improvementsNeeded: false,
    improvementNotes: "Multi-brand agency ICP reference — SOPs for client delivery.",
  },
  {
    id: "maison-voyager",
    industry: "Boutique Hospitality",
    company: DEMO_WORKSPACES.hospitality.name,
    logo: "MV",
    title: "Maison Voyager Standardized Guest Ops Across Properties",
    subtitle: "Demo vertical — compliance, housekeeping, and multi-property SOPs",
    challenge:
      "Maison Voyager operates boutique hotels across US and EMEA. Property managers maintained guest ops, compliance, and vendor SOPs in silos — audits and brand standards drifted between locations.",
    solution:
      "Playbooks unify guest journey SOPs, incident response, and compliance checklists with property-specific overrides. Regional ops leads see freshness scores and gaps from one dashboard.",
    results: [
      { metric: "8", label: "Properties aligned" },
      { metric: "60%", label: "Faster audit prep" },
      { metric: "200+", label: "Compliance policies" },
      { metric: "2×", label: "Cross-property consistency" },
    ],
    quote: "We finally have one hospitality ops standard — with room for each property's character.",
    quoteAuthor: "VP Operations, Maison Voyager (demo)",
    features: ["Multi-Property SOPs", "Compliance Reports", "Incident Logs", "Vendor Playbooks"],
    status: "demo",
    trackerStatus: "Demo",
    improvementsNeeded: false,
    improvementNotes: "Compliance + multi-property ops demo vertical.",
  },
];

export const LIVE_CASE_STUDIES = CASE_STUDIES.filter((s) => s.status === "live");
export const DEMO_VERTICALS_SHOWCASE = CASE_STUDIES;

export function caseStudyStatusLabel(study: CaseStudy): string {
  if (study.status === "live" && study.improvementsNeeded) return "Live · improving";
  if (study.status === "live") return "Live";
  return "Demo vertical";
}

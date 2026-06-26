/**
 * Marketing demo flows — mirrors Nexus OS Brain routing (Chief of Staff + Hub specialists).
 * Keep specialist ids aligned with shared/hubData.ts and nexus-os/server/engine.ts.
 */
import { HUB_BUSINESSES, HUB_SPECIALISTS } from "./hubData";

export interface HubDemoStep {
  specialistId: string;
  specialistName: string;
  action: string;
}

export interface HubDemoFlow {
  id: string;
  label: string;
  businessId: string;
  query: string;
  steps: HubDemoStep[];
}

export const HUB_DEMO_FLOWS: HubDemoFlow[] = [
  {
    id: "rr-guest-briefing",
    label: "Guest journey briefing",
    businessId: "riad",
    query:
      "Prepare a pre-arrival briefing for an HNW guest arriving in Marrakech — riad, driver, and experience checklist with owners.",
    steps: [
      {
        specialistId: "chief-of-staff",
        specialistName: "Chief of Staff",
        action: "Selected SOP Writer + Onboarding Specialist for guest journey playbooks",
      },
      {
        specialistId: "sop",
        specialistName: "SOP & Process Documentation Writer",
        action: "Pulled Guest Anticipation + Provider SLA docs from the library",
      },
      {
        specialistId: "onboard",
        specialistName: "Onboarding Specialist",
        action: "Drafted guest touchpoint timeline with WhatsApp template slots",
      },
      {
        specialistId: "chief-of-staff",
        specialistName: "Chief of Staff",
        action: "Synthesis ready — approve before Notion + Slack publish",
      },
    ],
  },
  {
    id: "ak-creative-brief",
    label: "Creative brief intake",
    businessId: "artkech",
    query:
      "Turn this luxury client notes into a creative brief — brand voice, deliverables, revision rounds, and preflight QA.",
    steps: [
      {
        specialistId: "chief-of-staff",
        specialistName: "Chief of Staff",
        action: "Matched Brand Strategist + Ghostwriter for ArtKech creative brief",
      },
      {
        specialistId: "brand",
        specialistName: "Brand Strategist",
        action: "Framed positioning — editorial luxury, Cormorant Garamond voice",
      },
      {
        specialistId: "ghost",
        specialistName: "Ghostwriter & Narrative Specialist",
        action: "Drafted brief sections: scope, moodboard refs, approval chain",
      },
      {
        specialistId: "pm",
        specialistName: "Project Manager",
        action: "Timeline + freelancer handoff checklist queued for approval",
      },
    ],
  },
  {
    id: "arg-supplier-compliance",
    label: "Supplier compliance",
    businessId: "argbuilder",
    query:
      "Summarize cross-border supplier onboarding checklists and flag missing compliance docs for ARG-Builder ops.",
    steps: [
      {
        specialistId: "chief-of-staff",
        specialistName: "Chief of Staff",
        action: "Picked Research + Process Analyst for supplier compliance gaps",
      },
      {
        specialistId: "research-ai",
        specialistName: "Research Assistant",
        action: "Matched 4 playbooks: Vendor Intake, Cross-Border SLA, KYC Checklist",
      },
      {
        specialistId: "ops",
        specialistName: "Business Process Analyst",
        action: "2 gaps flagged — insurance cert and local tax registration",
      },
      {
        specialistId: "automation",
        specialistName: "Workflow Automation Specialist",
        action: "Proposed Notion tasks + webhook follow-ups — awaiting approval",
      },
    ],
  },
  {
    id: "jb-brand-post",
    label: "Personal brand post",
    businessId: "jb",
    query:
      "Draft a LinkedIn post for JB — unhurried luxury travel philosophy, no hard sell. Some places require an introduction.",
    steps: [
      {
        specialistId: "chief-of-staff",
        specialistName: "Chief of Staff",
        action: "Chose LinkedIn + Copywriter for JB personal brand tone",
      },
      {
        specialistId: "linkedin",
        specialistName: "LinkedIn Specialist",
        action: "Hook + narrative arc aligned to curator positioning",
      },
      {
        specialistId: "dr-copy",
        specialistName: "Direct Response Copywriter",
        action: "Refined CTA — invitation, not pitch",
      },
      {
        specialistId: "chief-of-staff",
        specialistName: "Chief of Staff",
        action: "Ready to publish via Slack approval gate",
      },
    ],
  },
];

export function getBusinessById(id: string) {
  return HUB_BUSINESSES.find((b) => b.id === id);
}

export const HUB_SPECIALIST_COUNT = HUB_SPECIALISTS.length;

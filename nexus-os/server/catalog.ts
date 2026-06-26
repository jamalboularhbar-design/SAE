/**
 * Catalog: specialists (sourced from the user's Hub roster), integrations
 * (Gateway), and skills. Mirrors the Apex component model — a Brain coordinating
 * specialist agents across a Gateway of tools, each equipped with modular Skills.
 */
import type { Integration, Skill, Specialist, Workspace } from "../shared/types.ts";
import { HUB_BUSINESSES, HUB_SPECIALISTS } from "../shared/hubData.ts";

export const CHIEF_OF_STAFF: Specialist = {
  id: "chief-of-staff",
  name: "Chief of Staff",
  role: "Orchestrates the team, plans the work, synthesizes one answer",
  emoji: "🧭",
  skills: ["planning", "delegation", "synthesis"],
  model: "gemini-2.5-pro",
  accent: "#6366f1",
  category: "Orchestration",
  prompt:
    "You are the Chief of Staff of Nexus OS, orchestrating a team of specialist agents for a founder running multiple businesses. Plan, delegate, and synthesize a single concise, action-first answer.",
};

/** Specialists = the orchestrator + the user's Hub roster. */
export const SPECIALISTS: Specialist[] = [
  CHIEF_OF_STAFF,
  ...HUB_SPECIALISTS.map((s) => ({
    id: s.id,
    name: s.name,
    role: s.desc,
    emoji: s.icon,
    skills: [s.category],
    model: "gemini-2.5-flash",
    accent: s.accent,
    category: s.category,
    prompt: s.prompt,
  })),
];

export const WORKSPACES: Workspace[] = HUB_BUSINESSES.map((b) => ({
  id: b.id,
  name: b.name,
  domain: b.domain,
  tagline: b.tagline,
  icon: b.icon,
  accent: b.accent,
  context: b.context,
}));

export const SKILLS: Skill[] = [
  { id: "email-triage", name: "Email Triage", emoji: "📨", description: "Categorize, prioritize, and draft responses to your inbox.", specialist: "email", triggers: ["email", "inbox", "reply", "respond", "follow up"] },
  { id: "calendar-optimizer", name: "Calendar Optimizer", emoji: "🗓️", description: "Protect focus time and schedule intelligently.", specialist: "planner", triggers: ["schedule", "calendar", "meeting", "book", "reschedule", "focus time"] },
  { id: "meeting-prep", name: "Meeting Prep", emoji: "📋", description: "Generate briefings with full context before every meeting.", specialist: "planner", triggers: ["prep", "brief", "prepare", "agenda"] },
  { id: "follow-up-tracker", name: "Follow-Up Tracker", emoji: "🔁", description: "Ensure commitments and promises don't fall through.", specialist: "leadgen", triggers: ["follow up", "chase", "remind", "commitment"] },
  { id: "content-engine", name: "Content Engine", emoji: "✍️", description: "Turn conversations into posts, clips, and content.", specialist: "content", triggers: ["write", "draft", "post", "linkedin", "content", "blog"] },
  { id: "financial-intel", name: "Financial Intel", emoji: "📈", description: "Monitor KPIs and surface insights and anomalies.", specialist: "revenue", triggers: ["revenue", "mrr", "kpi", "metric", "finance", "burn"] },
  { id: "pipeline-watch", name: "Pipeline Watch", emoji: "🤝", description: "Watch deals, flag cold leads, suggest next steps.", specialist: "leadgen", triggers: ["pipeline", "deal", "lead", "crm", "prospect"] },
  { id: "research", name: "Research", emoji: "🔬", description: "Gather context and compare options across sources.", specialist: "research-ai", triggers: ["research", "compare", "find", "analyze", "investigate"] },
  { id: "strategy", name: "Strategy", emoji: "▲", description: "Frame high-stakes decisions and positioning.", specialist: "strategy", triggers: ["playbook", "sop", "strategy", "positioning", "decide", "plan"] },
];

export const INTEGRATIONS: Integration[] = [
  { id: "slack", name: "Slack", category: "Communication", emoji: "💬", description: "Monitor channels, respond intelligently, filter noise.", status: "connected", authType: "oauth" },
  { id: "email", name: "Email (Gmail/Outlook)", category: "Communication", emoji: "📧", description: "Triage, draft, send, and manage your inbox.", status: "connected", authType: "oauth" },
  { id: "whatsapp", name: "WhatsApp", category: "Communication", emoji: "📱", description: "Personal and business messaging.", status: "available", authType: "api_key" },
  { id: "telegram", name: "Telegram", category: "Communication", emoji: "✈️", description: "Bot integration for messaging.", status: "available", authType: "api_key" },
  { id: "calendar", name: "Google Calendar", category: "Productivity", emoji: "📅", description: "Schedule, optimize, protect focus time.", status: "connected", authType: "oauth" },
  { id: "notion", name: "Notion", category: "Knowledge", emoji: "📝", description: "Read and write to your knowledge base.", status: "connected", authType: "api_key" },
  { id: "drive", name: "Google Drive", category: "Productivity", emoji: "📁", description: "Access and organize documents.", status: "available", authType: "oauth" },
  { id: "hubspot", name: "HubSpot", category: "CRM & Business", emoji: "🤝", description: "Contact management and deal tracking.", status: "connected", authType: "oauth" },
  { id: "salesforce", name: "Salesforce", category: "CRM & Business", emoji: "☁️", description: "Enterprise CRM integration.", status: "available", authType: "oauth" },
  { id: "vapi", name: "Vapi Voice", category: "Voice & Calls", emoji: "🎙️", description: "AI voice calls — screening, appointments, info gathering.", status: "beta", authType: "api_key" },
  { id: "github", name: "GitHub", category: "Developer", emoji: "🐙", description: "Code repositories and PR management.", status: "available", authType: "oauth" },
  { id: "webhooks", name: "Webhooks", category: "Developer", emoji: "🪝", description: "Trigger actions from external events.", status: "available", authType: "webhook" },
  { id: "hub", name: "Hub Specialist (jamal-hub-v2)", category: "Knowledge", emoji: "🧠", description: "Your loaded specialist — domain playbooks and SOPs.", status: "connected", authType: "native" },
];

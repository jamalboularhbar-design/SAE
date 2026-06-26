import { BRAND } from "./brand";

export interface AiToolDefinition {
  name: string;
  description: string;
  path: string;
  category: "Content" | "Discovery" | "Analytics" | "Automation" | "Productivity";
  useCase: string;
  examplePrompt: string;
  featured?: boolean;
  external?: boolean;
}

export const AI_TOOL_CATALOG: AiToolDefinition[] = [
  {
    name: BRAND.nexusOsName,
    description: BRAND.nexusOsTagline,
    path: `${BRAND.nexusOsPath}/`,
    category: "Automation",
    useCase: "Turn a plain-English request into multi-step execution across Slack, Notion, and Gmail.",
    examplePrompt: "Prepare shift briefing for 5 operators — owners, checklist, approval step.",
    featured: true,
    external: true,
  },
  {
    name: "AI Chat Assistant",
    description: "Doc-aware conversational assistant for operational questions.",
    path: "/ai/chat",
    category: "Discovery",
    useCase: "Ask how a process works and get answers grounded in your playbooks.",
    examplePrompt: "What's our escalation path when a provider misses an SLA?",
  },
  {
    name: "Writing Assistant",
    description: "Draft, rewrite, expand, translate, or simplify SOP content.",
    path: "/ai/writer",
    category: "Content",
    useCase: "Turn bullet notes into a full SOP in your company voice.",
    examplePrompt: "Expand this onboarding checklist into a step-by-step SOP with owners.",
  },
  {
    name: "Document Summarizer",
    description: "Executive summaries, key points, and action items from any doc.",
    path: "/ai/summarize",
    category: "Content",
    useCase: "Brief execs on a 12-page playbook in 30 seconds.",
    examplePrompt: "Summarize pricing strategy doc — decisions, risks, next actions.",
  },
  {
    name: "Semantic Search",
    description: "Natural language queries with intent detection.",
    path: "/ai/search",
    category: "Discovery",
    useCase: "Find the right playbook without knowing exact titles or categories.",
    examplePrompt: "Morocco supplier compliance onboarding — which checklists apply?",
  },
  {
    name: "Smart Recommendations",
    description: "Personalized suggestions from reading history and context.",
    path: "/ai/recommendations",
    category: "Discovery",
    useCase: "Surface related docs while someone reads a hiring or launch playbook.",
    examplePrompt: "What should I read after the annual planning OKR system?",
  },
  {
    name: "Template Generator",
    description: "Describe a document — AI generates sections and structure.",
    path: "/ai/templates",
    category: "Content",
    useCase: "Spin up a client-specific SOP template in minutes.",
    examplePrompt: "Create a creative brief intake template for agency clients.",
  },
  {
    name: "Auto-Tag",
    description: "Classify and tag content with confidence scores.",
    path: "/ai/auto-tag",
    category: "Automation",
    useCase: "Keep a growing library organized without manual tagging drudgery.",
    examplePrompt: "Tag this incident response doc — function, urgency, audience.",
  },
  {
    name: "Workflow Builder",
    description: "Plain-English trigger → action sequences.",
    path: "/ai/workflows",
    category: "Automation",
    useCase: "Automate review reminders when a doc goes stale.",
    examplePrompt: "When doc not reviewed in 90 days, notify owner and create task.",
  },
  {
    name: "Meeting Notes",
    description: "Extract actions, decisions, and follow-ups from transcripts.",
    path: "/ai/meeting-notes",
    category: "Productivity",
    useCase: "Convert a leadership sync into assigned follow-ups linked to playbooks.",
    examplePrompt: "Extract action items from this ops standup transcript.",
  },
  {
    name: "Lead Scoring",
    description: "Explainable conversion probability scoring.",
    path: "/ai/lead-scoring",
    category: "Analytics",
    useCase: "Prioritize founding-member and demo requests for sales follow-up.",
    examplePrompt: "Score this agency lead — team size, urgency, fit signals.",
  },
  {
    name: "Sentiment Analysis",
    description: "Trends, keywords, and alerts from feedback.",
    path: "/ai/sentiment",
    category: "Analytics",
    useCase: "Monitor guest or client feedback themes across properties or accounts.",
    examplePrompt: "Summarize sentiment themes from last month's guest feedback.",
  },
];

export const AI_TOOL_CATEGORIES = ["Content", "Discovery", "Analytics", "Automation", "Productivity"] as const;

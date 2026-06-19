/**
 * Seed data for NexusAI PPV workspace — August Bradley model.
 * Maps Playbooks PM, tracking, and insights artifacts.
 */

export const PILLARS = [
  {
    name: "Product",
    icon: "🎯",
    vision: "Ship NexusAI Playbooks as the multi-brand operational intelligence platform.",
    score: 9,
    focus: "SaaS core, AI Hub polish, template export pipeline",
  },
  {
    name: "GTM & Sales",
    icon: "🚀",
    vision: "10 founding customers and $5K MRR within 90 days of launch.",
    score: 10,
    focus: "Cold outreach, demos, Product Hunt, ops leader dinners",
  },
  {
    name: "Finance & Fundraising",
    icon: "💰",
    vision: "Clear unit economics, 12+ months runway, investor pipeline ready.",
    score: 7,
    focus: "MRR tracking, Stripe, investor pipeline database",
  },
  {
    name: "Brand & Content",
    icon: "📣",
    vision: "Thought leadership drives inbound — LinkedIn 3x/week, nurture sequences live.",
    score: 8,
    focus: "LinkedIn calendar, email nurture, press kit",
  },
  {
    name: "Operations",
    icon: "⚙️",
    vision: "Reliable production deploy on Railway, weekly digests automated.",
    score: 8,
    focus: "argbuilder.io → nexusai.ma transition, CI, scheduled crons",
  },
  {
    name: "Customer Success",
    icon: "🤝",
    vision: "Beta agencies succeed — onboarding >60%, content health >75%, NPS >50.",
    score: 7,
    focus: "Private beta (5 agencies), trial nurture Day 0/3/7/12/14",
  },
];

export const PIPELINES = [
  {
    name: "Phase 0 — Foundation & Rebrand",
    pillar: "Product",
    stage: "Done",
    type: "Project",
    priority: "Critical",
    progress: 100,
    notes: "NexusAI Playbooks rebrand merged; Railway deploy on SAE deploy/production branch.",
  },
  {
    name: "Phase 1 — Templates Marketplace",
    pillar: "GTM & Sales",
    stage: "Active",
    type: "Project",
    priority: "High",
    progress: 40,
    notes: "Bundles defined in templateBundles.ts; Gumroad checkout TBD.",
  },
  {
    name: "Phase 2 — SaaS Core (Auth, Multi-tenant, Billing)",
    pillar: "Product",
    stage: "Backlog",
    type: "Project",
    priority: "High",
    progress: 0,
    notes: "Weeks 5–8 in 90-day plan.",
  },
  {
    name: "Product Hunt Launch",
    pillar: "Brand & Content",
    stage: "Active",
    type: "Goal",
    priority: "High",
    progress: 30,
    notes: "See OpsCanvas Product Hunt Launch Guide in Vault.",
  },
  {
    name: "Founding Customer Program (5 customers)",
    pillar: "GTM & Sales",
    stage: "Active",
    type: "Goal",
    priority: "Critical",
    progress: 20,
    notes: "Target $5K MRR by Day 90; daily checklist in Action Zone.",
  },
  {
    name: "Private Beta — 5 Agencies",
    pillar: "Customer Success",
    stage: "Backlog",
    type: "Project",
    priority: "High",
    progress: 0,
    notes: "Week 8 exit criteria: 5 paying beta customers.",
  },
  {
    name: "nexusai.ma DNS & Domain Transition",
    pillar: "Operations",
    stage: "Waiting",
    type: "Project",
    priority: "Medium",
    progress: 10,
    notes: "Interim: argbuilder.io live on Railway.",
  },
];

export const VAULTS = [
  { name: "90-Day Implementation Roadmap", category: "Strategy", type: "Framework", source: "docs/roadmap/90-day-plan.md" },
  { name: "Weekly Metrics Dashboard", category: "Ops", type: "Framework", source: "docs-seed/ARG Builder — Weekly Metrics Dashboard.md" },
  { name: "Founder's Daily Launch Checklist", category: "GTM", type: "Playbook", source: "docs-seed/ARG Builder — Founder's Daily Launch Checklist.md" },
  { name: "GTM Strategy (OpsCanvas / NexusAI)", category: "GTM", type: "Playbook", source: "docs-seed/Go-to-Market Strategy: OpsCanvas by ARG Builder.md" },
  { name: "LinkedIn Content Calendar", category: "GTM", type: "Template", source: "docs-seed/OpsCanvas LinkedIn Content Calendar.md" },
  { name: "Product Hunt Launch Guide", category: "GTM", type: "Playbook", source: "docs-seed/OpsCanvas Product Hunt Launch Guide.md" },
  { name: "Startup Metrics Dashboard Design", category: "Finance", type: "Framework", source: "docs-seed/ARG-Builder: Startup Metrics Dashboard Design.md" },
  { name: "Competitive Battle Cards", category: "Competitive", type: "Reference", source: "App /admin/battle-cards + docs-seed competitive docs" },
  { name: "Template Bundles Catalog", category: "Product", type: "Reference", source: "shared/templateBundles.ts" },
  { name: "NexusAI Positioning", category: "Strategy", type: "Reference", source: "docs/product/positioning.md" },
  { name: "Pricing & Bundles", category: "Finance", type: "Reference", source: "docs/product/pricing.md" },
  { name: "Railway Deploy Runbook", category: "Ops", type: "SOP", source: "docs/deploy/railway.md" },
  { name: "Nurture Email Sequence", category: "GTM", type: "Template", source: "server/nurtureSequence.ts" },
  { name: "RevOps & Attribution Framework", category: "Sales", type: "Framework", source: "docs-seed/ARG-Builder: Revenue Operations (RevOps) Framework.md" },
  { name: "OKR Framework", category: "Strategy", type: "Framework", source: "docs-seed/ARG-Builder-OKR-Framework.md" },
];

export const LAUNCH_TASKS = [
  { task: "Connect Notion MCP or run deploy-ppv script", phase: "Phase 0", status: "In Progress", priority: "Critical", pillar: "Operations" },
  { task: "Publish Starter Pack + Agency Pack on Gumroad", phase: "Phase 1", status: "To Do", priority: "High", pillar: "GTM & Sales" },
  { task: "Create Notion import format for template bundles", phase: "Phase 1", status: "To Do", priority: "High", pillar: "Product" },
  { task: "Wire Gumroad checkout URLs in TemplatesBundlesPage", phase: "Phase 1", status: "To Do", priority: "Medium", pillar: "Product" },
  { task: "Implement auth provider (Clerk/Auth.js)", phase: "Phase 2", status: "To Do", priority: "High", pillar: "Product" },
  { task: "Multi-tenant schema migration", phase: "Phase 2", status: "To Do", priority: "Critical", pillar: "Product" },
  { task: "Stripe subscription products", phase: "Phase 2", status: "To Do", priority: "High", pillar: "Finance & Fundraising" },
  { task: "Invite 5 beta agencies from waitlist", phase: "Phase 2", status: "To Do", priority: "High", pillar: "Customer Success" },
  { task: "Record 60-second Loom demo", phase: "Phase 1", status: "To Do", priority: "Medium", pillar: "Brand & Content" },
  { task: "Set up Cal.com demo booking link", phase: "Phase 1", status: "To Do", priority: "Medium", pillar: "GTM & Sales" },
  { task: "Product Hunt launch day execution", phase: "Phase 3", status: "To Do", priority: "High", pillar: "Brand & Content" },
  { task: "nexusai.ma DNS when domain ready", phase: "Phase 0", status: "To Do", priority: "Low", pillar: "Operations" },
];

export const CONTENT_CALENDAR = [
  { title: "The $4.3M problem — scattered ops docs", channel: "LinkedIn", status: "Published", pillar: "Brand & Content" },
  { title: "Content freshness scoring demo", channel: "LinkedIn", status: "Scheduled", pillar: "Product" },
  { title: "Notion vs NexusAI Playbooks — honest comparison", channel: "LinkedIn", status: "Draft", pillar: "GTM & Sales" },
  { title: "Founder journey — 288 features in 8 months", channel: "LinkedIn", status: "Idea", pillar: "Brand & Content" },
  { title: "Product Hunt launch announcement", channel: "Product Hunt", status: "Draft", pillar: "Brand & Content" },
  { title: "How we documented 280 operational processes", channel: "Blog", status: "Idea", pillar: "Brand & Content" },
];

export const WEEKLY_METRICS = [
  { quadrant: "Acquisition", metric: "LinkedIn post impressions", target: 5000 },
  { quadrant: "Acquisition", metric: "Cold email reply rate (%)", target: 15 },
  { quadrant: "Acquisition", metric: "Demo requests booked", target: 5 },
  { quadrant: "Acquisition", metric: "Website unique visitors", target: 500 },
  { quadrant: "Activation", metric: "Demos conducted", target: 4 },
  { quadrant: "Activation", metric: "New customers signed", target: 1 },
  { quadrant: "Activation", metric: "Total pipeline value (MRR $)", target: 25000 },
  { quadrant: "Activation", metric: "Trial-to-paid conversion (%)", target: 40 },
  { quadrant: "Revenue", metric: "Monthly Recurring Revenue (MRR)", target: 5000 },
  { quadrant: "Revenue", metric: "Total customers", target: 10 },
  { quadrant: "Revenue", metric: "Average Revenue Per Account", target: 500 },
  { quadrant: "Revenue", metric: "Customer Acquisition Cost", target: 1500 },
  { quadrant: "Product", metric: "Weekly Active Users (WAU)", target: 70 },
  { quadrant: "Product", metric: "Average Content Health Score (%)", target: 75 },
  { quadrant: "Product", metric: "Support tickets opened", target: 5 },
  { quadrant: "Product", metric: "NPS score (30-day rolling)", target: 50 },
];

/** Database property schemas for Notion API */
export const DB_SCHEMAS = {
  pillars: {
    title: "Pillars",
    icon: "🏛️",
    properties: {
      Name: { title: {} },
      Icon: { rich_text: {} },
      Vision: { rich_text: {} },
      Status: { select: { options: [{ name: "Active" }, { name: "Paused" }, { name: "Sunset" }] } },
      "Pillar Score": { number: { format: "number" } },
      "Quarterly Focus": { rich_text: {} },
    },
  },
  pipelines: {
    title: "Pipelines",
    icon: "🔀",
    properties: {
      Name: { title: {} },
      Pillar: { rich_text: {} },
      Stage: {
        select: {
          options: [
            { name: "Backlog" },
            { name: "Active" },
            { name: "Waiting" },
            { name: "Done" },
            { name: "Archive" },
          ],
        },
      },
      Type: {
        select: {
          options: [
            { name: "Project" },
            { name: "Goal" },
            { name: "Habit" },
            { name: "Maintenance" },
          ],
        },
      },
      Priority: {
        select: {
          options: [
            { name: "Critical" },
            { name: "High" },
            { name: "Medium" },
            { name: "Low" },
          ],
        },
      },
      Progress: { number: { format: "percent" } },
      Notes: { rich_text: {} },
    },
  },
  vaults: {
    title: "Vaults",
    icon: "🗄️",
    properties: {
      Name: { title: {} },
      Category: {
        select: {
          options: [
            { name: "Strategy" },
            { name: "GTM" },
            { name: "Sales" },
            { name: "Product" },
            { name: "Ops" },
            { name: "Finance" },
            { name: "Templates" },
            { name: "Competitive" },
          ],
        },
      },
      Type: {
        select: {
          options: [
            { name: "Playbook" },
            { name: "SOP" },
            { name: "Framework" },
            { name: "Reference" },
            { name: "Template" },
          ],
        },
      },
      Source: { rich_text: {} },
      Status: {
        select: { options: [{ name: "Current" }, { name: "Draft" }, { name: "Archive" }] },
      },
    },
  },
  salesPipeline: {
    title: "Sales Pipeline",
    icon: "📊",
    properties: {
      Company: { title: {} },
      Contact: { rich_text: {} },
      Stage: {
        select: {
          options: [
            { name: "New" },
            { name: "Contacted" },
            { name: "Qualified" },
            { name: "Demo" },
            { name: "Proposal" },
            { name: "Negotiation" },
            { name: "Won" },
            { name: "Lost" },
          ],
        },
      },
      "MRR Value": { number: { format: "dollar" } },
      "Lead Score": { number: { format: "number" } },
      Source: {
        select: {
          options: [
            { name: "Demo" },
            { name: "ROI Calculator" },
            { name: "Organic" },
            { name: "Referral" },
            { name: "LinkedIn" },
            { name: "Product Hunt" },
          ],
        },
      },
      "Next Action": { rich_text: {} },
    },
  },
  contentCalendar: {
    title: "Content Calendar",
    icon: "📅",
    properties: {
      Title: { title: {} },
      Channel: {
        select: {
          options: [
            { name: "LinkedIn" },
            { name: "Blog" },
            { name: "Product Hunt" },
            { name: "Email" },
            { name: "Video" },
          ],
        },
      },
      Status: {
        select: {
          options: [
            { name: "Idea" },
            { name: "Draft" },
            { name: "Scheduled" },
            { name: "Published" },
          ],
        },
      },
      Pillar: { rich_text: {} },
    },
  },
  meetingTracker: {
    title: "Meeting Tracker",
    icon: "🤝",
    properties: {
      Name: { title: {} },
      Type: {
        select: {
          options: [
            { name: "Demo" },
            { name: "Dinner" },
            { name: "Investor" },
            { name: "Team" },
            { name: "Partner" },
          ],
        },
      },
      Attendees: { rich_text: {} },
      Notes: { rich_text: {} },
      "Follow-ups": { rich_text: {} },
    },
  },
  launchTasks: {
    title: "Launch Tasks",
    icon: "✅",
    properties: {
      Task: { title: {} },
      Status: {
        select: {
          options: [
            { name: "To Do" },
            { name: "In Progress" },
            { name: "Done" },
            { name: "Blocked" },
          ],
        },
      },
      Phase: {
        select: {
          options: [
            { name: "Phase 0" },
            { name: "Phase 1" },
            { name: "Phase 2" },
            { name: "Phase 3" },
            { name: "Phase 4" },
          ],
        },
      },
      Pillar: { rich_text: {} },
      Priority: {
        select: {
          options: [
            { name: "Critical" },
            { name: "High" },
            { name: "Medium" },
            { name: "Low" },
          ],
        },
      },
    },
  },
  weeklyMetrics: {
    title: "Weekly Metrics",
    icon: "📈",
    properties: {
      Metric: { title: {} },
      Quadrant: {
        select: {
          options: [
            { name: "Acquisition" },
            { name: "Activation" },
            { name: "Revenue" },
            { name: "Product" },
          ],
        },
      },
      "This Week": { number: { format: "number" } },
      "Last Week": { number: { format: "number" } },
      Target: { number: { format: "number" } },
      Status: {
        select: {
          options: [
            { name: "On Track" },
            { name: "Watch" },
            { name: "At Risk" },
            { name: "Exceeding" },
          ],
        },
      },
    },
  },
};

# NexusAI Playbooks — Brand Positioning

> **Last updated:** June 2026 · Primary domain: `nexusai.ma` (acquisition in progress)

## Brand Hierarchy

```
NexusAI (parent brand)
├── NexusAI Playbooks    — SaaS product (primary)
├── NexusAI Templates    — Marketplace (acquisition)
└── NexusAI Ops Core     — Open source (expansion)
```

## Parent Brand: NexusAI

**Mission:** Give every business operational superpowers through AI-native documentation.

**Voice:** Confident, operator-friendly, no jargon. Speaks to founders and COOs, not developers.

**Visual identity (recommended):**
- Dark theme (already built — keep it)
- Primary accent: Teal `#14b8a6` + purple `#a855f7` for Intelligence Hub
- Typography: Clean sans-serif (Inter, Geist, or similar)
- Logo: "NexusAI" wordmark with connected-node icon; product mark **NX** (teal/purple gradient)

## Product Rename: ARG Builder → NexusAI Playbooks

| Before | After |
|--------|-------|
| ARG Builder | NexusAI Playbooks |
| Artificial Reference Guide | Operational Playbooks |
| Persona | Workspace (or Brand) |
| Dual Persona System | Multi-Brand Workspaces |
| AI Services Hub | NexusAI Intelligence Hub |
| Quick Edit | Source Editor |
| Document Editor | Playbook Manager |

---

## Domain & Transition Strategy

| Phase | Timeframe | Action | Status |
|-------|-----------|--------|--------|
| **Phase 1** | Weeks 1–2 | Acquire `nexusai.ma`, configure DNS | In progress |
| **Phase 2** | Weeks 3–8 | Launch marketing site on `nexusai.ma` | Staging |
| **Phase 3** | Months 2–3 | Migrate `argbuilder.io` app → `app.nexusai.ma` (Railway) | Post-beta |
| **Phase 4** | Month 6 | 301 redirects; retire `argbuilder.io` branding | TBD |

**Rules during transition:**
- `argbuilder.io` stays live with rebrand notices until Phase 4
- Close CRM / nurture emails updated in Phase 2
- Analytics and UTM migration documented in deploy runbook (Railway)
- Support email: `hello@nexusai.ma` (replacing `hello@argbuilder.io`)

| Domain | Purpose |
|--------|---------|
| `nexusai.ma` | Parent brand + marketing |
| `app.nexusai.ma` | SaaS application (Railway) |
| `templates.nexusai.ma` | Template marketplace |
| `argbuilder.io` | Legacy — redirect after Phase 4 |

---

## Positioning by Audience

### For Agencies (Primary — Path 1)

> **Headline:** One platform. Every brand. Zero chaos.
>
> **Subhead:** NexusAI Playbooks lets agencies manage operational documentation for all their clients in isolated workspaces — with AI-powered search, analytics, and templates that actually get used.

### For Founders / COOs (Path 2)

> **Headline:** 525 operational playbooks. Ready in 5 minutes.
>
> **Subhead:** Skip months of documentation. Deploy battle-tested SOPs for HR, sales, finance, and operations — then upgrade to NexusAI Playbooks when you're ready to customize.

### For DevOps / Privacy Teams (Path 3)

> **Headline:** Your docs. Your server. Your rules.
>
> **Subhead:** NexusAI Ops Core is the open-source documentation engine behind NexusAI Playbooks. Self-host with Docker, extend with plugins, and never depend on a SaaS vendor again.

---

## Messaging by Stakeholder

*How to talk — not just what to say.*

### For Agencies (Operators)

| | |
|---|---|
| **Tone** | Empowering, no-BS operational language |
| **Frame** | Multi-client complexity → sanity |
| **Keywords** | isolation, workspaces, client portals, white-label, playbooks |
| **Objection** | "Is this just Notion for teams?" |
| **Response** | No. Notion is for everything. We're for one thing: running multiple businesses at scale — with 11 AI tools built in. |

### For Founders (High-growth / small teams)

| | |
|---|---|
| **Tone** | Confident, achievement-focused |
| **Frame** | Months of work → 5 minutes + AI refinement |
| **Keywords** | playbooks, templates, repeatability, Intelligence Hub |
| **Objection** | "Why not just use a Google Doc?" |
| **Response** | Because your team needs structure and discoverability — semantic search, versioning, and AI that answers process questions — not a document graveyard. |

### For DevOps / Privacy (Technical)

| | |
|---|---|
| **Tone** | Transparent, control-first |
| **Frame** | Vendor lock-in risk → ownership |
| **Keywords** | self-hosted, Docker, export, plugins, open-source |
| **Objection** | "Why not GitBook + Docker?" |
| **Response** | GitBook is for documentation sites. We're for live operations — SOPs, playbooks, multi-brand workspaces. Choose self-host or SaaS on your terms. |

---

## Positioning by Use Case

### Use Case 1: Multi-Client Agencies

- **Problem:** Each client needs documented SOPs. Docs get lost. Processes drift between brands.
- **Our solve:** One workspace per client, isolated but templated. Search and AI across all client playbooks.
- **Headline:** *"One platform for all your clients' playbooks. Your processes. Their rules."*

### Use Case 2: High-Growth Startups

- **Problem:** Founder holds all knowledge. New hires drown in Slack threads and outdated Google Docs.
- **Our solve:** Starter template pack + NexusAI Intelligence Hub. Ask your playbooks questions instead of pinging Slack.
- **Headline:** *"Deploy battle-tested playbooks. Customize in hours, not months."*

### Use Case 3: Ops Leaders (Scaling)

- **Problem:** Sales, Finance, HR, QA each run different processes. No single source of truth.
- **Our solve:** One home for ops. Multi-brand workspaces when scaling into subsidiaries or franchises.
- **Headline:** *"Operational intelligence for complex organizations."*

---

## Messaging Pillars

1. **Multi-brand by design** — Not a workaround; foundational architecture
2. **Operational, not generic** — Built for SOPs and playbooks, not blank pages
3. **AI that understands your ops** — 11 tools at `/ai`: semantic search, writing assist, doc-aware chat
4. **Templates from real businesses** — 525+ docs from actual operations, not generic filler
5. **Own your knowledge** — SaaS, self-hosted, or export — your choice

---

## Why NexusAI Playbooks Wins

- **Only platform built for multi-brand ops from day one** — Not a pivot or Notion add-on; workspaces are foundational
- **Real SOPs from real businesses** — 525+ proven playbooks vs. blank-page competitors
- **AI that understands context** — NexusAI Intelligence Hub: semantic search + process Q&A on *your* docs, not generic writing
- **Clear upgrade path** — Templates → Playbooks → Ops Core captures free → premium → enterprise
- **Production-grade from day one** — 132 tRPC routers, 364 tests, Stripe + auth already built

---

## Competitive Positioning Map

```
                    Generic ◄──────────────────► Vertical
                         │
              Notion     │     NexusAI Playbooks ★
              Confluence │     (multi-brand ops)
              Coda       │
                         │
    ─────────────────────┼─────────────────────
                         │
              GitBook    │     NexusAI Templates
              Docusaurus │     (operational SOPs)
                         │
              Slite      │
                         │
                    Simple ◄──────────────────► Enterprise
```

**NexusAI's quadrant:** Vertical + Enterprise — multi-brand operational intelligence with AI.

---

## What We Are NOT (And What We Are Instead)

| We Are NOT | We ARE |
|------------|--------|
| Notion replacement | The operational layer for SOPs — isolation, search, AI-powered ops |
| Help desk / support tool | Knowledge engine for *internal* ops (SOPs, processes, playbooks) |
| Developer docs platform | Business operations docs (HR, Sales, Finance, QA, Compliance) |
| General AI writing tool | Operations-specific Intelligence Hub — knows SOP structure, answers process Q&A |

**Net:** We serve ops leaders and agency owners running multiple teams — not individual writers or software doc teams.

---

## Proof Points

| Metric | Value | Why it matters |
|--------|-------|----------------|
| Seeded documents | **525** | Largest pre-built library of operational playbooks in the product |
| AI tools | **11** | Full Intelligence Hub at `/ai` — not a bolt-on |
| tRPC routers | **132** | Purpose-built for multi-workspace ops |
| Tests passing | **364** | Production-grade engineering |
| Template bundles | **280+ docs** (packaged) | $49–$199 proves demand for operational SOPs |

**Track publicly:** GitHub stars (Ops Core launch), template sales velocity, Playbooks trial → paid conversion, Intelligence Hub usage (`aiConfigManager` call counts).

---

## Taglines

1. *"Operational intelligence for every brand you manage"* ← **Recommended primary**
2. *"The playbook platform for multi-brand operators"*
3. *"Document once. Operate everywhere."*
4. *"Already written. AI-powered."* ← Product page hero variant

---

## Website Structure & Conversion Goals

```
nexusai.ma/
├── /                    → NexusAI parent brand (suite overview)
│   └── CTA: "See How It Works" → /playbooks or /templates
├── /playbooks           → SaaS product (pricing, demo, signup)
│   └── CTA: "Start Free Trial" (14-day Pro, no credit card)
├── /templates           → Marketplace (bundles, previews, buy)
│   └── CTA: "Buy Now" + "See in Playbooks" upsell
├── /ops-core            → Open source (GitHub, docs, self-host)
│   └── CTA: "Deploy Free" (Docker) + "Try Hosted" ($49/mo)
├── /pricing             → Unified ladder: Templates → Playbooks → Ops Core
├── /blog                → Ops excellence, case studies, playbook releases
├── /docs                → Product + setup documentation
└── /about               → Team, mission, contact
```

**Current interim:** Product page lives at `argbuilder.io/product` until Railway migration to `app.nexusai.ma`.

---

## How Positioning Connects to Revenue

**See also:**
- [Three-Path Flywheel](./flywheel.md) — How all three audiences feed NexusAI
- [Unified Pricing Model](./pricing.md) — Positioning → price tiers
- [90-Day Launch Plan](../roadmap/90-day-plan.md) — GTM sequence by audience
- [Codebase Audit](./codebase-audit.md) — What's already built vs. what to market

| Positioning pillar | Revenue path |
|--------------------|--------------|
| Multi-brand by design | Playbooks Pro / Enterprise ($599–999+/mo) |
| AI that understands your ops | Plan-tier AI limits + add-on packs ($29/mo) |
| Templates from real businesses | Template sales → 10% trial → 30% paid = **3% to SaaS** |
| Own your knowledge | Ops Core hosted ($49/mo) + enterprise support ($10K+/yr) |

---

## Brand Extensions: What We'll Never Build

- **Projects / task management** — Monday, Asana, Linear territory
- **CMS / website builder** — Webflow, Framer territory
- **Internal comms / wiki-for-everything** — Slack, Notion territory
- **Customer support tools** — Zendesk, Intercom, Document360 territory

**Our perimeter:** Operational documentation, process intelligence, AI-powered ops. Anything else dilutes focus.

---

## Railway Deploy Notes (Positioning → Production)

When pushing rebrand live on Railway (`agent-reference-guide` or SAE `apps/playbooks`):

1. Merge branch with `LandingPage.tsx`, `shared/brand.ts`, Header, AIHubPage changes
2. Set env: `ADMIN_EMAIL=admin@nexusai.ma` (optional branding vars later)
3. Redeploy — verify `/product` shows NexusAI + Intelligence section
4. Phase 3: custom domain `app.nexusai.ma` on Railway service

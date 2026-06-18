# NexusAI Playbooks — Unified Product Strategy

> **ARG Builder becomes NexusAI Playbooks** — the operational intelligence product in the NexusAI suite.

## Executive Summary

All three commercial paths are **not competing options**. They form a single **flywheel** under one NexusAI brand:

```
Templates (acquire) → SaaS (retain) → Open Source (expand) → Enterprise (monetize)
```

| Path | NexusAI Product | Role | Revenue Model |
|------|-----------------|------|---------------|
| **1. Vertical SaaS** | NexusAI Playbooks | Primary revenue engine | $299–999/mo subscriptions |
| **2. Template Marketplace** | NexusAI Templates | Top-of-funnel acquisition | $49–199 one-time + SaaS upsell |
| **3. Open Source Core** | NexusAI Ops Core | Developer adoption + trust | Free OSS → $49–199/mo hosted → $10K+ enterprise |

**Recommendation:** Launch all three in sequence over 90 days, not in parallel. Templates first (fastest validation), SaaS second (recurring revenue), OSS third (community moat).

---

## Why NexusAI?

NexusAI positions as an **AI-native operational platform** — not another Notion clone. The suite story:

| NexusAI Product | Tagline | Audience |
|-----------------|---------|----------|
| **Playbooks** | *"Operational intelligence for every brand you manage"* | Agencies, consultancies, multi-brand operators |
| **Templates** | *"280+ battle-tested SOPs, ready to deploy"* | Founders, COOs, bootstrapped teams |
| **Ops Core** | *"Self-hosted knowledge engine you own"* | Regulated industries, privacy-first orgs |

ARG Builder's existing strengths map directly:
- Dual/multi-persona system → **multi-brand workspaces**
- 280+ documents → **template library seed content**
- Analytics + admin tooling → **enterprise-grade SaaS foundation**
- "AI-Powered" tagline → **NexusAI AI layer** (writing assist, semantic search, Q&A)

---

## Path 1: NexusAI Playbooks (Vertical SaaS)

### Target Market
- Creative agencies managing 2–20 client brands
- Consultancies with distinct service lines
- Holding companies / franchise operators
- Boutique hospitality groups (Riad & Routes archetype)

### Positioning Statement
> *NexusAI Playbooks is the only operational documentation platform built for businesses that run multiple brands — manage SOPs, playbooks, and process docs for every entity you operate, in one AI-powered workspace.*

### Key Differentiators vs. Notion/Confluence
1. **Multi-brand workspaces** — not folders; true persona isolation with shared admin
2. **Operational templates** — pre-built SOP libraries by industry (travel, design, SaaS)
3. **Client portal mode** — controlled doc sharing with external stakeholders
4. **Built-in analytics** — document performance, team adoption, stale doc alerts
5. **NexusAI intelligence** — AI writing, semantic search, process Q&A

### Must-Build Before Launch
- [ ] Multi-tenant architecture (org → workspaces → documents)
- [ ] Auth (email, Google SSO, SAML for enterprise)
- [ ] Stripe billing with workspace-based pricing
- [ ] Rebrand from ARG Builder → NexusAI Playbooks
- [ ] Remove hardcoded Riad & Routes / ArtKech demo content → generic demo workspace
- [ ] Role-based permissions (Owner, Admin, Editor, Viewer, Client)
- [ ] Onboarding flow explaining multi-brand concept

---

## Path 2: NexusAI Templates (Marketplace)

### Target Market
- Bootstrapped founders building ops from scratch
- COOs at 10–50 person companies
- Agency owners who want SOPs before buying SaaS

### Positioning Statement
> *Skip 6 months of documentation. Deploy 280+ operational playbooks used by real businesses — in Notion, Markdown, or NexusAI Playbooks.*

### Product Tiers

| Bundle | Contents | Price | Upsell |
|--------|----------|-------|--------|
| **Starter Pack** | 50 core SOPs (HR, finance, sales) | $49 | → Playbooks trial |
| **Agency Pack** | 100+ agency ops (onboarding, briefs, handoffs) | $99 | → Playbooks Pro |
| **Hospitality Pack** | Riad & Routes playbook library | $149 | → Playbooks Pro |
| **Design Studio Pack** | ArtKech playbook library | $149 | → Playbooks Pro |
| **Complete Library** | All 280+ docs + updates for 1 year | $199 | → Playbooks Enterprise |

### Distribution Channels
- Gumroad / Lemon Squeezy (immediate, no dev needed)
- NexusAI marketing site with Stripe checkout
- Content marketing: "How we documented 280 processes" case study
- Partner with agency communities (Agency Hackers, etc.)

### Must-Build Before Launch
- [ ] Sanitize and package existing 280 docs into themed bundles
- [ ] Export formats: Notion import, Markdown zip, Google Docs
- [ ] Landing pages per bundle with preview screenshots
- [ ] Email nurture sequence → Playbooks free trial
- [ ] Affiliate program (20% commission for agency influencers)

---

## Path 3: NexusAI Ops Core (Open Source)

### Target Market
- DevOps teams wanting self-hosted docs
- Regulated industries (healthcare, finance, legal)
- Privacy-conscious SMBs
- Developers who extend via plugins

### Positioning Statement
> *Own your operational knowledge. NexusAI Ops Core is the open-source engine behind NexusAI Playbooks — self-host, customize, and never lose control of your documentation.*

### Open Source Strategy

| Component | License | Rationale |
|-----------|---------|-----------|
| Document engine (CRUD, search, markdown) | MIT | Drives adoption |
| Multi-workspace system | MIT | Core differentiator |
| Admin panel (basic) | MIT | Self-hosters need it |
| Analytics dashboard | Source-available | Upsell to hosted |
| AI features (writing, Q&A) | Proprietary | Revenue driver |
| Client portal | Proprietary | Enterprise feature |
| NexusAI Templates content | Proprietary | Marketplace revenue |

### Monetization via Open Source
1. **Hosted tier** — $49/mo managed NexusAI Ops Core (we host, you use)
2. **Enterprise support** — $10K–100K/year SLA + custom development
3. **Premium plugins** — AI pack, SSO pack, audit pack
4. **Template marketplace** — same as Path 2, works on OSS too

### Must-Build Before Launch
- [ ] Extract core engine from Playbooks app into `packages/core`
- [ ] Docker Compose one-command deploy
- [ ] MIT license + CONTRIBUTING.md
- [ ] Product Hunt launch
- [ ] Self-hosting docs on nexusai.io/docs

---

## Unified Brand Architecture

```
                    ┌─────────────────────────┐
                    │       NEXUS AI          │
                    │  "Operational Intelligence" │
                    └───────────┬─────────────┘
                                │
            ┌───────────────────┼───────────────────┐
            │                   │                   │
   ┌────────▼────────┐ ┌───────▼───────┐ ┌────────▼────────┐
   │ NexusAI         │ │ NexusAI       │ │ NexusAI         │
   │ Playbooks       │ │ Templates     │ │ Ops Core        │
   │ (SaaS)          │ │ (Marketplace) │ │ (Open Source)   │
   │ $299-999/mo     │ │ $49-199       │ │ Free → $49/mo   │
   └─────────────────┘ └───────────────┘ └─────────────────┘
            │                   │                   │
            └───────────────────┼───────────────────┘
                                │
                    ┌───────────▼─────────────┐
                    │   Shared Platform       │
                    │   • Auth & multi-tenancy│
                    │   • Document engine     │
                    │   • NexusAI AI layer    │
                    │   • Analytics           │
                    └─────────────────────────┘
```

---

## Competitive Moat (Combined)

Running all three paths creates defensibility no single path achieves alone:

1. **Templates → SaaS:** Every template buyer is a warm Playbooks lead
2. **OSS → Enterprise:** Self-hosters upgrade to managed + support
3. **SaaS → Templates:** Paying customers get template library included
4. **Content moat:** 280+ real operational docs are hard to replicate
5. **Vertical focus:** "Multi-brand ops" is a niche Notion won't prioritize
6. **AI layer:** NexusAI intelligence across all products creates switching cost

---

## Success Metrics (12-Month Targets)

| Metric | Month 3 | Month 6 | Month 12 |
|--------|---------|---------|----------|
| Template sales | 50 units | 200 units | 500 units |
| Playbooks MRR | $0 (beta) | $5K | $25K |
| OSS GitHub stars | — | 200 | 1,000 |
| Paying SaaS customers | 0 | 15 | 75 |
| Demo workspaces created | 100 | 500 | 2,000 |

**Path to $1M ARR:** 75 agencies × $833/mo avg = $750K + template revenue + enterprise support = **$1M+**

---

## Immediate Next Steps

1. **Grant GitHub access** to ARG Builder repo → import into `apps/playbooks/`
2. **Week 1–2:** Rebrand, fix category bug, add auth scaffold
3. **Week 3–4:** Package first template bundle (Starter Pack) → Gumroad
4. **Week 5–8:** Multi-tenancy + Stripe → private beta
5. **Week 9–12:** Extract OSS core + Product Hunt launch

See [90-Day Roadmap](../roadmap/90-day-plan.md) for detailed sprint plan.

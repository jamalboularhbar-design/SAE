# NexusAI Playbooks — 90-Day Implementation Roadmap

## Overview

| Phase | Weeks | Focus | Deliverable |
|-------|-------|-------|-------------|
| **0. Foundation** | 1–2 | Import code, rebrand, fix bugs | Dev environment + NexusAI branding |
| **1. Templates** | 3–4 | Package & sell template bundles | Gumroad live, first revenue |
| **2. SaaS Core** | 5–8 | Auth, multi-tenancy, billing | Private beta with 5 agencies |
| **3. AI + Polish** | 9–10 | Rebrand AI Hub, onboarding, UX | Public beta launch |
| **4. Open Source** | 11–12 | Extract core, Docker, launch | GitHub + Product Hunt |

---

## Phase 0: Foundation (Weeks 1–2)

### Week 1: Code Import & Audit

- [ ] Grant GitHub access to ARG Builder repo
- [ ] Import into `apps/playbooks/` (submodule or monorepo merge)
- [ ] Document current tech stack (Next.js version, DB, auth state, deployment)
- [ ] Set up local dev environment with `.env.example`
- [ ] Fix category dropdown bug (document creation modal)
- [ ] Run full test suite / add basic smoke tests
- [x] Set up CI (GitHub Actions: lint, type-check, build)
- [x] NexusAI-branded OG image + favicon (`/og-image.png`, `/favicon.svg`)
- [x] Product landing waitlist capture (`/product`)

### Week 2: Rebrand to NexusAI Playbooks

- [x] Replace "ARG Builder" → "NexusAI Playbooks" across UI
- [x] Replace "Persona" → "Workspace" in UI copy (in progress where applicable)
- [ ] Update meta tags, favicon, OG images
- [x] **Keep live case studies:** Riad & Routes + ArtKech Design Studio (argbuilder.io demos)
- [x] **Add reference verticals:** Atlas Collective Agency + Maison Voyager Hospitality
- [x] Notion PPV Ops Hub + automated upsert sync (82 curated docs-seed)
- [ ] Sanitize template exports into `packages/templates/` (full docs-seed stays read-only)
- [ ] Set up `nexusai.ma` landing page (domain acquisition in progress)

**Exit criteria:** App runs as "NexusAI Playbooks" with 4 vertical demos, live R&R + ArtKech case studies, and Notion ops sync.

---

## Phase 1: Templates Marketplace (Weeks 3–4)

### Week 3: Package Templates

- [x] Organize docs into 5 bundles (`shared/templateBundles.ts` + export script)
- [x] Create Markdown zip exports (`pnpm templates:export`)
- [ ] Create Notion import format for each bundle
- [ ] Design bundle cover images (one per bundle)
- [ ] Write bundle descriptions and preview screenshots
- [ ] Set up Gumroad / Lemon Squeezy store

### Week 4: Launch Templates

- [x] Templates landing page (`/product/templates`) with waitlist + Gumroad-ready checkout
- [ ] Publish Starter Pack ($49) and Agency Pack ($99) on Gumroad
- [ ] Create `templates.nexusai.ma` landing page (or redirect to `/product/templates`)
- [ ] Write launch blog post: "How we documented 280 operational processes"
- [x] Set up email capture → Playbooks waitlist (`product_waitlist` + `template_waitlist`)
- [ ] Post in 3 agency communities (Agency Hackers, Indie Hackers, r/agency)
- [x] Include "Import to NexusAI Playbooks" CTA in every template download README

**Exit criteria:** 2+ template bundles live, 10+ sales, 50+ waitlist emails.

---

## Phase 2: SaaS Core (Weeks 5–8)

### Week 5: Authentication & Users

- [ ] Implement auth provider (Clerk, Auth.js, or Supabase Auth)
- [ ] User registration, login, password reset
- [ ] User profile page
- [ ] Session management
- [ ] Protect all admin routes

### Week 6: Multi-Tenancy

- [ ] Database schema: `organizations` → `workspaces` → `documents`
- [ ] Organization creation on signup
- [ ] Workspace CRUD (create, rename, archive brands)
- [ ] Data isolation middleware (org_id scoping on all queries)
- [ ] Migrate existing demo content into tenant-aware schema
- [ ] Role-based access: Owner, Admin, Editor, Viewer

### Week 7: Billing & Subscriptions

- [ ] Stripe integration (products, prices, checkout)
- [ ] Subscription plans: Starter ($299), Pro ($599)
- [ ] Billing portal (manage subscription, invoices)
- [ ] Usage limits enforcement (workspaces, docs, team members, AI requests)
- [ ] Template purchase credit system (discount first month)

### Week 8: Private Beta

- [ ] Invite 5 agencies from waitlist
- [ ] Onboarding flow (create org → add workspace → import template → invite team)
- [ ] In-app feedback widget
- [ ] Weekly check-in calls with beta users
- [ ] Fix critical bugs from beta feedback

**Exit criteria:** 5 paying beta customers, < 2 critical bugs, onboarding completion rate > 60%.

---

## Phase 3: AI + Polish (Weeks 9–10)

### Week 9: NexusAI Intelligence Hub (already built at `/ai`)

> **Do not rebuild.** The AI Hub already includes writing assist, semantic search, chat, summarizer, auto-tag, meeting notes, workflow builder, sentiment analysis, lead scoring, and template generator.

- [ ] Rebrand AIHubPage → **NexusAI Intelligence Hub**
- [ ] Add `/ai` link to main header navigation (currently buried in command palette)
- [ ] Update landing page hero to showcase existing AI tools
- [ ] Connect plan-tier AI request limits to existing `aiConfigManager` metering
- [ ] Rename routes optionally: `/ai` → `/intelligence` (or keep `/ai` with NexusAI branding)

### Week 10: UX Polish & Public Beta

- [ ] Onboarding tour (highlight multi-brand concept)
- [ ] Categorize admin menu into sections
- [ ] Improve empty states (Reading Lists, etc.)
- [ ] PDF/Markdown export for documents
- [ ] Loading states and skeleton screens
- [ ] Mobile responsive audit
- [ ] Public beta launch on Product Hunt / Hacker News
- [ ] `app.nexusai.ma` production deployment

**Exit criteria:** Public beta live, 20+ signups in first week, AI Hub prominently surfaced in nav and onboarding.

---

## Phase 4: Open Source (Weeks 11–12)

### Week 11: Extract Core Engine

- [ ] Extract document engine into `packages/core/` (MIT license)
- [ ] Extract shared types into `packages/shared/`
- [ ] Docker Compose setup (app + Postgres + Redis)
- [ ] Self-hosting documentation
- [ ] Environment variable reference
- [ ] Basic plugin architecture stub

### Week 12: OSS Launch

- [ ] Publish `nexusai-ops-core` on GitHub (public)
- [ ] Product Hunt launch (coordinate with SaaS beta buzz)
- [ ] Post on Hacker News, r/selfhosted, DevOps communities
- [ ] Hosted tier ($49/mo) live on nexusai.ma/ops-core
- [ ] CONTRIBUTING.md + Code of Conduct
- [ ] GitHub issue templates

**Exit criteria:** 100+ GitHub stars in first 2 weeks, 5+ self-hosters, 2+ hosted conversions.

---

## Technical Architecture (Target State)

```
┌─────────────────────────────────────────────────────┐
│                    apps/playbooks                    │
│              (Next.js — NexusAI Playbooks SaaS)      │
├─────────────────────────────────────────────────────┤
│  packages/core          │  packages/ai              │
│  • Document CRUD        │  • Writing assist         │
│  • Search engine        │  • Semantic search        │
│  • Multi-workspace      │  • Process Q&A            │
│  • Auth middleware      │  • Embeddings pipeline    │
│  • (MIT — open source)  │  • (Proprietary)          │
├─────────────────────────────────────────────────────┤
│  packages/shared        │  packages/templates       │
│  • Types & schemas      │  • 280+ SOP documents     │
│  • Constants            │  • Bundle definitions     │
│  • Utils                │  • Export formatters      │
├─────────────────────────────────────────────────────┤
│  Infrastructure                                      │
│  • Postgres (multi-tenant)  • Redis (cache/queue)   │
│  • S3 (file storage)        • Stripe (billing)      │
│  • Vercel/Railway (hosting) • GitHub Actions (CI)   │
└─────────────────────────────────────────────────────┘
```

## Risk Register

| Risk | Impact | Mitigation |
|------|--------|------------|
| ARG Builder code not multi-tenant ready | High | Budget 2 extra weeks for schema migration |
| No beta agency signups | High | Offer 3 months free Pro for first 10 agencies |
| Template sales too low | Medium | Lower Starter Pack to $29 for launch week |
| OSS launch gets no traction | Low | SaaS + Templates provide revenue regardless |
| AI API costs too high | Medium | Cache responses, rate limit by plan, use smaller models for drafts |

## What I Need From You

1. **GitHub repo URL** for ARG Builder (grant read/write access to `jamalboularhbar-design` org or invite collaborator)
2. **NexusAI domain** — `nexusai.ma` (acquiring; `nexusai.io` too expensive)
3. **Stripe account** — existing or create new for NexusAI?
4. **AI API keys** — OpenAI, Anthropic, or both?
5. **Brand assets** — logo, colors, or should I design interim branding?
6. **Beta agency contacts** — 3–5 agencies to invite for private beta?

Once I have GitHub access, I start Phase 0 immediately.

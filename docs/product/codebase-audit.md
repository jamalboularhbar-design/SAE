# Codebase Audit — agent-reference-guide

> Audit date: June 2026. Informs the revised NexusAI 90-day roadmap.

## Key Finding: You're Further Along Than Expected

The live argbuilder.io deployment exposes a subset of features. The **full codebase** already includes most "Critical" items from the original assessment:

| Capability | Original Assessment | Actual Codebase |
|------------|--------------------|--------------------|
| Authentication | ❌ Missing | ✅ JWT login + TOTP 2FA |
| Stripe billing | ❌ Missing | ✅ 3-tier subscriptions + webhooks |
| Multi-tenancy | ❌ Missing | ✅ Workspaces (Batch 22) |
| AI features | ❌ Not visible | ✅ 10 AI services with LLM |
| SSO/SAML | ❌ Missing | ✅ Admin SSO config page |
| Collaboration | ❌ Missing | ✅ Comments, annotations, activity feed |
| Export formats | ❌ CSV only | ✅ Markdown, DOCX, PDF |
| API | ❌ Missing | ✅ 132 tRPC routers |

## Revised Commercial Viability: 6.5/10 (was 4/10)

The gap is no longer engineering — it's **positioning, rebranding, and go-to-market**.

## Revised 90-Day Priorities

### Weeks 1–2: Rebrand + Position (not rebuild)
- NexusAI Playbooks rebrand (in progress)
- Sanitize demo content → generic agency workspaces
- Update marketing pages for agency vertical positioning
- Configure Stripe products for NexusAI pricing tiers

### Weeks 3–4: Templates Marketplace
- Package 280+ docs into NexusAI Templates bundles
- Gumroad/Lemon Squeezy launch
- Email capture → Playbooks trial funnel

### Weeks 5–6: GTM Launch (not auth/billing — already built)
- Private beta with 5 agencies
- Onboarding flow polish
- Product Hunt / agency community launch

### Weeks 7–8: AI Differentiation
- Surface existing AI tools more prominently
- "Ask your operations" Q&A using existing chat service
- NexusAI branding on AI hub

### Weeks 9–12: Open Source + Scale
- Extract core engine to `open-source/nexusai-ops-core`
- Docker Compose self-hosting
- GitHub public launch

## Remaining Engineering Gaps

1. **Org-level multi-tenancy** — Workspaces exist but need org isolation for true SaaS
2. **Full rebrand sweep** — ~40 client files + server email templates still say "ARG Builder"
3. **Demo content sanitization** — Remove hardcoded Riad & Routes / ArtKech from default seed
4. **nexusai.io domain** — DNS + deployment configuration
5. **Template export pipeline** — Automated Notion/Markdown bundle generation

## Metrics (from PROJECT-SUMMARY.md)

| Metric | Value |
|--------|-------|
| Lines of code | 67,067 |
| Frontend pages | 170 |
| Database tables | 109 |
| tRPC routers | 132 |
| Tests passing | 364 |
| Seeded documents | 525 |
| AI services | 10 |

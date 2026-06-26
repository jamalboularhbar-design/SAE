# ARG-Builder: Segmentation Product Led Growth

## Executive Summary

Product-Led Growth complements ARG-Builder's sales-led motion by creating a self-serve entry point that captures demand from smaller teams, individual operators, and companies in early evaluation stages. The PLG motion targets 20% of total new ARR by Year 3, with a freemium tier that converts at 8–12% to paid plans within 90 days. This strategy defines the free tier boundaries, activation metrics, conversion optimization, and the hybrid PLG + sales-assisted model that maximizes revenue across all segments.

---

## PLG Model Design

### Why Hybrid PLG + Sales-Led

ARG-Builder's target market (mid-market, $50M–$500M revenue) typically requires sales involvement for deals above $2K/month. However, a PLG motion captures three valuable segments that pure sales-led misses:

| Segment | Behavior | Value |
|---------|----------|-------|
| Individual operators | Self-serve evaluation before involving procurement | Pipeline acceleration (30% faster close) |
| Small teams (5–15 people) | Can buy without enterprise procurement | Direct revenue ($500–$2K/month) |
| Champions at large companies | Build internal business case with free tier | Enterprise pipeline generation |

### Freemium Tier Design

The free tier must be valuable enough to demonstrate the product's power while creating natural friction that drives upgrades.

| Feature | Free Tier | Starter ($2K/mo) | Professional ($5K/mo) |
|---------|-----------|-------------------|----------------------|
| Personas | 1 | 3 | Unlimited |
| Team members | 3 | 15 | 50 |
| Process stages | 5 per persona | 7 per persona | Unlimited |
| AI interviews | 2 | 10/month | Unlimited |
| Guide generation | 1 guide | 3 guides | Unlimited |
| Search | Basic | Advanced + filters | Advanced + command palette |
| Export | None | PDF only | PDF + API + integrations |
| Analytics | None | Basic | Advanced + custom |
| Support | Community only | Email (48h SLA) | Priority (4h SLA) |
| Branding | ARG-Builder watermark | Custom branding | White-label |
| Storage | 100MB | 5GB | Unlimited |

### Free Tier Boundaries (Friction Points)

These are the specific moments where free users hit limits and are prompted to upgrade:

| Friction Point | Trigger | Upgrade Message |
|----------------|---------|-----------------|
| Second persona | User tries to create persona #2 | "Upgrade to Starter to manage multiple teams" |
| 4th team member | User invites 4th person | "Your team is growing! Upgrade for up to 15 members" |
| Export attempt | User clicks export/download | "Export your guide to PDF with Starter plan" |
| Advanced search | User tries filters or command palette | "Unlock advanced search with Starter" |
| 30-day mark | Free tier active for 30 days | "You've built something great. Ready to share it with your full team?" |
| Analytics | User looks for usage data | "See how your team uses the guide with Starter analytics" |

---

## Activation Framework

### Activation Definition

A user is "activated" when they complete the core actions that correlate with long-term retention and conversion. Activated free users convert at 3x the rate of non-activated users.

### Activation Milestones

| Milestone | Action | Correlation with Conversion |
|-----------|--------|----------------------------|
| M1: Account created | Sign up with email | Baseline |
| M2: First persona defined | Complete persona questionnaire | 2x conversion |
| M3: Guide generated | AI generates first guide | 4x conversion |
| M4: Team member invited | Invite at least 1 other person | 6x conversion |
| M5: Guide used | 3+ search queries or timeline views | 8x conversion |

**Activation Target:** 40% of signups reach M3 within 7 days, 25% reach M5 within 14 days.

### Activation Optimization

| Tactic | Implementation | Expected Impact |
|--------|---------------|-----------------|
| Onboarding wizard | 3-step guided setup (persona → interview → generate) | +30% M3 completion |
| Progress bar | Visual progress indicator showing next milestone | +15% activation |
| Quick-start templates | Pre-built persona templates by industry | +25% M2 completion |
| Email nurture (Day 1, 3, 7) | Targeted emails based on activation stage | +20% overall activation |
| In-app tooltips | Contextual guidance at each step | +10% activation |
| Social proof | "X companies built their guide this week" | +8% signup-to-M1 |

---

## Conversion Optimization

### Conversion Funnel

| Stage | Target Rate | Optimization Lever |
|-------|-------------|-------------------|
| Visitor → Signup | 5–8% | Landing page, value proposition, social proof |
| Signup → Activated (M3) | 40% | Onboarding, templates, email nurture |
| Activated → Qualified (M5) | 60% | Product value, team invitation prompts |
| Qualified → Paid | 12–18% | Upgrade prompts, trial offers, sales assist |
| Free → Paid (overall) | 8–12% | Full funnel optimization |

### Conversion Triggers

| Trigger | Action | Channel |
|---------|--------|---------|
| User hits persona limit | Show upgrade modal with comparison | In-app |
| User invites 4th member | Upgrade prompt with team pricing | In-app + email |
| 14 days active + M5 reached | Offer 14-day free trial of Starter | Email |
| User searches for premium feature | Contextual upgrade suggestion | In-app |
| 30 days on free tier | "Your trial is ending" urgency email | Email |
| User shares guide link | "Upgrade to remove watermark" | In-app |

### Sales-Assist Triggers (PQL → Sales)

Product Qualified Leads (PQLs) are free users who exhibit buying signals and should receive sales outreach.

| PQL Signal | Score | Sales Action |
|------------|-------|--------------|
| 3+ team members invited | 30 | SDR email outreach |
| Company size > 50 employees (enrichment) | 25 | SDR email + LinkedIn |
| Multiple guides created (hit limit) | 35 | AE direct outreach |
| Visited pricing page 3+ times | 20 | SDR email outreach |
| Exported guide (hit paywall) | 25 | SDR email with offer |
| VP+ title (enrichment) | 30 | AE direct outreach |
| Combined score > 70 | — | Priority AE outreach within 24h |

---

## Self-Serve Monetization

### Pricing Page Design Principles

The pricing page is the highest-leverage conversion asset. Design principles:

| Principle | Implementation |
|-----------|---------------|
| Anchor high | Show Enterprise first (right side), making Professional feel reasonable |
| Highlight recommended | Visual emphasis on Professional tier (most popular badge) |
| Show value, not features | Frame benefits in terms of outcomes, not capabilities |
| Annual discount | 20% discount for annual commitment (shown as monthly equivalent) |
| Social proof | Customer logos and testimonial under each tier |
| FAQ section | Address top 5 objections directly on pricing page |
| Free trial CTA | "Start free" for self-serve, "Talk to sales" for Enterprise |

### Self-Serve Purchase Flow

| Step | Page | Conversion Optimization |
|------|------|------------------------|
| 1 | Pricing page | Clear tier comparison, recommended highlight |
| 2 | Plan selection | Monthly/annual toggle, seat count selector |
| 3 | Payment | Stripe checkout, minimal fields, trust badges |
| 4 | Confirmation | Immediate feature unlock, onboarding next steps |
| 5 | Activation | Guided tour of new features, team invitation prompt |

---

## PLG Metrics & Goals

### Core PLG Metrics

| Metric | Definition | Target |
|--------|-----------|--------|
| Signup rate | Visitors → free accounts | 5–8% |
| Activation rate | Signups → M3 milestone | 40% |
| Free-to-paid conversion | Free → paid within 90 days | 8–12% |
| Time to conversion | Days from signup to paid | < 45 days |
| PQL-to-opportunity rate | PQLs → sales opportunities | 25% |
| Self-serve revenue | Revenue without sales touch | 20% of new ARR (Year 3) |
| Expansion from PLG | PLG customers who upgrade tier | 30% within 12 months |
| Viral coefficient | New signups from existing user invitations | > 0.3 |

### PLG Revenue Projections

| Year | Free Users | Paid Conversions | Self-Serve ARR | Sales-Assisted from PLG | Total PLG-Sourced ARR |
|------|-----------|-----------------|----------------|------------------------|-----------------------|
| Year 1 | 2,000 | 160 (8%) | $384K | $200K | $584K |
| Year 2 | 8,000 | 800 (10%) | $1.9M | $800K | $2.7M |
| Year 3 | 20,000 | 2,400 (12%) | $5.8M | $2.2M | $8.0M |

---

## Implementation Roadmap

| Phase | Timeline | Deliverables |
|-------|----------|-------------|
| Phase 1: Foundation | Months 1–3 | Free tier, signup flow, basic onboarding |
| Phase 2: Activation | Months 3–5 | Onboarding wizard, email nurture, templates |
| Phase 3: Conversion | Months 5–7 | Upgrade prompts, pricing page, self-serve checkout |
| Phase 4: PQL Engine | Months 7–9 | Lead scoring, sales-assist triggers, CRM integration |
| Phase 5: Optimization | Months 9–12 | A/B testing, viral loops, referral program |

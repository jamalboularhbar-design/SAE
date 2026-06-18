# ARG-Builder: Marketing Operations Playbook

## Executive Summary

This playbook defines ARG-Builder's marketing operations infrastructure — the technology stack, lead management processes, attribution modeling, campaign management, and budget allocation frameworks that transform marketing from a cost center into a predictable revenue engine. Marketing Ops ensures every dollar spent is measurable, every lead is properly routed, and every campaign contributes to pipeline generation.

---

## Marketing Technology Stack

### Core Stack

| Layer | Tool | Purpose | Annual Cost |
|-------|------|---------|-------------|
| CRM | HubSpot (Marketing Hub) | Lead management, email, automation | $45K |
| Analytics | Google Analytics 4 + Mixpanel | Web + product analytics | $12K |
| SEO | Ahrefs + Clearscope | Keyword research, content optimization | $8K |
| Advertising | Google Ads + LinkedIn Ads | Paid acquisition | Variable (budget) |
| Social | Buffer + LinkedIn native | Social media management | $3K |
| Email | HubSpot (included) | Nurture sequences, newsletters | Included |
| Content | WordPress + Webflow | Blog, landing pages | $5K |
| ABM | Demandbase or 6sense | Account-based targeting | $30K (Year 2+) |
| Intent data | Bombora or G2 Buyer Intent | Identify in-market accounts | $20K (Year 2+) |
| Enrichment | Clearbit / Apollo | Lead and account enrichment | $15K |
| Attribution | HubSpot + custom (dbt) | Multi-touch attribution | Included + engineering |

### Integration Architecture

| Integration | Data Flow | Purpose |
|-------------|-----------|---------|
| HubSpot → Snowflake | Lead, contact, deal data | Unified analytics |
| GA4 → Snowflake | Web behavior data | Attribution modeling |
| Mixpanel → Snowflake | Product usage data | PLG lead scoring |
| LinkedIn → HubSpot | Ad conversions, lead sync | Campaign attribution |
| Clearbit → HubSpot | Enriched company/contact data | Lead scoring |
| HubSpot → Slack | Lead alerts, deal updates | Real-time notifications |

---

## Lead Management

### Lead Lifecycle Stages

| Stage | Definition | Criteria | Owner |
|-------|-----------|----------|-------|
| Visitor | Anonymous website visitor | Page view | Marketing (automated) |
| Known | Identified (email captured) | Form fill, content download | Marketing (automated) |
| MQL | Marketing Qualified Lead | Lead score > 50, ICP match | Marketing → SDR handoff |
| SAL | Sales Accepted Lead | SDR confirms fit, books meeting | SDR |
| SQL | Sales Qualified Lead | Discovery complete, BANT confirmed | AE |
| Opportunity | Active deal in pipeline | Proposal stage or beyond | AE |
| Customer | Closed-won | Contract signed | CS |

### Lead Scoring Model

| Category | Signal | Points |
|----------|--------|--------|
| **Firmographic** | Company size 100–2,000 employees | +20 |
| | Industry match (target verticals) | +15 |
| | US-based | +10 |
| | Revenue $50M–$500M | +15 |
| **Behavioral** | Visited pricing page | +20 |
| | Downloaded gated content | +10 |
| | Attended webinar | +15 |
| | Requested demo | +30 |
| | Multiple page views (5+) in one session | +10 |
| | Return visit within 7 days | +15 |
| **Engagement** | Opened 3+ emails | +10 |
| | Clicked email CTA | +15 |
| | Engaged with chatbot | +10 |
| **Negative** | Personal email domain | -20 |
| | Student/intern title | -30 |
| | Company size < 20 | -15 |
| | Unsubscribed from emails | -25 |

**MQL Threshold:** 50 points

### Lead Routing Rules

| Criteria | Route To | SLA |
|----------|----------|-----|
| Enterprise (> 500 employees) + demo request | Enterprise AE (round robin) | 5 minutes |
| Mid-market (100–500) + demo request | Mid-market AE (round robin) | 15 minutes |
| MQL (score > 50, no demo request) | SDR (round robin by territory) | 2 hours |
| PLG signup (company > 100 employees) | SDR (PLG specialist) | 24 hours |
| Inbound chat (pricing question) | SDR (next available) | 2 minutes |

---

## Attribution Modeling

### Multi-Touch Attribution Model

ARG-Builder uses a custom W-shaped attribution model that gives credit to the most important touchpoints:

| Touchpoint | Credit | Rationale |
|-----------|--------|-----------|
| First touch | 30% | What brought them to us |
| Lead creation | 30% | What converted them to a lead |
| Opportunity creation | 30% | What moved them to pipeline |
| All middle touches | 10% (split equally) | Nurture and engagement |

### Attribution Reporting

| Report | Frequency | Audience | Key Metrics |
|--------|-----------|----------|-------------|
| Channel performance | Weekly | Marketing team | Leads, MQLs, pipeline by channel |
| Campaign ROI | Monthly | Marketing + leadership | Spend, pipeline generated, CAC by campaign |
| Content attribution | Monthly | Content team | Content pieces → leads → pipeline |
| Full-funnel attribution | Quarterly | Leadership | First touch → closed-won by channel |

---

## Campaign Management

### Campaign Types

| Type | Objective | Frequency | Budget Allocation |
|------|-----------|-----------|-------------------|
| Always-on SEO/content | Organic traffic + leads | Continuous | 25% |
| Paid search (Google) | High-intent capture | Continuous | 20% |
| LinkedIn advertising | Awareness + demand gen | Continuous | 20% |
| Webinars | Education + pipeline | Monthly | 10% |
| Events/conferences | Brand + pipeline | Quarterly | 15% |
| ABM campaigns | Enterprise targeting | Quarterly | 10% |

### Campaign Planning Template

| Field | Content |
|-------|---------|
| Campaign name | [Descriptive name] |
| Objective | [Awareness / Lead gen / Pipeline / Expansion] |
| Target audience | [ICP segment, persona, account list] |
| Channels | [Specific channels and tactics] |
| Budget | [Total + breakdown by channel] |
| Timeline | [Start date → end date] |
| Success metrics | [Primary KPI + secondary KPIs] |
| Content needed | [Assets to create] |
| Team | [Owner + contributors] |

### Campaign Performance Benchmarks

| Channel | CPL Target | MQL Rate | SQL Rate | Pipeline/$ |
|---------|-----------|----------|----------|------------|
| Organic search | $0 (content cost only) | 5% | 20% | $50 pipeline per $1 content |
| Google Ads | $150 | 15% | 25% | $8 pipeline per $1 spent |
| LinkedIn Ads | $250 | 10% | 20% | $5 pipeline per $1 spent |
| Webinars | $75 | 20% | 15% | $12 pipeline per $1 spent |
| Events | $500 | 30% | 30% | $4 pipeline per $1 spent |
| Referrals | $0 | 40% | 50% | Infinite |

---

## Budget Allocation Framework

### Annual Marketing Budget (Year 1: $600K)

| Category | % of Budget | Amount | Purpose |
|----------|-------------|--------|---------|
| Paid acquisition | 35% | $210K | Google Ads, LinkedIn, retargeting |
| Content & SEO | 20% | $120K | Blog, whitepapers, video, SEO tools |
| Events & sponsorships | 15% | $90K | Conferences, webinars, meetups |
| Technology | 12% | $72K | MarTech stack |
| Brand & creative | 10% | $60K | Design, video production, brand assets |
| Experimental | 8% | $48K | New channels, A/B tests, innovation |

### Budget Reallocation Rules

| Trigger | Action |
|---------|--------|
| Channel CAC > 2x target for 30 days | Reduce budget 50%, investigate |
| Channel CAC < 0.5x target for 30 days | Increase budget 25%, scale |
| New channel test shows promise (2 weeks) | Allocate from experimental budget |
| Quarter pipeline target at risk | Shift 20% to highest-performing channels |

---

## Marketing Metrics & Reporting

### Weekly Metrics Dashboard

| Metric | Definition | Target |
|--------|-----------|--------|
| Website visitors | Unique visitors/week | 5,000+ |
| Leads generated | New contacts/week | 100+ |
| MQLs | Leads meeting score threshold | 25+ |
| Demo requests | Direct demo bookings | 10+ |
| Content published | Blog posts + assets/week | 3+ |
| Email engagement | Open rate / click rate | 35% / 5% |

### Monthly Metrics

| Metric | Definition | Target |
|--------|-----------|--------|
| Marketing-sourced pipeline | New pipeline from marketing leads | $500K+ |
| Marketing-influenced pipeline | Pipeline where marketing touched | $1M+ |
| Customer acquisition cost (CAC) | Total marketing spend / new customers | < $15K |
| Marketing % of CAC | Marketing cost / total CAC | < 50% |
| Content ROI | Pipeline generated / content investment | > 10x |
| Channel efficiency | Pipeline per dollar by channel | Varies (see benchmarks) |

---

*Document prepared by Manus AI for ARG-Builder marketing operations.*

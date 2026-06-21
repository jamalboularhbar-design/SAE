# ARG-Builder: Product-Led Sales (PLS) Motion

## Framework for Combining Product-Led Growth with Sales-Assisted Conversion

---

## 1. Executive Summary

Product-Led Sales (PLS) is the hybrid motion that combines the efficiency of product-led growth (PLG) with the effectiveness of sales-assisted conversion. Rather than choosing between "let the product sell itself" and "hire an army of AEs," PLS uses product usage signals to identify the highest-intent accounts and routes them to sales at the optimal moment. This document defines ARG-Builder's complete PLS framework — from signal identification through sales handoff to conversion optimization.

---

## 2. PLS Architecture

### 2.1 Motion Comparison

| Dimension | Pure PLG | Pure Sales-Led | Product-Led Sales |
|-----------|---------|---------------|------------------|
| Acquisition | Self-serve signup | Outbound + inbound | Self-serve + sales assist |
| Qualification | Product usage | BANT/MEDDIC | Product Qualified Lead (PQL) |
| Conversion | Self-serve upgrade | AE-led deal | Hybrid (self-serve + AE for high-value) |
| ACV range | < $10K | > $50K | $10K–$100K+ |
| Sales involvement | None (or minimal) | Full cycle | Targeted, signal-driven |
| Efficiency | High (low CAC) | Lower (high CAC) | Optimal (right-sized CAC) |
| Customer experience | Self-directed | Guided | Best of both |

### 2.2 PLS Funnel

| Stage | Definition | Volume (Monthly) | Conversion |
|-------|-----------|-----------------|-----------|
| Visitors | Website traffic | 50,000 | — |
| Signups | Free trial / freemium | 2,000 | 4% of visitors |
| Activated users | Reached activation milestone | 800 | 40% of signups |
| Product Qualified Leads (PQLs) | High-intent signals detected | 200 | 25% of activated |
| Sales Accepted | AE accepts and engages | 150 | 75% of PQLs |
| Opportunity | Active sales conversation | 80 | 53% of accepted |
| Closed Won | Converted to paid (sales-assisted) | 25 | 31% of opportunities |
| Self-serve conversion (parallel) | Converted without sales | 100 | 12.5% of activated |

---

## 3. Product Qualified Lead (PQL) Definition

### 3.1 PQL Scoring Model

| Signal Category | Signal | Points | Weight |
|----------------|--------|--------|--------|
| Usage depth | Created 10+ guides | 15 | High |
| Usage depth | Used AI generation 20+ times | 10 | High |
| Team adoption | 5+ active users in account | 20 | Critical |
| Team adoption | Users from 2+ departments | 15 | High |
| Feature exploration | Used advanced features (analytics, API) | 10 | Medium |
| Engagement pattern | Active 4+ days/week for 2+ weeks | 15 | High |
| Firmographic fit | Company size > 50 employees | 10 | Medium |
| Firmographic fit | Target industry | 5 | Low |
| Intent signals | Visited pricing page 3+ times | 10 | High |
| Intent signals | Viewed enterprise features | 10 | High |
| Limit approaching | > 80% of plan limits used | 15 | Critical |

### 3.2 PQL Threshold

| Score Range | Classification | Action |
|-------------|---------------|--------|
| 0–30 | Not qualified | Continue nurturing (automated) |
| 31–50 | Warming | Monitor, light-touch outreach |
| 51–70 | PQL (Standard) | Route to SDR for outreach |
| 71–90 | PQL (High Priority) | Route directly to AE |
| 91–100 | PQL (Hot) | Immediate AE outreach (< 1 hour) |

### 3.3 PQL vs. MQL vs. SQL

| Lead Type | Source | Signal | Conversion Rate | Action |
|-----------|--------|--------|----------------|--------|
| MQL | Marketing (content, ads) | Downloaded content, attended webinar | 5–10% to opportunity | SDR qualification |
| PQL | Product usage | High engagement, team adoption, limit approach | 20–40% to opportunity | AE outreach |
| SQL | Sales qualification | Budget, authority, need, timeline confirmed | 30–50% to close | AE deal management |
| PQL + MQL (combined) | Both signals present | Usage + marketing engagement | 40–60% to opportunity | Priority AE outreach |

---

## 4. Signal Detection & Routing

### 4.1 Real-Time Signal Detection

| Signal | Detection Method | Latency | Routing |
|--------|-----------------|---------|---------|
| Pricing page visit (3x) | Product analytics event | Real-time | Alert to assigned AE |
| Team size threshold crossed | User count trigger | Real-time | PQL score update |
| Enterprise feature explored | Feature flag + analytics | Real-time | PQL score update |
| Usage limit approaching | Usage tracking | Hourly | In-app prompt + AE alert |
| Workspace created by target account | Firmographic enrichment | < 1 hour | Priority PQL |
| Multiple users from same domain | Domain clustering | Daily | Account-level PQL |
| Integration connected | Product event | Real-time | Stickiness signal |
| Admin invited users | Product event | Real-time | Team adoption signal |

### 4.2 Routing Logic

| PQL Score | Account Size | Current Plan | Route To |
|-----------|-------------|-------------|----------|
| 51–70 | < 50 employees | Free/Starter | SDR (email sequence) |
| 51–70 | 50–500 employees | Free/Starter | SDR (personalized outreach) |
| 51–70 | > 500 employees | Any | AE (direct) |
| 71–90 | Any | Free/Starter | AE (within 4 hours) |
| 71–90 | > 100 employees | Any | AE (within 2 hours) |
| 91–100 | Any | Any | AE (within 1 hour) |
| Any | — | Approaching limit | In-app upgrade + AE alert |

### 4.3 Account-Level vs. User-Level

| Level | When to Use | Example |
|-------|-------------|---------|
| User-level PQL | Individual power user, self-serve conversion | Solo user hitting limits |
| Account-level PQL | Multiple users, team adoption, enterprise potential | 5 users from Acme Corp all active |
| Combined | Account signals + individual champion identified | Team active + one user on pricing page |

---

## 5. Sales Engagement Playbook

### 5.1 PQL Outreach Approach

| Principle | Implementation |
|-----------|---------------|
| Lead with value, not pitch | "I noticed your team is getting great results with X..." |
| Reference their usage | Show you know what they've done in the product |
| Offer help, not a demo | "Can I help you get more value from Y feature?" |
| Be a consultant, not a seller | Understand their goals, recommend solutions |
| Respect their self-serve preference | Don't force a call if they prefer async |
| Time it right | Reach out when signals are fresh (same day) |
| Multi-channel | Email + in-app + LinkedIn (not all at once) |

### 5.2 Outreach Templates by Signal

| Signal | Subject Line | Opening | CTA |
|--------|-------------|---------|-----|
| Team adoption (5+ users) | "Your team is crushing it with ARG-Builder" | "I noticed 8 people on your team are actively building guides..." | "Quick call to share what similar teams do next?" |
| Pricing page visits | "Thinking about upgrading?" | "I saw you've been exploring our plans..." | "Happy to walk through which plan fits best" |
| Limit approaching | "You're almost at your limit — let's fix that" | "Your team has created 45 of 50 guides on your current plan..." | "Let me unlock more capacity for you" |
| Enterprise feature explored | "Interested in [feature]?" | "I noticed you checked out our SSO/API/analytics..." | "Want me to set up a quick walkthrough?" |
| Power user identified | "You're one of our top users" | "You've created more guides than 95% of users..." | "I'd love to learn what you're building" |

### 5.3 Engagement Cadence

| Day | Channel | Action | If No Response |
|-----|---------|--------|---------------|
| Day 0 | Email | Personalized value-based outreach | — |
| Day 2 | In-app | Contextual message (if feature available) | — |
| Day 4 | Email | Follow-up with specific value prop | — |
| Day 7 | LinkedIn | Connection request + brief note | — |
| Day 10 | Email | Share relevant case study | — |
| Day 14 | Email | "Last touch" — offer async help | Move to nurture |

---

## 6. Self-Serve to Sales-Assist Handoff

### 6.1 Handoff Triggers

| Trigger | From | To | Handoff Method |
|---------|------|-----|---------------|
| Clicks "Talk to Sales" | Self-serve | AE | Immediate routing, < 5 min response |
| Requests enterprise features | Self-serve | AE | In-app → CRM → AE assignment |
| Exceeds self-serve limits | Product | AE | Automated alert + in-app upgrade path |
| Fails self-serve checkout | Self-serve | SDR | Abandoned cart sequence + human follow-up |
| Asks complex pricing question | Support | AE | Support → Sales handoff |
| Multiple users, enterprise domain | Product | AE | Account-level PQL routing |

### 6.2 Handoff Experience (Customer Perspective)

| Step | Customer Experience | Behind the Scenes |
|------|-------------------|------------------|
| 1 | Clicks "Talk to Sales" or triggers PQL | Signal detected, AE assigned |
| 2 | Receives personalized email within 1 hour | AE reviews usage data, crafts message |
| 3 | Books meeting via scheduling link | Calendar sync, prep materials generated |
| 4 | Meeting: AE references their usage, offers value | AE has full product usage context |
| 5 | Receives tailored proposal | Based on actual usage patterns |
| 6 | Closes deal (or returns to self-serve) | Smooth regardless of outcome |

### 6.3 Context Passing

| Data Passed to AE | Source | Purpose |
|-------------------|--------|---------|
| Account name, size, industry | Enrichment (Clearbit/Apollo) | Firmographic context |
| All users and roles | Product database | Relationship mapping |
| Usage metrics (guides, AI, features) | Product analytics | Personalization |
| Activation milestones completed | Product events | Understand maturity |
| Pricing page visits, plan viewed | Analytics | Understand intent |
| Support history | Intercom/Zendesk | Understand experience |
| PQL score and signals | Scoring model | Prioritization |

---

## 7. Conversion Optimization

### 7.1 In-Product Conversion Moments

| Moment | Trigger | Experience | Conversion Path |
|--------|---------|-----------|----------------|
| Limit hit | User reaches plan limit | Modal: "You've reached your limit" + upgrade options | Self-serve upgrade OR talk to sales |
| Feature gate | User clicks locked feature | Tooltip: "Available on Professional plan" + preview | Self-serve upgrade |
| Team growth | Admin adds 5th user | Banner: "Growing team? See team plans" | Plan comparison |
| Success moment | User achieves milestone | Celebration + "Unlock more with upgrade" | Contextual upsell |
| Trial ending | 3 days before trial expires | Email + in-app: value summary + conversion CTA | Self-serve OR sales |

### 7.2 Conversion Rate Benchmarks

| Segment | Self-Serve Conversion | Sales-Assisted Conversion | Blended |
|---------|---------------------|--------------------------|---------|
| Individual users | 8–12% | N/A | 8–12% |
| Small teams (2–10) | 5–8% | 15–25% (if PQL) | 10–15% |
| Mid-market (11–100) | 2–4% | 25–40% (if PQL) | 15–25% |
| Enterprise (100+) | < 1% | 30–50% (if PQL) | 20–35% |

### 7.3 Conversion Experiments

| Experiment | Hypothesis | Metric | Priority |
|-----------|-----------|--------|----------|
| Earlier AE outreach (PQL score 50 vs. 70) | Earlier engagement increases conversion | PQL → Closed Won rate | High |
| In-app chat vs. email for PQL outreach | In-app is higher response rate | Response rate, conversion | High |
| Usage-based pricing page (personalized) | Showing their usage increases urgency | Pricing page → conversion | Medium |
| Video message vs. text email | Video feels more personal | Response rate | Medium |
| Peer comparison ("teams like yours use X") | Social proof drives upgrade | Upgrade rate | Medium |

---

## 8. Metrics & Reporting

### 8.1 PLS Funnel Metrics

| Metric | Definition | Target | Owner |
|--------|-----------|--------|-------|
| PQL volume | New PQLs generated per month | Growing 10% MoM | Product + Growth |
| PQL accuracy | % of PQLs that become opportunities | > 30% | Product + RevOps |
| PQL response time | Time from PQL to first AE touch | < 4 hours (hot: < 1 hour) | Sales |
| PQL → Opportunity | Conversion from PQL to active deal | > 25% | Sales |
| PQL → Closed Won | End-to-end PQL conversion | > 15% | Sales |
| Self-serve conversion | Free → Paid without sales | > 5% of activated | Product |
| Sales-assisted ACV | Average deal size for PLS deals | > $25K | Sales |
| PLS cycle time | Days from PQL to close | < 30 days | Sales |
| CAC (PLS) | Cost to acquire PLS customer | < 12-month payback | Finance |

### 8.2 PLS vs. Other Motions

| Metric | Pure Self-Serve | Product-Led Sales | Outbound Sales |
|--------|----------------|------------------|---------------|
| CAC | $500–$2,000 | $3,000–$8,000 | $15,000–$30,000 |
| ACV | $1K–$10K | $10K–$100K | $50K–$200K+ |
| Sales cycle | 0 days (instant) | 14–45 days | 60–120 days |
| Win rate | 5–10% (of signups) | 25–40% (of PQLs) | 20–30% (of SQLs) |
| NRR | 100–110% | 115–130% | 120–140% |
| Scalability | Very high | High | Medium |

---

## 9. Technology Stack

### 9.1 PLS Technology

| Tool | Purpose | Integration |
|------|---------|-------------|
| Product analytics (Mixpanel/Amplitude) | Usage tracking, PQL signals | Product → scoring |
| PQL scoring (Correlated/Pocus/custom) | Score and route PQLs | Analytics → CRM |
| CRM (Salesforce/HubSpot) | Deal management, AE workflow | Central system |
| Enrichment (Clearbit/Apollo) | Firmographic data | Signup → enrichment |
| Sales engagement (Outreach/Apollo) | AE outreach sequences | CRM → outreach |
| In-app messaging (Intercom/Pendo) | Contextual conversion prompts | Product → user |
| Revenue intelligence (Gong) | Call analysis, deal insights | Calls → CRM |
| Reverse ETL (Census/Hightouch) | Sync product data to sales tools | Warehouse → CRM |

### 9.2 Data Flow

| Step | Source | Destination | Method |
|------|--------|-------------|--------|
| 1 | Product events | Data warehouse | Segment → Snowflake |
| 2 | Firmographic enrichment | Data warehouse | Clearbit → Snowflake |
| 3 | PQL scoring | CRM | Warehouse → Census → HubSpot |
| 4 | PQL alert | AE (Slack/email) | Automated notification |
| 5 | Usage context | CRM account record | Reverse ETL |
| 6 | Deal outcome | Warehouse (feedback loop) | CRM → Fivetran → Snowflake |

---

## 10. Implementation Roadmap

### 10.1 Phase Plan

| Phase | Timeline | Deliverables | Success Metric |
|-------|----------|-------------|---------------|
| Foundation | Month 1–2 | Event tracking, enrichment, basic PQL scoring | PQLs identified |
| Routing | Month 2–3 | PQL → CRM routing, AE assignment, context passing | PQLs reaching AEs |
| Engagement | Month 3–4 | Outreach playbooks, templates, training | AE response rate > 50% |
| Optimization | Month 4–6 | A/B testing, scoring refinement, conversion experiments | PQL accuracy > 30% |
| Scale | Month 6–12 | Automation, self-serve improvements, advanced scoring | PLS = 40%+ of new revenue |

### 10.2 Team Requirements

| Role | Responsibility | When to Hire |
|------|---------------|-------------|
| Growth Engineer | PQL scoring, routing, automation | Phase 1 |
| RevOps Analyst | Reporting, scoring optimization, CRM | Phase 1 |
| PLS AEs (hybrid) | PQL engagement, consultative selling | Phase 2 |
| Product Manager (Growth) | In-product conversion, experimentation | Phase 3 |
| Data Analyst | PQL model refinement, funnel analysis | Phase 4 |

---

*Document prepared by Manus AI. Product-led sales motion framework designed for ARG-Builder optimal hybrid conversion combining product signals with human sales expertise.*

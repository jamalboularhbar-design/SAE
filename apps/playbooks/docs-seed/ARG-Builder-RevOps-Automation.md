# ARG-Builder: Revenue Operations Automation

## End-to-End Automation of the Revenue Engine from Lead to Renewal

---

## 1. Executive Summary

Revenue Operations (RevOps) automation eliminates manual handoffs, reduces data entry, accelerates pipeline velocity, and ensures no revenue opportunity falls through the cracks. For ARG-Builder, automating the revenue engine is critical to scaling from $2M to $25M ARR without proportionally scaling headcount. This playbook defines every automation across the lead-to-cash lifecycle.

---

## 2. RevOps Automation Framework

### 2.1 Revenue Lifecycle Stages

```
Lead Capture → Lead Scoring → Lead Routing → Opportunity Creation →
Pipeline Management → Forecasting → Close/Won → Onboarding Handoff →
Renewal Management → Expansion Identification → Revenue Recognition
```

### 2.2 Automation Maturity Model

| Level | Description | Manual Effort | ARG-Builder Target |
|-------|-------------|---------------|-------------------|
| 1 — Manual | All processes human-driven | 100% | — |
| 2 — Assisted | Alerts and notifications | 70% | — |
| 3 — Semi-automated | Rules-based automation | 40% | Year 1 |
| 4 — Automated | AI-driven with human oversight | 15% | Year 2 |
| 5 — Autonomous | Self-optimizing revenue engine | 5% | Year 3+ |

---

## 3. Lead Management Automation

### 3.1 Lead Capture Automation

| Source | Automation | Tool | SLA |
|--------|-----------|------|-----|
| Website form | Auto-create lead in CRM + enrich | HubSpot + Clearbit | < 1 min |
| Content download | Score + nurture sequence | HubSpot + Customer.io | < 1 min |
| Demo request | Alert SDR + auto-schedule | Calendly + Slack | < 5 min |
| Referral link | Tag source + notify referrer | Custom + CRM | < 1 min |
| Event/webinar | Import + score + route | Zoom + HubSpot | < 1 hour |
| Product sign-up (PLG) | Create lead + trigger onboarding | Product + CRM | Real-time |
| Chatbot conversation | Qualify + route or nurture | Intercom + CRM | Real-time |

### 3.2 Lead Scoring Automation

**Scoring Model:**

| Signal | Points | Decay | Source |
|--------|--------|-------|--------|
| ICP fit (company size) | +20 | None | Enrichment |
| ICP fit (industry) | +15 | None | Enrichment |
| ICP fit (title/role) | +15 | None | Enrichment |
| Website visit (pricing page) | +10 | -2/week | Analytics |
| Content download | +5 | -1/week | MAP |
| Demo request | +30 | None | Form |
| Email engagement (open) | +2 | -1/week | MAP |
| Email engagement (click) | +5 | -1/week | MAP |
| Webinar attendance | +10 | -2/week | Event |
| ROI calculator completed | +20 | None | Product |
| Multiple stakeholders engaged | +15 | None | CRM |
| Competitor evaluation signal | +25 | None | Intent data |

**Routing Thresholds:**

| Score | Action | Owner |
|-------|--------|-------|
| 0–30 | Nurture sequence | Marketing |
| 31–60 | SDR outreach (warm) | SDR |
| 61–80 | SDR priority outreach | SDR |
| 81–100 | Immediate AE engagement | AE |
| 100+ | Fast-track (executive involvement) | AE + Manager |

### 3.3 Lead Routing Rules

| Criterion | Routing Logic | Fallback |
|-----------|-------------|----------|
| Company size > 1,000 | Enterprise AE (round-robin) | Manager assignment |
| Company size 200–1,000 | Mid-market AE (round-robin) | SDR qualification first |
| Industry = Financial Services | Vertical specialist | General AE |
| Industry = Healthcare | Vertical specialist | General AE |
| Inbound demo request | Fastest available AE | Round-robin |
| Referral from customer | Original AE relationship | Account-based routing |
| Geographic territory | Territory-based AE | Round-robin |

---

## 4. Pipeline Automation

### 4.1 Opportunity Stage Automation

| Stage | Auto-Actions | Triggers |
|-------|-------------|----------|
| Discovery | Create opp, assign AE, start timer | First qualified meeting |
| Demo/Evaluation | Schedule follow-up, send resources | Demo completed |
| Proposal | Generate proposal, track opens | Verbal interest confirmed |
| Negotiation | Alert legal, create contract | Proposal accepted |
| Closed Won | Trigger onboarding, notify CS, update billing | Contract signed |
| Closed Lost | Win/loss survey, nurture re-entry | Deal marked lost |

### 4.2 Pipeline Hygiene Automation

| Rule | Trigger | Action |
|------|---------|--------|
| Stale opportunity | No activity for 14 days | Alert AE + manager |
| Overdue close date | Past expected close | Force update or justify |
| Missing fields | Required fields empty | Block stage advancement |
| Unrealistic pipeline | > 5x quota in early stages | Manager review flag |
| Ghost opportunity | No customer engagement 30 days | Auto-move to "at risk" |
| Duplicate detection | Same company + similar timeline | Merge prompt |

### 4.3 Deal Desk Automation

| Process | Automation | Approval Flow |
|---------|-----------|---------------|
| Standard pricing | Auto-generate quote | No approval needed |
| Discount 0–10% | Auto-generate with discount | AE authority |
| Discount 11–20% | Generate + route for approval | Manager approval |
| Discount 21%+ | Generate + executive route | VP/CEO approval |
| Custom terms | Flag for legal review | Legal + finance |
| Multi-year deal | Calculate and apply discount | Auto-calculate |
| Enterprise custom | Manual quote + approval chain | Full review |

---

## 5. Forecasting Automation

### 5.1 Forecast Model

| Component | Calculation | Confidence |
|-----------|-------------|-----------|
| Committed | Closed-won + verbal commits | 95% |
| Best case | Committed + high-probability pipeline | 70% |
| Pipeline | All qualified opportunities × stage probability | Variable |
| Upside | Early-stage + expansion signals | 30% |

### 5.2 Automated Forecast Inputs

| Input | Source | Automation |
|-------|--------|-----------|
| Stage probabilities | Historical win rates by stage | Auto-calculated quarterly |
| Deal velocity | Average days in each stage | Auto-tracked |
| Rep performance | Individual conversion rates | Auto-weighted |
| Seasonal patterns | Historical monthly patterns | Auto-adjusted |
| Pipeline coverage | Current pipeline vs. target | Real-time dashboard |
| Expansion forecast | Health score + expansion signals | Predictive model |

### 5.3 Forecast Cadence Automation

| Frequency | Report | Recipients | Automation |
|-----------|--------|-----------|-----------|
| Daily | Pipeline changes | Sales team | Auto-generated Slack digest |
| Weekly | Forecast roll-up | Sales leadership | Auto-generated report |
| Monthly | Revenue forecast | Executive team | Dashboard + commentary |
| Quarterly | Board forecast | Board | Auto-generated deck section |

---

## 6. Post-Sale Automation

### 6.1 Onboarding Handoff

| Step | Trigger | Automation | SLA |
|------|---------|-----------|-----|
| CS assignment | Deal closed-won | Auto-assign based on segment/tier | Immediate |
| Welcome email | CS assigned | Templated email with next steps | < 1 hour |
| Kickoff scheduling | Welcome sent | Auto-propose 3 time slots | < 24 hours |
| Account setup | Contract signed | Auto-provision, configure plan | < 4 hours |
| Data migration | Kickoff completed | Trigger migration workflow | Per plan |
| Training scheduling | Setup complete | Auto-schedule based on tier | < 48 hours |
| Success plan creation | Kickoff completed | Template populated with deal context | < 24 hours |

### 6.2 Renewal Automation

| Timeline | Action | Automation |
|----------|--------|-----------|
| 120 days before | Renewal flag in CRM | Auto-create renewal opportunity |
| 90 days before | Health assessment | Auto-generate renewal risk report |
| 90 days before | CSM notification | Alert with account context |
| 60 days before | Renewal proposal | Auto-generate based on usage + tier |
| 45 days before | Customer outreach | Templated email with proposal |
| 30 days before | Escalation (if no response) | Manager alert |
| 14 days before | Final notice | Auto-email with urgency |
| 0 days (renewal date) | Auto-renew OR expire | Based on contract terms |
| +7 days (if lapsed) | Win-back sequence | Auto-triggered |

### 6.3 Expansion Automation

| Trigger | Automation | Owner |
|---------|-----------|-------|
| Seat utilization > 85% | In-app prompt + CSM alert | Product + CS |
| Feature limit hit (3x/month) | Upgrade suggestion + CSM notification | Product + CS |
| Expansion score > 80 | Create expansion opportunity in CRM | CS → Sales |
| Champion promoted | Alert AE + congratulations email | Sales |
| Company funding round | Alert AE + growth messaging | Sales |
| QBR positive outcome | Auto-propose expansion options | CS |
| Multi-department usage detected | Cross-sell opportunity created | CS → Sales |

---

## 7. Revenue Recognition Automation

### 7.1 Billing Automation

| Event | Automation | System |
|-------|-----------|--------|
| New subscription | Create billing schedule | Stripe |
| Upgrade/downgrade | Prorate and adjust | Stripe |
| Seat addition | Immediate charge or next cycle | Stripe |
| Renewal | Auto-charge on renewal date | Stripe |
| Failed payment | Retry sequence (3 attempts) | Stripe + Dunning |
| Cancellation | Process final invoice | Stripe |
| Refund | Process per policy | Stripe + Manual approval |

### 7.2 Revenue Recognition Rules

| Scenario | Recognition Method | Automation |
|----------|-------------------|-----------|
| Monthly subscription | Recognize monthly | Auto (ASC 606 compliant) |
| Annual prepay | Recognize monthly (1/12) | Auto-deferred revenue |
| Multi-year | Recognize monthly over term | Auto-deferred revenue |
| Implementation fee | Recognize over implementation period | Semi-auto |
| Usage overage | Recognize when invoiced | Auto |
| Refund/credit | Reverse in period issued | Auto |

---

## 8. Reporting & Analytics Automation

### 8.1 Automated Reports

| Report | Frequency | Recipients | Content |
|--------|-----------|-----------|---------|
| Daily revenue digest | Daily (8 AM) | Sales + CS | New MRR, churn, expansion |
| Weekly pipeline report | Monday (9 AM) | Sales leadership | Pipeline changes, forecast |
| Monthly board metrics | 1st of month | Executives + Board | Full revenue dashboard |
| Quarterly business review | End of quarter | All leadership | Comprehensive analysis |
| Real-time alerts | As triggered | Relevant owner | Churn risk, expansion, issues |

### 8.2 Dashboard Automation

| Dashboard | Audience | Key Metrics | Refresh |
|-----------|----------|-------------|---------|
| Revenue overview | All | MRR, ARR, growth, churn | Real-time |
| Sales performance | Sales | Pipeline, quota, velocity | Real-time |
| CS health | CS | Health scores, NRR, CSAT | Real-time |
| Marketing attribution | Marketing | Pipeline sourced, CAC, ROI | Daily |
| Executive summary | C-suite | Rule of 40, burn, runway | Daily |
| Board deck | Board | All key metrics | Monthly |

---

## 9. Technology Stack

### 9.1 RevOps Tool Stack

| Layer | Tool | Purpose | Integration |
|-------|------|---------|-------------|
| CRM | Salesforce or HubSpot | System of record | Central hub |
| Sales engagement | Outreach or Salesloft | Sequence automation | CRM sync |
| CPQ | DealHub or PandaDoc | Quote-to-cash | CRM + billing |
| Billing | Stripe | Payment processing | CRM + accounting |
| Analytics | Looker or Metabase | Reporting | Data warehouse |
| Data warehouse | Snowflake | Unified data | All sources |
| Orchestration | Workato or Tray.io | Workflow automation | All systems |
| Enrichment | Clearbit or ZoomInfo | Data quality | CRM + MAP |
| Forecasting | Clari or Gong Forecast | AI-powered forecast | CRM |
| CS platform | Gainsight or Vitally | Customer health | CRM + product |

### 9.2 Integration Architecture

| Integration | Direction | Method | Frequency |
|-------------|-----------|--------|-----------|
| CRM ↔ Product | Bidirectional | API + webhooks | Real-time |
| CRM → Billing | One-way | API | On event |
| Product → CDP | One-way | Event stream | Real-time |
| CDP → CRM | One-way | API sync | Every 15 min |
| CRM → Analytics | One-way | ETL | Hourly |
| Billing → Accounting | One-way | API | Daily |
| Marketing → CRM | One-way | Native integration | Real-time |

---

## 10. Implementation Priority

### 10.1 Quick Wins (Month 1–2)

| Automation | Impact | Effort | Priority |
|-----------|--------|--------|----------|
| Lead routing rules | High | Low | P0 |
| Opportunity stage automation | High | Low | P0 |
| Renewal reminders (90/60/30 day) | High | Low | P0 |
| Daily revenue digest | Medium | Low | P1 |
| Stale pipeline alerts | Medium | Low | P1 |

### 10.2 Foundation (Month 3–4)

| Automation | Impact | Effort | Priority |
|-----------|--------|--------|----------|
| Lead scoring model | High | Medium | P0 |
| Onboarding handoff workflow | High | Medium | P0 |
| Forecast automation | High | Medium | P1 |
| Deal desk approval routing | Medium | Medium | P1 |
| Expansion trigger alerts | High | Medium | P0 |

### 10.3 Advanced (Month 5–8)

| Automation | Impact | Effort | Priority |
|-----------|--------|--------|----------|
| Predictive churn model | Very High | High | P0 |
| AI-powered forecasting | High | High | P1 |
| Revenue recognition automation | High | High | P1 |
| Cross-system orchestration | High | High | P1 |
| Self-serve expansion (PLG) | Very High | High | P0 |
